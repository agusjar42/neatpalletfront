"use client";

import { useEffect, useState } from "react";
import { getEventoConfiguracion, getEventoConfiguracionCount } from "@/app/api-endpoints/evento-configuracion";

const EventosConfiguracionIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        activos: "-",
        inactivos: "-",
        unidades: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const [totalResponse, registros] = await Promise.all([
                    getEventoConfiguracionCount(),
                    getEventoConfiguracion(JSON.stringify({ fields: { activoSn: true, unidadMedida: true } })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const activos = Array.isArray(registros)
                    ? registros.filter((registro) => registro?.activoSn === "S").length
                    : 0;
                const unidades = Array.isArray(registros)
                    ? new Set(
                        registros
                            .map((registro) => registro?.unidadMedida)
                            .filter((unidad) => unidad !== undefined && unidad !== null && unidad !== "")
                    ).size
                    : 0;

                setSummary({
                    total,
                    activos,
                    inactivos: Math.max(total - activos, 0),
                    unidades,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de eventos de configuracion", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Configuración</h1>
                <p>
                    Reglas y umbrales globales para interpretar eventos. Los informes y avisos del sistema usan estos valores como referencia por defecto.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de eventos de configuracion">
                <div className="neat-summary-item">
                    <span>Reglas totales</span>
                    <strong>{summary.total}</strong>
                    <small>en el catálogo</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Activas</span>
                    <strong>{summary.activos}</strong>
                    <small>se aplican en los informes</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Inactivas</span>
                    <strong>{summary.inactivos}</strong>
                    <small>inactivas</small>
                </div>
                <div className="neat-summary-item">
                    <span>Unidades</span>
                    <strong>{summary.unidades}</strong>
                    <small>distintas</small>
                </div>
            </div>
        </section>
    );
};

export default EventosConfiguracionIntro;
