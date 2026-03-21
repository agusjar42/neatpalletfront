"use client";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/tipo-carroceria";
import EditarTipoCarroceria from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const TipoCarroceria = () => {
    const intl = useIntl();
    const empresaIdSesion = getUsuarioSesion()?.empresaId;
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
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
                controlador={"Tipos de Carrocería"}
                filtradoBase={{empresaId: empresaIdSesion}}
                editarComponente={<EditarTipoCarroceria />}
                editarComponenteParametrosExtra={{empresaId: empresaIdSesion}}
                columnas={columnas}
                deleteRegistro={deleteTipoCarroceria}
            />
        </div>
    );
};

export default TipoCarroceria;
