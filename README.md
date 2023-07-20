# MarketHub - Multi-Vendor E-Commerce Platform

A comprehensive multi-vendor e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Stripe.

## Features

### User Features
- **Authentication**: Email/password login, registration, and Google OAuth
- **Product Catalog**: Browse products by category, search, filter, and sort
- **Product Details**: View product information, images, reviews, and ratings
- **Shopping Cart**: Add/remove items, update quantities, persistent cart
- **Wishlist**: Save favorite products for later
- **Checkout**: Secure payment processing with Stripe Elements
- **Order History**: View past orders and track order status
- **User Profile**: Manage account settings and avatar

### Vendor Features
- **Vendor Registration**: Apply to become a seller with document upload
- **Vendor Dashboard**: Manage products, view sales analytics, track orders
- **Product Management**: Create, edit, and delete products
- **Order Management**: View and manage customer orders
- **Sales Analytics**: Track revenue, orders, and performance metrics

### Admin Features
- **Admin Dashboard**: Real-time analytics with charts
  - Total revenue, orders, customers, and products
  - Percentage changes comparing current vs previous month
  - 7-day revenue and order charts (real data from database)
- **Product Management**: CRUD operations for all products
- **Vendor Management**: Approve/reject vendor applications
- **Order Management**: View and manage all orders
- **User Management**: View customer accounts

### AI Features (Grok API)
- **Product Description Generation**: AI-powered product descriptions
- **Review Summarization**: Summarize customer reviews

### Additional Features
- **Newsletter Subscription**: Email signup for marketing
- **Contact Form**: Customer support inquiries
- **Static Pages**: About, FAQ, Privacy Policy, Terms, Shipping, Returns, Help

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (Checkout, Subscriptions)
- **AI**: Grok API (xAI)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (AI, Stripe webhooks)
│   ├── auth/              # Authentication pages
│   ├── vendor/            # Vendor portal pages
│   ├── vendors/           # Public vendor pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── wishlist/          # Wishlist page
│   ├── orders/            # Order history page
│   ├── profile/           # User profile page
│   ├── products/          # Product catalog and details
│   ├── categories/        # Category browsing
│   └── ...                # Static pages (about, faq, etc.)
├── components/            # React components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer with newsletter
│   └── providers.tsx      # Context providers
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── cart-context.tsx   # Cart state management
│   ├── wishlist-context.tsx # Wishlist state management
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
    ├── index.ts           # Main types
    └── database.ts        # Database types
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Grok (xAI) Configuration
GROK_API_KEY=your_grok_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `sql/supabase_schema.sql`
3. (Optional) Run sample data from `sql/sample_data.sql`

### Key Tables

- `profiles` - User profiles
- `vendors` - Vendor information
- `categories` - Product categories
- `products` - Product listings
- `reviews` - Product reviews
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart items
- `wishlist_items` - Wishlist items
- `newsletter_subscriptions` - Newsletter subscribers
- `contact_messages` - Contact form submissions

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your credentials.

3. **Set up the database**:
   Run the SQL scripts in the Supabase SQL Editor.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Important Notes

- Set up Stripe webhooks for production
- Configure Google OAuth in Supabase
- Update `NEXT_PUBLIC_APP_URL` for production

## API Routes

### AI Endpoints
- `POST /api/ai/generate-description` - Generate product descriptions
- `POST /api/ai/summarize-reviews` - Summarize product reviews

### Stripe Endpoints
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/create-subscription` - Create subscription
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Admin Dashboard Real Data

The admin dashboard now uses real data from Supabase:

- **Stats Cards**: Show percentage changes comparing current month vs previous month
  - Formula: `((current - previous) / previous) × 100`
  
- **Charts**: Display actual revenue and orders for the last 7 days
  - Data is grouped by day of week
  - Fetched from `orders` table with `payment_status = 'paid'`

## License

MIT License
