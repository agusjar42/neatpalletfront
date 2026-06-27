"use client";
import { useState } from "react";
import { getTipoSensor, getTipoSensorCount, deleteTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import EditarTipoSensors from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import TipoSensorIntro from "./TipoSensorIntro";

const TipoSensor = () => {
    const intl = useIntl();
    const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valorDefecto', header: intl.formatMessage({ id: 'Valor Defecto' }), tipo: 'string' },
        { campo: 'unidad', header: intl.formatMessage({ id: 'Unidad' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <TipoSensorIntro refreshKey={summaryRefreshKey} />
            <Crud
                headerCrud={intl.formatMessage({ id: 'Tipos de Sensor' })}
                getRegistros={getTipoSensor}
                getRegistrosCount={getTipoSensorCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipo Sensor"}
                editarComponente={<EditarTipoSensors />}
                columnas={columnas}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    style: { width: "min(980px, 92vw)" },
                }}
                deleteRegistro={deleteTipoSensor}
                onDataChange={() => setSummaryRefreshKey((key) => key + 1)}
            />
        </div>
    );
};

export default TipoSensor;
