"use client";

import { useEffect, useState } from "react";
import { getPaises, getPaisesCount } from "@/app/api-endpoints/pais";

const PaisIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        activos: "-",
        inactivos: "-",
        codigosIso: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const [totalResponse, registros] = await Promise.all([
                    getPaisesCount(),
                    getPaises(JSON.stringify({ fields: { activoSn: true, iso: true } })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const activos = Array.isArray(registros)
                    ? registros.filter((registro) => registro?.activoSn === "S").length
                    : 0;
                const codigosIso = Array.isArray(registros)
                    ? new Set(
                        registros
                            .map((registro) => registro?.iso)
                            .filter((iso) => iso !== undefined && iso !== null && iso !== "")
                    ).size
                    : 0;

                setSummary({
                    total,
                    activos,
                    inactivos: Math.max(total - activos, 0),
                    codigosIso,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de paises", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Países</h1>
                <p>
                    Países habilitados en la plataforma. Define el catálogo y su código ISO para clientes, envíos y direcciones.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de paises">
                <div className="neat-summary-item">
                    <span>Países totales</span>
                    <strong>{summary.total}</strong>
                    <small>en el catálogo</small>
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
                    <span>Códigos ISO</span>
                    <strong>{summary.codigosIso}</strong>
                    <small>distintos</small>
                </div>
            </div>
        </section>
    );
};

export default PaisIntro;
