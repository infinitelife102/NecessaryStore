'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StoreIcon, MailIcon } from '@/components/icons';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <StoreIcon className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">MarketHub</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We sent a confirmation link to
        </p>
        {email && (
          <p className="mt-1 text-center text-sm font-medium text-primary-600 break-all px-4">
            {email}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <MailIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Click the link in the email to verify your account. If you don&apos;t see it, check your spam folder.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full text-center px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              Back to Sign in
            </Link>
            <p className="text-center text-xs text-gray-500">
              Already verified?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
