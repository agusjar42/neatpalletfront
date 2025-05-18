import { SeccionControllerApi, settings } from "@/app/api-neatpallet";

const apiSeccion = new SeccionControllerApi(settings)

export const getSecciones = async (filtro) => {
    const { data: dataSeccions } = await apiSeccion.seccionControllerFind(filtro)
    return dataSeccions
}

export const getSeccionesCount = async (filtro) => {
    const { data: dataSeccions } = await apiSeccion.seccionControllerCount(filtro)
    return dataSeccions
}

export const postSeccion = async (objSeccion) => {
    const { data: dataSeccion } = await apiSeccion.seccionControllerCreate(objSeccion)
    return dataSeccion
}

export const patchSeccion = async (idSeccion, objSeccion) => {
    const { data: dataSeccion } = await apiSeccion.seccionControllerUpdateById(idSeccion, objSeccion)
    return dataSeccion
}

export const deleteSeccion = async (idSeccion) => {
    const { data: dataSeccion } = await apiSeccion.seccionControllerDeleteById(idSeccion)
    return dataSeccion
}