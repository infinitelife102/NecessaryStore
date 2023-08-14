'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button in the top right corner and fill in your details. You can also sign up using your Google account for faster registration.',
    },
    {
      question: 'How do I become a vendor?',
      answer: 'Navigate to the "Become a Vendor" page and complete the vendor registration form. Our team will review your application within 24-48 hours.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. All transactions are secured with SSL encryption.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by vendor and location. Standard shipping typically takes 5-7 business days, while express shipping takes 2-3 business days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all tags attached. Some items may have specific return restrictions.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive an email with a tracking number. You can also view your order status in the "My Orders" section of your account.',
    },
    {
      question: 'Is there a fee to sell on MarketHub?',
      answer: 'Creating a vendor account is free. We charge a small commission on each sale, which varies based on your subscription plan.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team via email at support@markethub.com or through the contact form on our website. We typically respond within 24 hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <HelpCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Find answers to common questions about MarketHub</p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
