import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

// Prevent static prerender to avoid "Element type is invalid" during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MarketHub - Multi-Vendor E-Commerce Platform',
  description: 'Your one-stop marketplace for everything you need. Shop from thousands of vendors worldwide.',
  keywords: 'e-commerce, marketplace, shopping, online store, multi-vendor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
