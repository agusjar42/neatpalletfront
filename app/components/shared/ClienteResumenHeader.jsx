"use client";

import { useEffect, useState } from "react";
import { getEmpresa } from "@/app/api-endpoints/empresa";
import { getEmpresaPalletCount } from "@/app/api-endpoints/empresa-pallet";
import { getVistaUsuariosCount } from "@/app/api-endpoints/usuario";
import { getEnvioCount } from "@/app/api-endpoints/envio";

const extraerCount = (valor) => {
    if (typeof valor === "number") return valor;
    if (Array.isArray(valor)) return Number(valor[0]?.count ?? 0);
    return Number(valor?.count ?? 0);
};

const puedeCargar = () => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("np_logging_out") === "1") return false;
    const userData = JSON.parse(localStorage.getItem("userDataNeatpallet") || "null");
    return Boolean(userData) && userData.usuarioAdmin !== "S";
};

const ClienteResumenHeader = () => {
    const [empresa, setEmpresa] = useState(null);
    const [metricas, setMetricas] = useState({
        pallets: 0,
        usuarios: 0,
        eventos24h: 0,
        enviosEnCurso: 0,
    });

    useEffect(() => {
        const cargarDatos = async () => {
            if (!puedeCargar()) return;

            const empresaId = Number(localStorage.getItem("empresa"));
            if (!empresaId) return;

            const [empresaData, pallets, usuarios, envios] = await Promise.all([
                getEmpresa(empresaId).catch(() => null),
                getEmpresaPalletCount(JSON.stringify({ and: { empresaId } })).catch(() => ({ count: 0 })),
                getVistaUsuariosCount(JSON.stringify({ and: { empresaId } })).catch(() => ({ count: 0 })),
                getEnvioCount(JSON.stringify({ and: { empresaId } })).catch(() => ({ count: 0 })),
            ]);

            setEmpresa(empresaData);
            setMetricas({
                pallets: extraerCount(pallets),
                usuarios: extraerCount(usuarios),
                eventos24h: Number(empresaData?.eventos24h ?? 0),
                enviosEnCurso: extraerCount(envios),
            });
        };

        cargarDatos();
    }, []);

    if (!puedeCargar() || !empresa) {
        return null;
    }

    const nombre = empresa.nombre || "Mi empresa";
    const plan = empresa.plan || "Enterprise";

    return (
        <section className="empresa-profile-card cliente-resumen-header">
            <div className="empresa-profile-header">
                <div className="empresa-avatar">
                    {empresa.logo ? <img src={empresa.logo} alt="" /> : nombre.charAt(0)}
                </div>
                <div className="empresa-heading">
                    <div className="empresa-title-row">
                        <h1>{nombre}</h1>
                        <span className="empresa-pill empresa-pill-blue">{plan}</span>
                    </div>
                    <p>{empresa.nombreComercial || nombre}</p>
                </div>
            </div>

            <div className="empresa-metrics">
                <MetricCard icon="pi pi-box" label="Pallets" value={metricas.pallets} />
                <MetricCard icon="pi pi-users" label="Usuarios" value={metricas.usuarios} />
                <MetricCard icon="pi pi-star" label="Plan" value={plan} />
                <MetricCard icon="pi pi-bolt" label="Eventos · 24 h" value={metricas.eventos24h} />
                <MetricCard icon="pi pi-truck" label="Envios en curso" value={metricas.enviosEnCurso} />
            </div>
        </section>
    );
};

const MetricCard = ({ icon, label, value }) => (
    <article className="empresa-metric-card">
        <span className="empresa-metric-icon">
            <i className={icon} aria-hidden="true"></i>
        </span>
        <div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    </article>
);

export default ClienteResumenHeader;
