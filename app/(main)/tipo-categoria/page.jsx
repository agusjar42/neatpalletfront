"use client";
import { useState } from "react";
import { useIntl } from "react-intl";
import Crud from "../../components/shared/crud";
import EditarTipoCategoria from "./editar";
import { getTipoCategoria, getTipoCategoriaCount, deleteTipoCategoria } from "@/app/api-endpoints/tipo-categoria";
import TipoCategoriaIntro from "./TipoCategoriaIntro";

const TipoCategoria = () => {
    const intl = useIntl();
    const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
    const columnas = [
        { campo: "orden", header: intl.formatMessage({ id: "Orden" }), tipo: "string" },
        { campo: "nombre", header: intl.formatMessage({ id: "Nombre" }), tipo: "string" },
        { campo: "activoSn", header: intl.formatMessage({ id: "Activo" }), tipo: "booleano" },
    ];

    return (
        <div>
            <TipoCategoriaIntro refreshKey={summaryRefreshKey} />
            <Crud
                headerCrud={intl.formatMessage({ id: "Tipos de Categoria" })}
                getRegistros={getTipoCategoria}
                getRegistrosCount={getTipoCategoriaCount}
                botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                controlador={"Tipo Categoria"}
                editarComponente={<EditarTipoCategoria />}
                columnas={columnas}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    className: "neat-crud-edit-dialog catalogo-edit-dialog",
                    style: { width: "min(560px, 94vw)" },
                }}
                deleteRegistro={deleteTipoCategoria}
                onDataChange={() => setSummaryRefreshKey((key) => key + 1)}
            />
        </div>
    );
};

export default TipoCategoria;
