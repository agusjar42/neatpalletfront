"use client";
import { getVistaEmpresaRol, getVistaEmpresaRolCount, deleteRol } from "@/app/api-endpoints/rol";
import EditarRoles from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
const Rol = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombreEmpresa', header: intl.formatMessage({ id: 'Empresa' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Roles' })}
                getRegistros={getVistaEmpresaRol}
                getRegistrosCount={getVistaEmpresaRolCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Roles"}
                empresaId={null}
                editarComponente={<EditarRoles />}
                columnas={columnas}
                deleteRegistro={deleteRol}
            />
        </div>
    );
};
export default Rol;