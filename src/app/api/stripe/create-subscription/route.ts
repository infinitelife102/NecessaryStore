import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId, planType } = await request.json();

    if (!priceId || !planType) {
      return NextResponse.json(
        { error: 'Price ID and plan type are required' },
        { status: 400 }
      );
    }

    let customer = customerId;

    // Create customer if not exists
    if (!customer) {
      const { data } = await request.json();
      const newCustomer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          userId: data.userId,
        },
      });
      customer = newCustomer.id;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        planType,
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      customerId: customer,
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
