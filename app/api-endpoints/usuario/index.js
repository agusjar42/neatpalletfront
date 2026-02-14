import { UsuariosControllerApi, settings } from "@/app/api-neatpallet";

const apiUsuario = new UsuariosControllerApi(settings)


export const getUsuarios = async (filtro) => {
    const { data: dataUsuarios } = await apiUsuario.usuariosControllerFind(filtro)
    return dataUsuarios
}

export const getUsuariosCount = async (filtro) => {
    const { data: dataUsuarios } = await apiUsuario.usuariosControllerCount(filtro)
    return dataUsuarios
}

export const getVistaUsuarios = async (filtro) => {
    const { data: dataUsuarios } = await apiUsuario.usuariosControllerVistaEmpresaRolUsuario(filtro)
    return dataUsuarios
}

export const getVistaUsuariosCount = async (filtro) => {
    const { data: dataUsuarios } = await apiUsuario.usuariosControllerVistaEmpresaRolUsuarioCount(filtro)
    return dataUsuarios
}

export const postUsuario = async (objUsuario) => {
    const { data: dataUsuario } = await apiUsuario.usuariosControllerCreate(objUsuario)
    return dataUsuario
}

export const recuperarPasswordUsuario = async (objEmail) => {
    try {
        // La operación en el OpenAPI está tipada como `void` (puede no devolver body aunque sea 200)
        await apiUsuario.usuariosControllerRecuperarPassword(objEmail)
        return { status: "OK" }
    } catch (error) {
        const httpStatus = error?.response?.status
        let message =
            error?.response?.data?.message ||
            error?.response?.data?.error?.message ||
            error?.message ||
            "Error al recuperar la contraseña"

        if (httpStatus === 401) {
            message =
                "No autorizado (401): el endpoint de recuperar contraseña requiere autenticación en el backend."
        }

        console.error("recuperarPasswordUsuario error", {
            httpStatus,
            url: error?.config?.url,
            baseURL: error?.config?.baseURL,
            data: error?.response?.data,
        })

        return { status: "ERROR", httpStatus, message }
    }
}

export const patchUsuario = async (idUsuario, objUsuario) => {
    const { data: dataUsuario } = await apiUsuario.usuariosControllerUpdateById(idUsuario, objUsuario)
    return dataUsuario
}

export const patchUsuarioCredenciales = async (idUsuario, objUsuario) => {
    const { data: dataUsuario } = await apiUsuario.usuariosControllerUpdateByIdCredenciales(idUsuario, objUsuario)
    return dataUsuario
}

export const deleteUsuario = async (idUsuario) => {
    const { data: dataUsuario } = await apiUsuario.usuariosControllerDeleteById(idUsuario)
    return dataUsuario
}

export const validarCodigoRecuperacion = async (filtro) => {
    const { data: dataUsuarios } = await apiUsuario.usuariosControllerValidarCodigoRecuperacion(filtro)
    return dataUsuarios
}
