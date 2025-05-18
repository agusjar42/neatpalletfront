"use client"

import { ReactNode, useEffect } from 'react';
import Layout from "../../layout/layout";
import { Metadata } from "next";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useAuth } from "../auth/AuthContext";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Neatpallet",
    description:
        "Neatpallet.",
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: "device-width" },
    openGraph: {
        type: "website",
        title: "Neatpallet",
        url: "https://www.primefaces.org/apollo-react",
        description:
            "Language Experiences.",
        images: ["https://www.primefaces.org/static/social/apollo-react.png"],
        ttl: 604800,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function MainLayout({ children }: MainLayoutProps) {
    const ProtectedRoute = ({ children }: MainLayoutProps) => {
        const { usuarioAutenticado } = useAuth();
        const router = useRouter();
        const pathname = usePathname();

        useEffect(() => {
            if (!usuarioAutenticado && pathname !== '/auth/login') {
                router.push('/auth/login');
            } else {
                router.push(pathname);
            }
        }, [usuarioAutenticado, pathname, router]);

        if (!usuarioAutenticado && pathname !== '/auth/login') {
            return null; // O un componente de carga
        }

        return <>{children}</>;
    };

    return (
            <ProtectedRoute>
                <Layout>
                    {children}
                </Layout>
            </ProtectedRoute>
    );
}
