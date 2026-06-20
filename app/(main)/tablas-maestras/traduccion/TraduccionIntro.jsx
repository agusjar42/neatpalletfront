"use client";

import { useEffect, useState } from "react";
import { getTraducciones } from "@/app/api-endpoints/traduccion";

const TraduccionIntro = ({ refreshKey = 0, idiomas = [] }) => {
    const [summary, setSummary] = useState({
        claves: "-",
        idiomasActivos: "-",
        idiomasIso: "",
        cobertura: "-",
        traduccionesCompletas: "-",
        traduccionesEsperadas: "-",
        clavesIncompletas: "-",
    });

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                if (!Array.isArray(idiomas) || idiomas.length === 0) {
                    return;
                }

                //
                //Solo pedimos las traducciones porque los idiomas ya estan disponibles
                //
                const traducciones = await getTraducciones(JSON.stringify({ fields: { idiomaId: true, clave: true, valor: true } }));

                const idiomasActivos = Array.isArray(idiomas)
                    ? idiomas.filter((idioma) => idioma?.activoSn === "S")
                    : [];
                const idiomaIdsActivos = new Set(idiomasActivos.map((idioma) => idioma.id));
                const claves = Array.isArray(traducciones)
                    ? [...new Set(
                        traducciones
                            .map((traduccion) => traduccion?.clave)
                            .filter((clave) => clave !== undefined && clave !== null && clave !== "")
                    )]
                    : [];
                const traduccionesActivas = Array.isArray(traducciones)
                    ? traducciones.filter((traduccion) => (
                        idiomaIdsActivos.has(traduccion?.idiomaId) &&
                        traduccion?.clave &&
                        traduccion?.valor
                    ))
                    : [];
                const traduccionesEsperadas = claves.length * idiomasActivos.length;
                const cobertura = traduccionesEsperadas > 0
                    ? Math.round((traduccionesActivas.length / traduccionesEsperadas) * 100)
                    : 0;
                const clavesIncompletas = claves.filter((clave) => {
                    const idiomasTraducidos = new Set(
                        traduccionesActivas
                            .filter((traduccion) => traduccion.clave === clave)
                            .map((traduccion) => traduccion.idiomaId)
                    );

                    return idiomasTraducidos.size < idiomasActivos.length;
                }).length;

                setSummary({
                    claves: claves.length,
                    idiomasActivos: idiomasActivos.length,
                    idiomasIso: idiomasActivos.map((idioma) => idioma.iso).filter(Boolean).join(" · "),
                    cobertura,
                    traduccionesCompletas: traduccionesActivas.length,
                    traduccionesEsperadas,
                    clavesIncompletas,
                });
            } catch (error) {
                console.error("No se pudo cargar el resumen de traducciones", error);
            }
        };

        cargarResumen();
    }, [idiomas, refreshKey]);

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Traducciones</h1>
                <p>
                    Edita el texto que ve cada usuario en su idioma. Cada fila es una clave y cada columna un idioma activo. Haz clic sobre cualquier celda para editar el texto en sitio.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de traducciones">
                <div className="neat-summary-item">
                    <span>Claves totales</span>
                    <strong>{summary.claves}</strong>
                    <small>cadenas en la plataforma</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Idiomas activos</span>
                    <strong>{summary.idiomasActivos}</strong>
                    <small>{summary.idiomasIso}</small>
                </div>
                <div className="neat-summary-item">
                    <span>Cobertura</span>
                    <strong>{summary.cobertura}%</strong>
                    <small>{summary.traduccionesCompletas} de {summary.traduccionesEsperadas} traducciones</small>
                </div>
                <div className="neat-summary-item neat-summary-danger">
                    <span>Claves incompletas</span>
                    <strong>{summary.clavesIncompletas}</strong>
                    <small>faltan idiomas por traducir</small>
                </div>
            </div>
        </section>
    );
};

export default TraduccionIntro;
