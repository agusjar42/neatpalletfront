"use client";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const Envio = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'descripcion', header: intl.formatMessage({ id: 'Descripción' }), tipo: 'string' },
        { campo: 'numeroSeguimiento', header: intl.formatMessage({ id: 'Número de seguimiento' }), tipo: 'string' },
        { campo: 'estado', header: intl.formatMessage({ id: 'Estado' }), tipo: 'string' },
        { campo: 'origen', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destino', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'conductor', header: intl.formatMessage({ id: 'Conductor' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envíos' })}
                getRegistros={getEnvio}
                getRegistrosCount={getEnvioCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio"}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarEnvios />}
                columnas={columnas}
                deleteRegistro={deleteEnvio}
            />
        </div>
    );
};

export default Envio;