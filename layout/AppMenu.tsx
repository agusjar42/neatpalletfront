'use client';
import type { MenuModel } from "@/types";
import AppSubMenu from "./AppSubMenu";
import { obtenerTodosLosPermisos } from "@/app/components/shared/componentes";
import { useIntl } from 'react-intl';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
const AppMenu = () => {
    const intl = useIntl();
    const router = useRouter();
    const [menuModel, setMenuModel] = useState<any[]>([]);
    const [menuLoaded, setMenuLoaded] = useState(false);

    useEffect(() => {
        const loadMenuFromStorage = () => {
            const savedMenu = localStorage.getItem("menuLateral");
            if (savedMenu) {
                setMenuModel(JSON.parse(savedMenu));
            }
            setMenuLoaded(true);
        };

        loadMenuFromStorage();

        const handleMenuUpdated = () => loadMenuFromStorage();
        window.addEventListener('menuLateralUpdated', handleMenuUpdated);
        window.addEventListener('storage', handleMenuUpdated);

        return () => {
            window.removeEventListener('menuLateralUpdated', handleMenuUpdated);
            window.removeEventListener('storage', handleMenuUpdated);
        };
    }, []);

    const model: MenuModel[] = Object.values(menuModel) as MenuModel[];
    if (!menuLoaded) return null;
    return <AppSubMenu model={model} />;
};

export default AppMenu;
