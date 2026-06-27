
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página /home como ponto de entrada principal do aplicativo
    router.replace('/home');
  }, [router]);

  return <Loading />;
}
