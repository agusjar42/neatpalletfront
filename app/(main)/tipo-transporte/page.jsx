"use client";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import EditarTipoTransportes from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const TipoTransporte = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Tipos de Transporte' })}
                getRegistros={getTipoTransporte}
                getRegistrosCount={getTipoTransporteCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipo Transporte"}
                editarComponente={<EditarTipoTransportes />}
                columnas={columnas}
                deleteRegistro={deleteTipoTransporte}
            />
        </div>
    );
};

export default TipoTransporte;