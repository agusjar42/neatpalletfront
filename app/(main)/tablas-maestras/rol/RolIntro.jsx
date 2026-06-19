"use client";

import { useEffect, useState } from "react";
import { getRol, getRolCount } from "@/app/api-endpoints/rol";
import { getUsuarioSesion } from "@/app/utility/Utils";

const PANTALLAS_INICIO_DISPONIBLES = 10;

const RolIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        activos: "-",
        inactivos: "-",
        pantallas: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const empresaId = getUsuarioSesion()?.empresaId;
                const filtroEmpresa = JSON.stringify({ where: { and: { empresaId } } });
                const [totalResponse, registros] = await Promise.all([
                    getRolCount(filtroEmpresa),
                    getRol(JSON.stringify({
                        where: { and: { empresaId } },
                        fields: { activoSn: true, dashboardUrl: true },
                    })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const activos = Array.isArray(registros)
                    ? registros.filter((registro) => registro?.activoSn === "S").length
                    : 0;
                const pantallas = Array.isArray(registros)
                    ? new Set(
                        registros
                            .map((registro) => registro?.dashboardUrl)
                            .filter((dashboardUrl) => dashboardUrl !== undefined && dashboardUrl !== null && dashboardUrl !== "")
                    ).size
                    : 0;

                setSummary({
                    total,
                    activos,
                    inactivos: Math.max(total - activos, 0),
                    pantallas,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de roles", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Roles</h1>
                <p>
                    Define qué puede ver y hacer cada perfil, y la pantalla en la que aterriza al iniciar sesión.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de roles">
                <div className="neat-summary-item">
                    <span>Roles totales</span>
                    <strong>{summary.total}</strong>
                    <small>{summary.pantallas} pantallas distintas</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Activos</span>
                    <strong>{summary.activos}</strong>
                    <small>disponibles para asignar</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Inactivos</span>
                    <strong>{summary.inactivos}</strong>
                    <small>ocultos al asignar usuarios</small>
                </div>
                <div className="neat-summary-item">
                    <span>Pantallas de inicio</span>
                    <strong>{summary.pantallas}</strong>
                    <small>de {PANTALLAS_INICIO_DISPONIBLES} disponibles</small>
                </div>
            </div>
        </section>
    );
};

export default RolIntro;
