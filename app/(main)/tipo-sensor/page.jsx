"use client";
import { getTipoSensor, getTipoSensorCount, deleteTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import EditarTipoSensors from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const TipoSensor = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Tipos de Sensor' })}
                getRegistros={getTipoSensor}
                getRegistrosCount={getTipoSensorCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipo Sensor"}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarTipoSensors />}
                columnas={columnas}
                deleteRegistro={deleteTipoSensor}
            />
        </div>
    );
};

export default TipoSensor;