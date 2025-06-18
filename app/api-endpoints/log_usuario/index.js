import { LogUsuarioControllerApi, settings } from "@/app/api-neatpallet";

const apiLogUsuario = new LogUsuarioControllerApi(settings)

export const getLogUsuarios = async () => {
    const { data: dataLogUsuarios } = await apiLogUsuario.logUsuarioControllerFind()
    return dataLogUsuarios
}

export const postLogUsuario = async (objLogUsuario) => {
    const { data: dataLogUsuario } = await apiLogUsuario.logUsuarioControllerCreate(objLogUsuario)
    return dataLogUsuario
}

export const patchLogUsuario = async (idLogUsuario, objLogUsuario) => {
    const { data: dataLogUsuario } = await apiLogUsuario.logUsuarioControllerUpdateById(idLogUsuario, objLogUsuario)
    return dataLogUsuario
}

export const deleteLogUsuario = async (idLogUsuario) => {
    const { data: dataLogUsuario } = await apiLogUsuario.logUsuarioControllerDeleteById(idLogUsuario)
    return dataLogUsuario
}

export const getVistaLogUsuarioUsuarios = async (filtro) => {
    const { data: dataLogUsuarios } = await apiLogUsuario.logUsuarioControllerVistaLogUsuarioUsuario(filtro)
    return dataLogUsuarios
}
export const getVistaLogUsuarioUsuariosCount = async (filtro) => {
    const { data: dataLogUsuarios } = await apiLogUsuario.logUsuarioControllerVistaLogUsuarioUsuarioCount(filtro)
    return dataLogUsuarios
}
