import { RolControllerApi, settings, PermisoControllerApi, EmpresaControllerApi } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";
const apiRol = new RolControllerApi(settings)
const apiPermisos = new PermisoControllerApi(settings)
const apiEmpresa = new EmpresaControllerApi(settings)

export const getRol= async (filtro) => {
    const { data: dataRoles } = await apiRol.rolControllerFind(filtro)
    return dataRoles
}

export const postRol = async (objRol) => {
    const { data: dataRol } = await apiRol.rolControllerCreate(objRol)
    return dataRol
}

export const patchRol = async (idRol, objRol) => {
    const { data: dataRol } = await apiRol.rolControllerUpdateById(idRol, objRol)   
    return dataRol
}

export const deleteRol = async (idRol) => {
    const { data: dataRol } = await apiRol.rolControllerDeleteById(idRol)
    return dataRol
}

export const buscaPermisosExistente = async (idRol) => {
    const { data: dataRol } = await apiPermisos.permisoControllerFind(JSON.stringify(
        { where: { rolId: idRol } }
    ));
    return dataRol;
};

export const getVistaEmpresaRol = async (filtros) => {
    try {
        const { data: dataRol } = await apiRol.rolControllerVistaEmpresaRol(filtros)
        return dataRol   
    } catch (error) {
        console.log(error)
    }
}
export const getVistaEmpresaRolCount = async (filtros) => {
    try {
        const { data: dataRol } = await apiRol.rolControllerVistaEmpresaRolCount(filtros)
        return dataRol   
    } catch (error) {
        console.log(error)
    }
}

export const getEmpresas = async () => {
    const { data: dataRol } = await apiEmpresa.empresaControllerFind()
    return dataRol
}

export const getNombreRol = async (nombre) => {
    const { data: dataRol } = await apiRol.rolControllerBuscarIdRol(nombre)
    return dataRol
}

export const obtenerRolDashboard = async () => {
    const usuario = getUsuarioSesion();
    if(usuario){
        const queryParamsRol = {
            where: {
                and: {
                    id: usuario.rolId
                }
            },
        };
        const rol = await getVistaEmpresaRol(JSON.stringify(queryParamsRol));
        return rol[0].dashboardUrl || '/dashboard';
    }
    return '/dashboard';

}