import { MensajePlantillaControllerApi, settings } from "@/app/api-neatpallet";

const apiMensajePlantilla = new MensajePlantillaControllerApi(settings)

export const getMensajePlantillas = async (filtro) => {
    const { data: dataMensajePlantilla } = await apiMensajePlantilla.mensajePlantillaControllerFind(filtro)
    return dataMensajePlantilla
}

export const getMensajePlantillasCount = async (filtro) => {
    const { data: dataMensajePlantilla } = await apiMensajePlantilla.mensajePlantillaControllerCount(filtro)
    return dataMensajePlantilla
}

export const postMensajePlantilla = async (objMensajePlantilla) => {
    const { data: dataMensajePlantilla } = await apiMensajePlantilla.MensajePlantillaControllerCreate(objMensajePlantilla)
    return dataMensajePlantilla
}

export const patchMensajePlantilla = async (idMensajePlantilla, objMensajePlantilla) => {
    const { data: dataMensajePlantilla } = await apiMensajePlantilla.MensajePlantillaControllerUpdateById(idMensajePlantilla, objMensajePlantilla)
    return dataMensajePlantilla
}

export const deleteMensajePlantilla = async (idMensajePlantilla) => {
    const { data: dataMensajePlantilla } = await apiMensajePlantilla.MensajePlantillaControllerDeleteById(idMensajePlantilla)
    return dataMensajePlantilla
}