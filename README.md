# MarketHub - Multi-Vendor E-Commerce Platform

A comprehensive, production-ready multi-vendor e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

![MarketHub](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200)

## Features

### Core Features
- **Multi-Vendor Marketplace**: Vendors can register, manage their stores, and sell products
- **Product Management**: Full CRUD operations with categories, variants, and inventory
- **Shopping Cart & Checkout**: Seamless shopping experience with Stripe payment integration
- **Order Management**: Complete order lifecycle from placement to delivery
- **User Authentication**: Email/password and Google OAuth authentication
- **Role-Based Access**: Customer, Vendor, and Admin roles

### Advanced Features
- **AI-Powered Tools**: 
  - Automatic product description generation using OpenAI GPT
  - Review summarization and sentiment analysis
- **Subscription System**: Membership tiers with Stripe Subscriptions
- **Admin Dashboard**: Comprehensive analytics with charts and reports
- **Real-time Updates**: Live inventory and order status updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Vendor Features
- Vendor registration and store setup
- Product management dashboard
- Sales analytics and reporting
- Commission tracking
- Order fulfillment management

### Admin Features
- Complete platform management
- Vendor approval and verification
- Sales analytics and charts
- User management
- Content moderation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (Payments & Subscriptions)
- **AI**: OpenAI GPT API
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/markethub.git
cd markethub
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema in the Supabase SQL Editor:
   - Open `sql/supabase_schema.sql`
   - Copy and execute all SQL statements
   
3. (Optional) Insert sample data:
   - Open `sql/sample_data.sql`
   - Execute the SQL statements

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

4. Create subscription products in Stripe Dashboard and add price IDs to your environment variables

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── products/           # Product pages
│   │   ├── vendor/             # Vendor dashboard
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript types
│   └── types/                  # Type definitions
├── sql/                        # Database SQL files
├── docs/                       # Documentation
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Dependencies
```

## Database Schema

### Core Tables
- **profiles**: User profiles extending auth.users
- **vendors**: Vendor/store information
- **categories**: Product categories (hierarchical)
- **products**: Product information
- **product_variants**: Product variants (size, color, etc.)
- **reviews**: Product reviews and ratings
- **carts**: Shopping carts
- **orders**: Order information
- **order_items**: Individual order items
- **subscriptions**: User subscriptions
- **payments**: Payment records
- **wishlists**: User wishlists
- **coupons**: Discount coupons
- **analytics**: Sales analytics data

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure API endpoints
- Protected admin routes

## API Routes

### Authentication
- `POST /api/auth/*` - Supabase Auth handlers

### Payments
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/create-subscription` - Create subscription
- `POST /api/webhooks/stripe` - Stripe webhook handler

### AI
- `POST /api/ai/generate-description` - Generate product description
- `POST /api/ai/summarize-reviews` - Summarize product reviews

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy

### Environment Variables for Vercel

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

### Stripe Webhook in Production

Update your Stripe webhook URL to your production domain:
```
https://your-domain.com/api/webhooks/stripe
```

## Features in Detail

### Multi-Vendor System
- Vendors can register and create their own store
- Each vendor has a unique storefront URL
- Commission-based revenue sharing
- Vendor analytics and reporting

### Product Management
- Multiple product images
- Product variants (size, color, etc.)
- Inventory tracking
- SEO optimization
- Product categories and tags

### Shopping Experience
- Add to cart functionality
- Wishlist feature
- Product search and filtering
- Product reviews and ratings
- Related products

### Payment System
- Stripe integration for secure payments
- Multiple payment methods support
- Subscription billing
- Automatic invoice generation

### Admin Dashboard
- Sales analytics with charts
- Order management
- Vendor approval
- User management
- Content moderation

### AI Features
- Generate product descriptions with AI
- Summarize customer reviews
- SEO optimization suggestions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@markethub.com or join our Slack channel.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)

---

Built with by the MarketHub Team
