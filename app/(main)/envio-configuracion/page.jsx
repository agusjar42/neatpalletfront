"use client";
import { getEnvioConfiguracion, getEnvioConfiguracionCount, deleteEnvioConfiguracion } from "@/app/api-endpoints/envio-configuracion";
import EditarEnvioConfiguracions from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioConfiguracion = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'ID Envío' }), tipo: 'number' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Configuraciones de Envío' })}
                getRegistros={getEnvioConfiguracion}
                getRegistrosCount={getEnvioConfiguracionCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"EnvioConfiguracion"}
                editarComponente={<EditarEnvioConfiguracions />}
                columnas={columnas}
                deleteRegistro={deleteEnvioConfiguracion}
            />
        </div>
    );
};

export default EnvioConfiguracion;