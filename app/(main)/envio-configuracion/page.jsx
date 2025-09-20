"use client";
import { getEnvioConfiguracion, getEnvioConfiguracionCount, deleteEnvioConfiguracion } from "@/app/api-endpoints/envio-configuracion";
import EditarEnvioConfiguracions from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioConfiguracion = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen Ruta' }), tipo: 'string' },
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
                controlador={"Envio Configuracion"}
                editarComponente={<EditarEnvioConfiguracions />}
                columnas={columnas}
                deleteRegistro={deleteEnvioConfiguracion}
            />
        </div>
    );
};

export default EnvioConfiguracion;