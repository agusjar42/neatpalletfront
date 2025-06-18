import { TipoUsuarioUsuarioControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoUsuarioUsuario = new TipoUsuarioUsuarioControllerApi(settings)

export const getUsuarioTipos = async (filtro) => {
    const { data: dataTipoUsuarioUsuarios } = await apiTipoUsuarioUsuario.tipoUsuarioUsuarioControllerFind(filtro)
    return dataTipoUsuarioUsuarios
}

export const postUsuarioTipos = async (objUsuario) => {
    const { data: dataTipoUsuarioUsuario } = await apiTipoUsuarioUsuario.tipoUsuarioUsuarioControllerCreate(objUsuario)
    return dataTipoUsuarioUsuario
}

export const deleteUsuarioTipos = async (idUsuario) => {
    const { data: dataTipoUsuarioUsuario } = await apiTipoUsuarioUsuario.tipoUsuarioUsuarioControllerDeleteById(idUsuario)
    return dataTipoUsuarioUsuario
}