'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login?error=callback');
        return;
      }

      if (session?.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Create profile if it doesn't exist
        if (!profile) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
            avatar_url: session.user.user_metadata.avatar_url,
            role: 'customer',
          });
        }

        router.push('/');
        router.refresh();
      } else {
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner border-primary-600 h-12 w-12 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-500 mt-2">Please wait while we redirect you</p>
      </div>
    </div>
  );
}
