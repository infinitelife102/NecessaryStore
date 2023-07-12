import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order payment status
        if (paymentIntent.metadata.orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
            })
            .eq('id', paymentIntent.metadata.orderId);
        }

        // Record payment
        await supabase.from('payments').insert({
          order_id: paymentIntent.metadata.orderId,
          user_id: paymentIntent.metadata.userId,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_charge_id: paymentIntent.latest_charge as string,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: 'succeeded',
          payment_method: paymentIntent.payment_method as string,
          metadata: paymentIntent.metadata,
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        if (paymentIntent.metadata.orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
            } as any)
            .eq('id', paymentIntent.metadata.orderId);
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase.from('subscriptions').upsert({
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          plan_type: subscription.metadata?.planType ?? 'basic',
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }, {
          onConflict: 'stripe_subscription_id',
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
