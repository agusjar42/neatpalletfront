"use client";

import { useEffect, useState } from "react";
import { getParametro, getParametroCount } from "@/app/api-endpoints/parametro";

const contarValoresDisponibles = (valorDisponible) => {
    if (!valorDisponible) return 0;

    return String(valorDisponible)
        .split(/[;,|]/)
        .map((valor) => valor.trim())
        .filter(Boolean).length || 1;
};

const ParametroIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        activos: "-",
        inactivos: "-",
        valores: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const [totalResponse, registros] = await Promise.all([
                    getParametroCount(),
                    getParametro(JSON.stringify({ fields: { activoSn: true, valorDisponible: true } })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const activos = Array.isArray(registros)
                    ? registros.filter((registro) => registro?.activoSn === "S").length
                    : 0;
                const valores = Array.isArray(registros)
                    ? registros.reduce((totalValores, registro) => totalValores + contarValoresDisponibles(registro?.valorDisponible), 0)
                    : 0;

                setSummary({
                    total,
                    activos,
                    inactivos: Math.max(total - activos, 0),
                    valores,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de parametros", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Parámetros permitidos de Pallet</h1>
                <p>
                    Catálogo maestro de parámetros y valores que puede tomar un pallet en la plataforma. Los formularios de pallet, envío y monitoreo solo aceptan valores definidos aquí.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de parametros permitidos de pallet">
                <div className="neat-summary-item">
                    <span>Parámetros</span>
                    <strong>{summary.total}</strong>
                    <small>en el catálogo</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Activos</span>
                    <strong>{summary.activos}</strong>
                    <small>disponibles en formularios</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Inactivos</span>
                    <strong>{summary.inactivos}</strong>
                    <small>ocultos al usuario</small>
                </div>
                <div className="neat-summary-item">
                    <span>Valores totales</span>
                    <strong>{summary.valores}</strong>
                    <small>opciones definidas</small>
                </div>
            </div>
        </section>
    );
};

export default ParametroIntro;
