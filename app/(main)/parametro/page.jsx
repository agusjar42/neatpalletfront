"use client";
import { getParametro, getParametroCount, deleteParametro } from "@/app/api-endpoints/parametro";
import EditarParametro from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const Parametro = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
        { campo: 'valorDisponible', header: intl.formatMessage({ id: 'Valores disponibles' }), tipo: 'string' },
    ]

    return (
        <div>
            {/* Bocadillo de información */}
            <div className="p-mt-3">
                <div
                    className="flex align-items-center bg-red-100 border-round p-3 w-full"
                >
                    <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                    <span>
                        {intl.formatMessage({ id: 'Sección desde la que se pueden cargar los parámetros disponibles de un Palet, Pantalla 1 tabla Parámetros del documento "Análisis de trazabilidad de ruta". El problema con esto es que, actualmente, deben modificarse uno a uno en cada cambio de estado, de momento se deja así pero esta pantalla podría eliminarse en el futuro y que esta información se rellene automáticamente.' })}
                    </span>
                </div>
            </div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Parametro' })}
                getRegistros={getParametro}
                getRegistrosCount={getParametroCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Parametro"}
                editarComponente={<EditarParametro />}
                columnas={columnas}
                deleteRegistro={deleteParametro}
            />
        </div>
    );
};

export default Parametro;