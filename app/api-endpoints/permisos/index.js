import axios from "axios";
import { settings, PermisoControllerApi } from "@/app/api-neatpallet";
import { devuelveBasePath, getAccessToken } from "@/app/utility/Utils";

const apiPermisos = new PermisoControllerApi(settings)

export const getPermiso = async (filtro) => {
    const { data: dataPermisos } = await apiPermisos.permisoControllerFind(filtro)
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
    try {
        const { data: dataPermiso } = await apiPermisos.permisoControllerDeleteById(idPermiso)
        return dataPermiso
    } catch (error) {
        console.error("Error al eliminar el permiso:", error);
        throw error;
    }
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
        console.log('Error en compruebaPermiso:', error)
        return []
    }
}

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAccessToken()}`
})

export const actualizarMatrizPermisos = async (objActualizacion) => {
    const { data } = await axios.post(
        `${devuelveBasePath()}/permisos/actualizar-matriz`,
        objActualizacion,
        { headers: getAuthHeaders() }
    )

    return data
}
