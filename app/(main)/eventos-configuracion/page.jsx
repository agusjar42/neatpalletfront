"use client";
import {
    getEventoConfiguracion,
    getEventoConfiguracionCount,
    deleteEventoConfiguracion
} from "@/app/api-endpoints/evento-configuracion";
import EditarEventoConfiguracion from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EventosConfiguracion = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Eventos configuración' })}
                getRegistros={getEventoConfiguracion}
                getRegistrosCount={getEventoConfiguracionCount}
                botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Eventos Configuracion"}
                editarComponente={<EditarEventoConfiguracion />}
                columnas={columnas}
                deleteRegistro={deleteEventoConfiguracion}
            />
        </div>
    );
};

export default EventosConfiguracion;
