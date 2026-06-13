"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntl } from "react-intl";

const tabs = [
    {
        labelId: "Paises",
        href: "/tablas-maestras/pais",
        icon: "pi pi-globe",
    },
    {
        labelId: "Idiomas",
        href: "/tablas-maestras/idioma",
        icon: "pi pi-language",
    },
    {
        labelId: "Traducciones",
        href: "/tablas-maestras/traduccion",
        icon: "pi pi-language",
    },
];

const LenguajesTabs = () => {
    const intl = useIntl();
    const pathname = usePathname();

    return (
        <nav className="neat-tabs" aria-label={intl.formatMessage({ id: "Lenguajes" })}>
            {tabs.map((tab) => {
                const active = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`neat-tab ${active ? "neat-tab-active" : ""}`}
                    >
                        <i className={tab.icon} aria-hidden="true"></i>
                        <span>{intl.formatMessage({ id: tab.labelId })}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default LenguajesTabs;
