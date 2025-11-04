
'use client'
import { AppProvider } from "@/contexts/app-provider";


export default function BadgeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppProvider>{children}</AppProvider>;
}
