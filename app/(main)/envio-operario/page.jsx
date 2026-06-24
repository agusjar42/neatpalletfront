"use client";
import { useIntl } from 'react-intl';
import Crud from "../../components/shared/crud";
import { getEnvioOperario, getEnvioOperarioCount, deleteEnvioOperario } from "@/app/api-endpoints/envio-operario";
import EditarEnvioOperario from "./editar";

const EnvioOperario = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'Envio' }), tipo: 'number' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Operario' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Telefono' }), tipo: 'string' },
        { campo: 'email', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'activoSN', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ];

    return (
        <Crud
            headerCrud={intl.formatMessage({ id: 'Operarios de envio' })}
            getRegistros={getEnvioOperario}
            getRegistrosCount={getEnvioOperarioCount}
            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
            controlador={"Operarios"}
            editarComponente={<EditarEnvioOperario />}
            columnas={columnas}
            deleteRegistro={deleteEnvioOperario}
        />
    );
};

export default EnvioOperario;
