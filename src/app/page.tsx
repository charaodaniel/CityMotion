
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /home page as the main entry point for the app
    router.replace('/home');
  }, [router]);

  return <Loading />;
}
