import { settings, PermisoControllerApi, ListaPermisosControllerApi } from "@/app/api-neatpallet";

const apiPermisos = new PermisoControllerApi(settings)
const apiListaPermisos = new ListaPermisosControllerApi(settings)

export const getPermiso= async () => {
    const { data: dataPermisos } = await apiPermisos.permisoControllerFind()
    return dataPermisos
}

export const postPermiso = async (objPermiso) => {
    const { data: dataPermiso } = await apiPermisos.permisoControllerCreate(objPermiso)
    return dataPermiso
}

export const patchPermiso = async (idPermiso, objPermiso) => {
    const { data: dataPermiso } = await apiPermisos.permisoControllerUpdateById(idPermiso, objPermiso)   
    return dataPermiso
}

export const deletePermiso = async (idPermiso) => {
    const { data: dataPermiso } = await apiPermisos.permisoControllerDeleteById(idPermiso)
    return dataPermiso
}

export const getListaPermisos = async () => {
    const { data: dataPermisos } = await apiListaPermisos.listaPermisosControllerFind()
    return dataPermisos
}

export const getVistaEmpresaRolPermiso = async (filtros) => {
    try {
        const { data: dataPermiso } = await apiPermisos.permisoControllerVistaEmpresaRolPermiso(filtros)
        return dataPermiso   
    } catch (error) {
        console.log(error)
    }
}

export const compruebaPermiso = async (rolId, modulo, controlador, accion) => {
    try {
        const { data: dataPermiso } = await apiPermisos.permisoControllerBuscarPermiso(rolId, modulo, controlador, accion)
        return dataPermiso   
    } catch (error) {
        console.log(error)
    }
}