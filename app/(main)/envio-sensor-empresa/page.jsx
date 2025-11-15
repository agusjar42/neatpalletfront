"use client";
import { getEnvioSensorEmpresa, getEnvioSensorEmpresaCount, deleteEnvioSensorEmpresa } from "@/app/api-endpoints/envio-sensor-empresa";
import EditarEnvioSensorEmpresas from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const EnvioSensorEmpresa = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Tipo de Sensor' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Sensores de Empresa' })}
                getRegistros={getEnvioSensorEmpresa}
                getRegistrosCount={getEnvioSensorEmpresaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio Sensor Empresa"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarEnvioSensorEmpresas />}
                columnas={columnas}
                deleteRegistro={deleteEnvioSensorEmpresa}
            />
        </div>
    );
};

export default EnvioSensorEmpresa;
