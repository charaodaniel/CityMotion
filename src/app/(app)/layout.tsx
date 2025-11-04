
"use client";

import { AppLayout } from '@/components/layout/app-layout';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Check if the path is for the badge page
    const isBadgePage = typeof window !== 'undefined' && window.location.pathname.startsWith('/cracha');

    if (isBadgePage) {
        return <>{children}</>;
    }

  return <AppLayout>{children}</AppLayout>;
}
