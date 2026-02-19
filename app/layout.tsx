"use client";

import React, { useEffect } from 'react';
import { LayoutProvider } from "../layout/context/layoutcontext";
import { AuthProvider } from "./auth/AuthContext";
import { AbilityProvider } from '@/app/utility/Can'; // Importa AbilityProvider

import { PrimeReactProvider, locale, addLocale } from "primereact/api";
import { MenuProvider } from "../layout/context/menucontext";
import LayoutContainer from "@/layout/layoutContainer";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";
import IntlProviderWrapper from '@/app/utility/Traducciones.js'; //-> Archivo con la configuración de las traducciones

import locales from "@/app/utility/locales.json"; //-> Archivo Json con la configuración de PrimeReact de palabras traducidas al español
import AutoLogout from './global';
import { getIdiomaDefecto } from '@/app/components/shared/componentes';

interface RootLayoutProps {
    children: React.ReactNode;
}
//-> Añadimos el AbilityProvider en el Layout Principal, este archivo es el principal de la aplicación, por lo que se envuelve con AbilityProvider
export default function RootLayout({ children }: RootLayoutProps) {
    useEffect(() => {
        Object.keys(locales || {}).forEach((key) => {
            addLocale(key, (locales as any)[key]);
        });

        const applyLocale = (nextLocale: string) => {
            if (!nextLocale) return;

            const hasPrimeLocale = Object.prototype.hasOwnProperty.call(locales || {}, nextLocale);
            if (hasPrimeLocale) {
                locale(nextLocale);
                return;
            }

            // Fallback: PrimeReact solo tiene configurado 'es' en `app/utility/locales.json`
            locale('es');
        };

        applyLocale(getIdiomaDefecto());

        const handleIdiomaChanged = (event: any) => {
            const nextLocale = event?.detail;
            if (typeof nextLocale === 'string') applyLocale(nextLocale);
        };

        window.addEventListener('idioma-changed', handleIdiomaChanged);
        return () => window.removeEventListener('idioma-changed', handleIdiomaChanged);
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    id="theme-link"
                    href={`/theme/theme-light/green/theme.css`}
                    rel="stylesheet"
                ></link>
            </head>
            <body>
                <IntlProviderWrapper>
                    <PrimeReactProvider>
                        {/* Envolvemos el Layout Principal con <AuthProvider> para comprobar que el usuario se encuentre atenticado */}
                        <AuthProvider>
                            <AutoLogout /> {/* Llama al componente AutoLogout al cargar la aplicación */}
                            <AbilityProvider> {/* Envolvemos con AbilityProvider */}
                                <MenuProvider>
                                    <LayoutProvider>
                                        <LayoutContainer>
                                            {children}
                                        </LayoutContainer>
                                    </LayoutProvider>
                                </MenuProvider>
                            </AbilityProvider>
                        </AuthProvider>
                    </PrimeReactProvider>
                </IntlProviderWrapper>
            </body>
        </html>
    );
}
