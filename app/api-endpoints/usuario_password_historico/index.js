import { UsuarioPasswordHistoricoControllerApi, settings } from "@/app/api-neatpallet";

const apiUsuarioPasswordHistorico = new UsuarioPasswordHistoricoControllerApi(settings)

export const getUsuarioPasswordHistoricos = async (filtro) => {
    const { data: dataUsuarioPasswordHistoricos } = await apiUsuarioPasswordHistorico.usuarioPasswordHistoricoControllerFind(filtro)
    return dataUsuarioPasswordHistoricos
}

export const getUsuarioPasswordHistoricosCount = async (filtro) => {
    const { data: dataUsuarioPasswordHistoricos } = await apiUsuarioPasswordHistorico.usuarioPasswordHistoricoControllerCount(filtro)
    return dataUsuarioPasswordHistoricos
}

export const postUsuarioPasswordHistorico = async (objUsuarioPasswordHistorico) => {
    const { data: dataUsuarioPasswordHistorico } = await apiUsuarioPasswordHistorico.usuarioPasswordHistoricoControllerCreate(objUsuarioPasswordHistorico)
    return dataUsuarioPasswordHistorico
}

export const patchUsuarioPasswordHistorico = async (idUsuarioPasswordHistorico, objUsuarioPasswordHistorico) => {
    const { data: dataUsuarioPasswordHistorico } = await apiUsuarioPasswordHistorico.usuarioPasswordHistoricoControllerUpdateById(idUsuarioPasswordHistorico, objUsuarioPasswordHistorico)
    return dataUsuarioPasswordHistorico
}

export const deleteUsuarioPasswordHistorico = async (idUsuarioPasswordHistorico) => {
    const { data: dataUsuarioPasswordHistorico } = await apiUsuarioPasswordHistorico.usuarioPasswordHistoricoControllerDeleteById(idUsuarioPasswordHistorico)
    return dataUsuarioPasswordHistorico
}