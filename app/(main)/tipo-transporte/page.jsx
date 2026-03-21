"use client";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import EditarTipoTransportes from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const TipoTransporte = () => {
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
                headerCrud={intl.formatMessage({ id: 'Tipos de Transporte' })}
                getRegistros={getTipoTransporte}
                getRegistrosCount={getTipoTransporteCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipo Transporte"}
                filtradoBase={{empresaId: empresaIdSesion}}
                editarComponente={<EditarTipoTransportes />}
                editarComponenteParametrosExtra={{empresaId: empresaIdSesion}}
                columnas={columnas}
                deleteRegistro={deleteTipoTransporte}
            />
        </div>
    );
};

export default TipoTransporte;
