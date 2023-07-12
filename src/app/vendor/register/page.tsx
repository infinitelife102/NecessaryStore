'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  Building2,
  Globe,
} from 'lucide-react';

export default function VendorRegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    storeName: '',
    storeSlug: '',
    storeDescription: '',
    businessEmail: '',
    businessPhone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Auto-generate slug from store name
    if (name === 'storeName') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, storeSlug: slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('Please sign in to register as a vendor');
      setIsLoading(false);
      return;
    }

    try {
      // Check if slug is unique
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('store_slug', formData.storeSlug)
        .single();

      if (existingVendor) {
        setError('Store URL is already taken. Please choose a different name.');
        setIsLoading(false);
        return;
      }

      // Create vendor
      const { error: vendorError } = await supabase.from('vendors').insert({
        user_id: user.id,
        store_name: formData.storeName,
        store_slug: formData.storeSlug,
        store_description: formData.storeDescription,
        business_email: formData.businessEmail,
        business_phone: formData.businessPhone,
        business_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
        },
        commission_rate: 10, // Default commission
        is_verified: false,
        is_active: true,
      });

      if (vendorError) {
        setError(vendorError.message);
        return;
      }

      // Update user role
      await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', user.id);

      setStep(3); // Success step
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in Required
          </h2>
          <p className="text-gray-500 mb-6">
            Please sign in to register as a vendor
          </p>
          <Link href="/auth/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Store className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Become a Vendor
          </h1>
          <p className="text-gray-500 mt-2">
            Start selling your products on MarketHub
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      s < step ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Store Information
              </h2>

              <div>
                <label className="label">Store Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="My Awesome Store"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Store URL</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">markethub.com/vendors/</span>
                  <input
                    type="text"
                    name="storeSlug"
                    value={formData.storeSlug}
                    onChange={handleChange}
                    className="input flex-1"
                    placeholder="my-store"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Store Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleChange}
                    className="input pl-10 h-32"
                    placeholder="Tell customers about your store..."
                    required
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full btn-primary py-3"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="business@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Business Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input"
                    placeholder="New York"
                    required
                  />
                </div>

                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input"
                    placeholder="NY"
                    required
                  />
                </div>

                <div>
                  <label className="label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="input"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="United States"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 mt-1"
                  required
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/vendor/terms" className="text-primary-600 hover:underline">
                    Vendor Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/vendor/agreement" className="text-primary-600 hover:underline">
                    Vendor Agreement
                  </Link>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary py-3"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.agreeTerms}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="spinner border-white" />
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-500 mb-6">
                Thank you for applying to become a vendor. Our team will review your application and get back to you within 24-48 hours.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/" className="btn-secondary">
                  Go Home
                </Link>
                <Link href="/vendor/dashboard" className="btn-primary">
                  Vendor Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
