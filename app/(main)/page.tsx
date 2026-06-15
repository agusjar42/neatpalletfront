"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerRolDashboard } from "@/app/api-endpoints/rol";
import { useAuth } from "@/app/auth/AuthContext";

const FALLBACK_ROUTE = "/tablas-maestras/empresa";

export default function MainRootRedirect() {
    const router = useRouter();
    const { usuarioAutenticado, isInitialized } = useAuth();

    useEffect(() => {
        const redirigir = async () => {
            if (!isInitialized) {
                return;
            }

            if (!usuarioAutenticado) {
                router.replace("/auth/login");
                return;
            }

            try {
                const destino = await obtenerRolDashboard();
                if (destino && destino !== "/" && destino.trim() !== "") {
                    router.replace(destino);
                    return;
                }
            } catch (error) {
                console.error("Error obteniendo dashboard por rol:", error);
            }

            router.replace(FALLBACK_ROUTE);
        };

        redirigir();
    }, [isInitialized, router, usuarioAutenticado]);

    return null;
}
