"use client";
import Link from "next/link";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
//import { MenuProvider } from "./context/menucontext";
import React, { useContext, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { devuelveBasePath, getUsuarioSesion } from "@/app/utility/Utils";

const AppSidebar = () => {
    const [logoEmpresaUrl, setLogoEmpresaUrl] = useState(localStorage?.getItem("logoEmpresaUrl") || null);
    const { setLayoutState } = useContext(LayoutContext);
    const anchor = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState.anchored,
        }));
    };

    return (
        <>
            <div className="sidebar-header">
                {logoEmpresaUrl && (
                    <Link href="/" className="app-logo">
                        <img
                            src={(logoEmpresaUrl !== 'null') ? `${devuelveBasePath()}${logoEmpresaUrl}` : `${devuelveBasePath()}/multimedia/sistemaNLE/imagen-no-disponible.jpeg`}
                            alt="Logo"
                            className="app-logo-normal"
                            style={{ width: "200px", height: "80px" }}
                        />
                    </Link>
                )}
                <button
                    className="layout-sidebar-anchor p-link z-2 mb-2"
                    type="button"
                    onClick={anchor}
                ></button>
            </div>

            <div className="layout-menu-container">
                    <AppMenu />
            </div>
        </>
    );
};

export default AppSidebar;
