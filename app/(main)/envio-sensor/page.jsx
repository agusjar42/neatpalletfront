"use client";
import { getEnvioSensor, getEnvioSensorCount, deleteEnvioSensor } from "@/app/api-endpoints/envio-sensor";
import EditarEnvioSensors from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioSensor = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'ID Envío' }), tipo: 'number' },
        { campo: 'tipoSensorId', header: intl.formatMessage({ id: 'ID Tipo Sensor' }), tipo: 'number' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Sensores de Envío' })}
                getRegistros={getEnvioSensor}
                getRegistrosCount={getEnvioSensorCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"EnvioSensor"}
                editarComponente={<EditarEnvioSensors />}
                columnas={columnas}
                deleteRegistro={deleteEnvioSensor}
            />
        </div>
    );
};

export default EnvioSensor;