import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { buscaTraduccion } from "@/app/api-endpoints/traduccion";
import { getIdiomaDefecto } from '../components/shared/componentes';

const IntlProviderWrapper = ({ children }) => {
    const [messages, setMessages] = useState(null);

    const locale = getIdiomaDefecto();

    useEffect(() => {
        const fetchTranslations = async () => {
            const traducciones = await buscaTraduccion(locale);
            setMessages(traducciones);
        };

        fetchTranslations();
    }, [locale]);

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