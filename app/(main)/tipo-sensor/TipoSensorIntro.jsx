"use client";

import { useEffect, useState } from "react";
import { getTipoSensor, getTipoSensorCount } from "@/app/api-endpoints/tipo-sensor";

const TipoSensorIntro = ({ refreshKey = 0 }) => {
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
                    getTipoSensorCount(),
                    getTipoSensor(JSON.stringify({ fields: { activoSn: true, valorDefecto: true } })),
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
                            .map((registro) => registro?.valorDefecto)
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
                console.error("No se pudo cargar el resumen de tipos de sensor", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Tipos de sensor</h1>
                <p>
                    Familias de sensores soportadas en la plataforma. Define el valor por defecto y la unidad de medida; cualquier sensor nuevo hereda estos valores hasta que se calibre.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de tipos de sensor">
                <div className="neat-summary-item">
                    <span>Tipos totales</span>
                    <strong>{summary.total}</strong>
                    <small>en el catalogo</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Activos</span>
                    <strong>{summary.activos}</strong>
                    <small>disponibles para asignar</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Inactivos</span>
                    <strong>{summary.inactivos}</strong>
                    <small>ocultos en formularios</small>
                </div>
                <div className="neat-summary-item">
                    <span>Unidades distintas</span>
                    <strong>{summary.unidades}</strong>
                    <small>de medida</small>
                </div>
            </div>
        </section>
    );
};

export default TipoSensorIntro;
