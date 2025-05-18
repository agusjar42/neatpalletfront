"use client";

import React, { useEffect } from 'react';
import { LayoutProvider } from "../layout/context/layoutcontext";
import { AuthProvider } from "./auth/AuthContext";
import { AbilityProvider } from '@/app/utility/Can'; // Importa AbilityProvider

import { PrimeReactProvider, locale, addLocale } from "primereact/api";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";
import IntlProviderWrapper from '@/app/utility/Traducciones.js'; //-> Archivo con la configuración de las traducciones

import locales from "@/app/utility/locales.json"; //-> Archivo Json con la configuración de PrimeReact de palabras traducidas al español

interface RootLayoutProps {
    children: React.ReactNode;
}
//-> Añadimos el AbilityProvider en el Layout Principal, este archivo es el principal de la aplicación, por lo que se envuelve con AbilityProvider
export default function RootLayout({ children }: RootLayoutProps) {
    useEffect(() => {
        addLocale("es", locales["es"]); // -> Añadimos lenguaje español
        locale("es"); //-> Configuramos por defecto el lenguaje añadido
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    id="theme-link"
                    href={`/theme/theme-light/mitema/theme.css`}
                    rel="stylesheet"
                ></link>
            </head>
            <body>
                <IntlProviderWrapper>
                    <PrimeReactProvider>
                        {/* Envolvemos el Layout Principal con <AuthProvider> para comprobar que el usuario se encuentre atenticado */}
                        <AuthProvider> 
                            <AbilityProvider> {/* Envolvemos con AbilityProvider */}
                                <LayoutProvider>{children}</LayoutProvider>
                            </AbilityProvider>
                        </AuthProvider>
                    </PrimeReactProvider>
                </IntlProviderWrapper>
            </body>
        </html>
    );
}
