"use client";

import { useEffect, useState } from "react";
import { getPallet, getPalletCount } from "@/app/api-endpoints/pallet";

const PalletIntro = ({ refreshKey = 0 }) => {
    const [summary, setSummary] = useState({
        total: "-",
        codigos: "-",
        modelos: "-",
        medidas: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const [totalResponse, registros] = await Promise.all([
                    getPalletCount(),
                    getPallet(JSON.stringify({ fields: { codigo: true, modelo: true, medidas: true } })),
                ]);

                const total = typeof totalResponse === "number"
                    ? totalResponse
                    : totalResponse?.count ?? 0;
                const lista = Array.isArray(registros) ? registros : [];
                const codigos = new Set(lista.map((registro) => registro?.codigo).filter(Boolean)).size;
                const modelos = new Set(lista.map((registro) => registro?.modelo).filter(Boolean)).size;
                const medidas = new Set(lista.map((registro) => registro?.medidas).filter(Boolean)).size;

                setSummary({
                    total,
                    codigos,
                    modelos,
                    medidas,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de pallets", error);
            }
        };

        cargarResumen();
    }, [refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Stock global de pallets</h1>
                <p>
                    Inventario maestro de modelos y medidas de pallet utilizables en la plataforma.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de stock global de pallets">
                <div className="neat-summary-item neat-summary-success">
                    <span>Pallets en stock</span>
                    <strong>{summary.total}</strong>
                    <small>unidades en catalogo</small>
                </div>
                <div className="neat-summary-item">
                    <span>Codigos unicos</span>
                    <strong>{summary.codigos}</strong>
                    <small>referencias internas</small>
                </div>
                <div className="neat-summary-item">
                    <span>Modelos</span>
                    <strong>{summary.modelos}</strong>
                    <small>familias registradas</small>
                </div>
                <div className="neat-summary-item">
                    <span>Medidas distintas</span>
                    <strong>{summary.medidas}</strong>
                    <small>configuraciones</small>
                </div>
            </div>
        </section>
    );
};

export default PalletIntro;
