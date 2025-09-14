"use client";
import { getParametro, getParametroCount, deleteParametro } from "@/app/api-endpoints/parametro";
import EditarParametro from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const Parametro = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valorDisponible', header: intl.formatMessage({ id: 'Valores disponibles' }), tipo: 'string' },
    ]

    return (
        <div>
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