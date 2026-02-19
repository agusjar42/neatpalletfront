 "use client";

import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { buscaTraduccion } from "@/app/api-endpoints/traduccion";
import { getIdiomaDefecto } from '../components/shared/componentes';

const IntlProviderWrapper = ({ children }) => {
    const [messages, setMessages] = useState(null);
    const [locale, setLocale] = useState(getIdiomaDefecto());

    useEffect(() => {
        const fetchTranslations = async () => {
            const traducciones = await buscaTraduccion(locale);
            setMessages(traducciones);
        };

        fetchTranslations();
    }, [locale]);

    useEffect(() => {
        const handleIdiomaChanged = (event) => {
            const nextLocale = event?.detail;
            if (typeof nextLocale !== 'string' || !nextLocale) return;
            setLocale((prev) => (prev === nextLocale ? prev : nextLocale));
        };

        const handleStorage = (event) => {
            if (event?.key === 'idioma' && typeof event.newValue === 'string' && event.newValue) {
                setLocale(event.newValue);
            }
        };

        window.addEventListener('idioma-changed', handleIdiomaChanged);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('idioma-changed', handleIdiomaChanged);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // Handler para devolver el id si falta la traducción
    const handleIntlError = (err) => {
        if (err.code === 'MISSING_TRANSLATION') {
            // No mostrar error en consola
            return;
        }
        console.error(err);
    };

    return (
        <IntlProvider
            key={locale}
            locale={locale}
            messages={messages}
            onError={handleIntlError}
            defaultRichTextElements={{}}
        >
            {children}
        </IntlProvider>
    );
};

export default IntlProviderWrapper;
