"use client";
import { getEnvioParada, getEnvioParadaCount, deleteEnvioParada } from "@/app/api-endpoints/envio-parada";
import EditarEnvioParadas from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioParada = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'tipo', header: intl.formatMessage({ id: 'Tipo' }), tipo: 'string' },
        { campo: 'punto', header: intl.formatMessage({ id: 'Punto' }), tipo: 'string' },
        { campo: 'coordenadas', header: intl.formatMessage({ id: 'Coordenadas' }), tipo: 'string' },
        { campo: 'eta', header: intl.formatMessage({ id: 'ETA' }), tipo: 'string' },
        { campo: 'horaReal', header: intl.formatMessage({ id: 'Hora real' }), tipo: 'string' },
        { campo: 'detencion', header: intl.formatMessage({ id: 'Detencion' }), tipo: 'string' },
        { campo: 'estado', header: intl.formatMessage({ id: 'Estado' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Paradas de envio' })}
                getRegistros={getEnvioParada}
                getRegistrosCount={getEnvioParadaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio Parada"}
                editarComponente={<EditarEnvioParadas />}
                columnas={columnas}
                deleteRegistro={deleteEnvioParada}
            />
        </div>
    );
};

export default EnvioParada;
