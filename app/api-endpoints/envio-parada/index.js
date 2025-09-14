import { EnvioParadaControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioParada = new EnvioParadaControllerApi(settings)

export const getEnvioParada = async (filtro) => {
    const { data: dataEnvioParadas } = await apiEnvioParada.envioParadaControllerFind(filtro)
    return dataEnvioParadas
}

export const postEnvioParada = async (objEnvioParada) => {
    const { data: dataEnvioParada } = await apiEnvioParada.envioParadaControllerCreate(objEnvioParada)
    return dataEnvioParada
}

export const patchEnvioParada = async (idEnvioParada, objEnvioParada) => {
    const { data: dataEnvioParada } = await apiEnvioParada.envioParadaControllerUpdateById(idEnvioParada, objEnvioParada)   
    return dataEnvioParada
}

export const deleteEnvioParada = async (idEnvioParada) => {
    const { data: dataEnvioParada } = await apiEnvioParada.envioParadaControllerDeleteById(idEnvioParada)
    return dataEnvioParada
}

export const getEnvioParadaCount = async (filtros) => {
    try {
        const { data: dataEnvioParada } = await apiEnvioParada.envioParadaControllerCount(filtros)
        return dataEnvioParada   
    } catch (error) {
        console.log(error)
    }
}
