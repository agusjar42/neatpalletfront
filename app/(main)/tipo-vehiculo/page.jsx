"use client";
import { useState } from "react";
import { useIntl } from "react-intl";
import Crud from "../../components/shared/crud";
import EditarTipoVehiculo from "./editar";
import { getTipoVehiculo, getTipoVehiculoCount, deleteTipoVehiculo } from "@/app/api-endpoints/tipo-vehiculo";
import TipoVehiculoIntro from "./TipoVehiculoIntro";

const TipoVehiculo = () => {
    const intl = useIntl();
    const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
    const columnas = [
        { campo: "orden", header: intl.formatMessage({ id: "Orden" }), tipo: "string" },
        { campo: "nombre", header: intl.formatMessage({ id: "Nombre" }), tipo: "string" },
        { campo: "activoSn", header: intl.formatMessage({ id: "Activo" }), tipo: "booleano" },
    ];

    return (
        <div>
            <TipoVehiculoIntro refreshKey={summaryRefreshKey} />
            <Crud
                headerCrud={intl.formatMessage({ id: "Tipos de Vehiculo" })}
                getRegistros={getTipoVehiculo}
                getRegistrosCount={getTipoVehiculoCount}
                botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                controlador={"Tipo Vehiculo"}
                editarComponente={<EditarTipoVehiculo />}
                columnas={columnas}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    className: "neat-crud-edit-dialog catalogo-edit-dialog",
                    style: { width: "min(560px, 94vw)" },
                }}
                deleteRegistro={deleteTipoVehiculo}
                onDataChange={() => setSummaryRefreshKey((key) => key + 1)}
            />
        </div>
    );
};

export default TipoVehiculo;
