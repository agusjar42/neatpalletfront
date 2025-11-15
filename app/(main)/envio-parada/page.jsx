"use client";
import { getEnvioParada, getEnvioParadaCount, deleteEnvioParada } from "@/app/api-endpoints/envio-parada";
import EditarEnvioParadas from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioParada = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen Ruta' }), tipo: 'string' },
        { campo: 'fechaEspanol', header: intl.formatMessage({ id: 'Fecha' }), tipo: 'string' },
        { campo: 'lugarParada', header: intl.formatMessage({ id: 'Lugar' }), tipo: 'string' },
        { campo: 'nombreOperario', header: intl.formatMessage({ id: 'Operario' }), tipo: 'string' },
        { campo: 'telefonoOperario', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Paradas de Envío' })}
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