"use client";

import { useEffect, useState } from "react";
import { getTipoCategoria, getTipoCategoriaCount } from "@/app/api-endpoints/tipo-categoria";

const TipoCategoriaIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        activos: "-",
        inactivos: "-",
        ordenMaximo: "-",
    });

    useEffect(() => {
        //
        //Cargamos el resumen superior del catalogo
        //
        const cargarResumen = async () => {
            try {
                const [totalResponse, registros] = await Promise.all([
                    getTipoCategoriaCount(),
                    getTipoCategoria(JSON.stringify({ fields: { activoSn: true, orden: true } })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const activos = Array.isArray(registros)
                    ? registros.filter((registro) => registro?.activoSn === "S").length
                    : 0;
                const ordenMaximo = Array.isArray(registros) && registros.length > 0
                    ? Math.max(
                        ...registros
                            .map((registro) => Number(registro?.orden))
                            .filter((orden) => Number.isFinite(orden))
                    )
                    : 0;

                //
                //Guardamos las metricas calculadas para pintar las tarjetas
                //
                setSummary({
                    total,
                    activos,
                    inactivos: Math.max(total - activos, 0),
                    ordenMaximo,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de tipos de categoria", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Tipos de categoria</h1>
                <p>
                    Catalogo de categorias operativas disponibles para clasificar elementos dentro de la plataforma. Cualquier cambio aqui impacta en los selectores asociados.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de tipos de categoria">
                <div className="neat-summary-item">
                    <span>Tipos totales</span>
                    <strong>{summary.total}</strong>
                    <small>en el catalogo</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Activos</span>
                    <strong>{summary.activos}</strong>
                    <small>disponibles para uso</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Inactivos</span>
                    <strong>{summary.inactivos}</strong>
                    <small>ocultos al usuario</small>
                </div>
                <div className="neat-summary-item">
                    <span>Orden maximo</span>
                    <strong>{summary.ordenMaximo}</strong>
                    <small>configurado</small>
                </div>
            </div>
        </section>
    );
};

export default TipoCategoriaIntro;
