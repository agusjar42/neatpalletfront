"use client"

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useAuth } from "../auth/AuthContext";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            {children}
        </div>
    );
}
