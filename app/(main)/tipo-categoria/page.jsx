"use client";
import { useIntl } from "react-intl";
import Crud from "../../components/shared/crud";
import EditarTipoCategoria from "./editar";
import { getTipoCategoria, getTipoCategoriaCount, deleteTipoCategoria } from "@/app/api-endpoints/tipo-categoria";

const TipoCategoria = () => {
    const intl = useIntl();
    const columnas = [
        { campo: "orden", header: intl.formatMessage({ id: "Orden" }), tipo: "string" },
        { campo: "nombre", header: intl.formatMessage({ id: "Nombre" }), tipo: "string" },
        { campo: "activoSn", header: intl.formatMessage({ id: "Activo" }), tipo: "booleano" },
    ];

    return (
        <div>
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
            />
        </div>
    );
};

export default TipoCategoria;
