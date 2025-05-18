"use client";
import { getVistaTipoArchivoEmpresaSeccionCount, getVistaTipoArchivoEmpresaSeccion, deleteTipoArchivo } from "@/app/api-endpoints/tipo_archivo";
import EditarTipoArchivo from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
const TipoArchivo = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombreEmpresa', header: intl.formatMessage({ id: 'Empresa' }), tipo: 'string' },
        { campo: 'nombreSeccion', header: intl.formatMessage({ id: 'Seccion' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Tipos de archivo' })}
                getRegistros={getVistaTipoArchivoEmpresaSeccion}
                getRegistrosCount={getVistaTipoArchivoEmpresaSeccionCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Tipos de archivo"}
                empresaId={null}
                editarComponente={<EditarTipoArchivo />}
                columnas={columnas}
                deleteRegistro={deleteTipoArchivo}
            />
        </div>
    );
};
export default TipoArchivo;