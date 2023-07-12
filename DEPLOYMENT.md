# MarketHub Deployment Guide

This guide will walk you through deploying MarketHub to Vercel and setting up all required services.

## Prerequisites

Before deploying, make sure you have:
- A GitHub account
- A Vercel account
- A Supabase account
- A Stripe account
- An OpenAI account (for AI features)

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/markethub.git
git push -u origin main
```

## Step 2: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy the following values:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Project API Keys > `anon` public (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Project API Keys > `service_role` secret (`SUPABASE_SERVICE_ROLE_KEY`)

4. Go to the SQL Editor and run the schema:
   - Open `sql/supabase_schema.sql`
   - Copy all SQL and paste into the SQL Editor
   - Click "Run"

5. (Optional) Insert sample data:
   - Open `sql/sample_data.sql`
   - Execute the SQL statements

6. Set up Storage buckets:
   - Go to Storage in the sidebar
   - Create three buckets: `products`, `avatars`, `vendors`
   - Set each bucket to public

## Step 3: Set Up Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys:
   - Publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - Secret key (`STRIPE_SECRET_KEY`)

3. Create subscription products (for membership tiers):
   - Go to Products > Add Product
   - Create three products: Basic, Premium, Enterprise
   - Add recurring prices for each
   - Copy the price IDs for your environment variables

4. Set up webhook:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret (`STRIPE_WEBHOOK_SECRET`)

## Step 4: Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create a new API key
3. Copy the API key (`OPENAI_API_KEY`)

## Step 5: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   OPENAI_API_KEY=sk-your_openai_key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

6. Click "Deploy"

## Step 6: Update Stripe Webhook URL

After deployment:
1. Go to Stripe Dashboard > Developers > Webhooks
2. Update the webhook endpoint URL to your production URL:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```

## Step 7: Configure Supabase Auth

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set Site URL to your production URL
3. Add your production URL to Redirect URLs

## Step 8: Test Your Deployment

1. Visit your deployed site
2. Test user registration and login
3. Test vendor registration
4. Test product browsing and cart functionality
5. Test Stripe payments (use test card numbers)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | No (AI features) |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run type-check`

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check if RLS policies are properly configured

### Stripe Payment Failures
- Verify Stripe keys are correct
- Check webhook configuration
- Review Stripe Dashboard logs

### Authentication Issues
- Verify Supabase Auth configuration
- Check redirect URLs in Supabase

## Production Checklist

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] Stripe webhooks configured
- [ ] Supabase Auth URLs configured
- [ ] Test user flow completed
- [ ] Test vendor flow completed
- [ ] Test payment flow completed
- [ ] SSL certificate active (Vercel provides this)

## Support

For issues or questions:
- Check the README.md
- Review Vercel logs
- Check Supabase logs
- Review Stripe Dashboard

## Updating Your Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```
3. Vercel will automatically deploy the new version

---

Happy selling with MarketHub!
