"use client";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { getUsuarioSesion } from "@/app/utility/Utils";

const Envio = () => {
    const intl = useIntl();
    
    const columnas = [
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destinoRuta', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'fechaSalidaEspanol', header: intl.formatMessage({ id: 'Fecha salida' }), tipo: 'string' },
        { campo: 'fechaLlegadaEspanol', header: intl.formatMessage({ id: 'Fecha llegada' }), tipo: 'string' }
    ];

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envíos' })}
                getRegistros={getEnvio}
                getRegistrosCount={getEnvioCount}
                botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envios"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarEnvios />}
                columnas={columnas}
                deleteRegistro={deleteEnvio}
            />
        </div>
    );
};

export default Envio;