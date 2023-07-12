'use client';

import { TruckIcon, ShieldIcon, HeadphonesIcon, TrendingUpIcon } from './icons';

export function FeaturesSection() {
  const features = [
    { Icon: TruckIcon, title: 'Free Shipping', description: 'Free shipping on orders over $50' },
    { Icon: ShieldIcon, title: 'Secure Payment', description: '100% secure payment methods' },
    { Icon: HeadphonesIcon, title: '24/7 Support', description: 'Round the clock customer support' },
    { Icon: TrendingUpIcon, title: 'Best Prices', description: 'Competitive prices guaranteed' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
