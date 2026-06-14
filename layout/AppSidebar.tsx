"use client";
import Link from "next/link";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
//import { MenuProvider } from "./context/menucontext";
import React, { useContext, useState, useEffect } from 'react';
import { devuelveBasePath, getUsuarioSesion } from "@/app/utility/Utils";

const AppSidebar = () => {
    const [logoEmpresaUrl, setLogoEmpresaUrl] = useState<string | null>(null);
    const [usuarioSesion, setUsuarioSesion] = useState<any>(null);
    const { setLayoutState } = useContext(LayoutContext);
    const anchor = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState.anchored,
        }));
    };
    const esUsuarioCliente = Boolean(usuarioSesion) && usuarioSesion?.usuarioAdmin !== 'S';
    const nombreEmpresa = usuarioSesion?.nombreEmpresa || usuarioSesion?.empresaNombre || (typeof window !== 'undefined' ? localStorage?.getItem("nombreEmpresa") : null) || "Mi empresa";
    const inicialEmpresa = nombreEmpresa?.trim()?.charAt(0)?.toUpperCase() || "M";

    useEffect(() => {
        const cargarSesion = () => {
            setUsuarioSesion(getUsuarioSesion());
            setLogoEmpresaUrl(localStorage?.getItem("logoEmpresaUrl") || null);
        };

        cargarSesion();
        window.addEventListener('menuLateralUpdated', cargarSesion);
        window.addEventListener('storage', cargarSesion);
        return () => {
            window.removeEventListener('menuLateralUpdated', cargarSesion);
            window.removeEventListener('storage', cargarSesion);
        };
    }, []);

    return (
        <>
            <div className={esUsuarioCliente ? "sidebar-header client-sidebar-header" : "sidebar-header"}>
                {logoEmpresaUrl && (
                    <Link href="/" className="app-logo">
                        <img
                            src={(logoEmpresaUrl !== 'null') ? `${logoEmpresaUrl}` : `${devuelveBasePath()}/multimedia/sistemaNP/imagen-no-disponible.jpeg`}
                            alt="Logo"
                            className="app-logo-normal"
                            style={{ width: "200px", height: "80px" }}
                        />
                    </Link>
                )}
                {esUsuarioCliente && <span className="client-sidebar-badge">CLIENTE</span>}
                <button
                    className="layout-sidebar-anchor p-link z-2 mb-2"
                    type="button"
                    onClick={anchor}
                ></button>
            </div>
            {esUsuarioCliente && (
                <div className="client-company-card">
                    <div className="client-company-avatar">{inicialEmpresa}</div>
                    <div className="client-company-copy">
                        <span>MI EMPRESA</span>
                        <strong>{nombreEmpresa}</strong>
                    </div>
                    <i className="pi pi-chevron-down" aria-hidden="true"></i>
                </div>
            )}

            <div className="layout-menu-container">
                    <AppMenu />
            </div>
        </>
    );
};

export default AppSidebar;
