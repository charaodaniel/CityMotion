
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return <Loading />;
}
