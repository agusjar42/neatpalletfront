"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { label: "Informes de contenido", href: "/envio-contenido", icon: "pi pi-file" },
    { label: "Informes de movimiento", href: "/envio-movimiento", icon: "pi pi-arrows-h" },
    { label: "Logs del sistema", href: "/logs-incorrectos", icon: "pi pi-list" },
    { label: "Logs del usuario", href: "/tablas-maestras/log_usuario", icon: "pi pi-history" },
    { label: "Histórico de json", href: "/tablas-maestras/log_json", icon: "pi pi-code" },
];

const LogsSistemaTabs = () => {
    const pathname = usePathname();

    return (
        <nav className="neat-tabs" aria-label="Logs e informes">
            {tabs.map((tab) => {
                const active = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`neat-tab ${active ? "neat-tab-active" : ""}`}
                    >
                        <i className={tab.icon} aria-hidden="true"></i>
                        <span>{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default LogsSistemaTabs;
