"use client";
import { getVistaEmpresaRol, getVistaEmpresaRolCount, deleteRol } from "@/app/api-endpoints/rol";
import EditarRoles from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const Rol = () => {
    const intl = useIntl();
    const columnas = [
 
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
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarRoles />}
                columnas={columnas}
                deleteRegistro={deleteRol}
            />
        </div>
    );
};
export default Rol;