"use client";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/tipo-carroceria";
import EditarTipoCarroceria from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const TipoCarroceria = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Tipos de Carrocería' })}
                getRegistros={getTipoCarroceria}
                getRegistrosCount={getTipoCarroceriaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipo Carroceria"}
                editarComponente={<EditarTipoCarroceria />}
                columnas={columnas}
                deleteRegistro={deleteTipoCarroceria}
            />
        </div>
    );
};

export default TipoCarroceria;