"use client";

import { useIntl } from "react-intl";

const Proximamente = () => {
    const intl = useIntl();
    return (
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <i className="pi pi-clock" style={{ fontSize: '5rem', color: 'var(--primary-color)', marginBottom: '2rem', display: 'block' }} />
                <h1 style={{ fontSize: '3rem', fontWeight: '700', margin: '0 0 1rem 0', color: 'var(--text-color)' }}>
                    {intl.formatMessage({ id: 'Proximamente' })}
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-color-secondary)', maxWidth: '480px', lineHeight: '1.8' }}>
                    {intl.formatMessage({ id: 'Estamos trabajando en esta sección.' })}<br />
                    {intl.formatMessage({ id: 'Pronto estará disponible.' })}
                </p>
            </div>
        </div>
    );
};

export default Proximamente;
