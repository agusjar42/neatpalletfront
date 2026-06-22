"use client";
import { useState } from "react";
import {
    getEventoConfiguracion,
    getEventoConfiguracionCount,
    deleteEventoConfiguracion
} from "@/app/api-endpoints/evento-configuracion";
import EditarEventoConfiguracion from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import EventosConfiguracionIntro from "./EventosConfiguracionIntro";

const EventosConfiguracion = () => {
    const intl = useIntl();
    const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
    const columnas = [
        { campo: 'orden', header: 'ORDEN', tipo: 'string' },
        { campo: 'nombre', header: 'PARAMETRO', tipo: 'string' },
        { campo: 'valor', header: 'VALOR', tipo: 'string' },
        { campo: 'unidadMedida', header: 'UNIDAD', tipo: 'string' },
        { campo: 'activoSn', header: 'ACTIVO', tipo: 'booleano' },
    ]

    return (
        <div>
            <EventosConfiguracionIntro refreshKey={summaryRefreshKey} />
            <Crud
                headerCrud={intl.formatMessage({ id: 'Eventos Configuración' })}
                getRegistros={getEventoConfiguracion}
                getRegistrosCount={getEventoConfiguracionCount}
                botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Eventos Configuración"}
                editarComponente={<EditarEventoConfiguracion />}
                columnas={columnas}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    className: "neat-crud-edit-dialog catalogo-edit-dialog catalogo-edit-dialog-wide",
                    style: { width: "min(760px, 94vw)" },
                }}
                deleteRegistro={deleteEventoConfiguracion}
                onDataChange={() => setSummaryRefreshKey((key) => key + 1)}
            />
        </div>
    );
};

export default EventosConfiguracion;
