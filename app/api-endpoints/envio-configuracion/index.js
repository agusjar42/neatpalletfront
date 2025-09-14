import { EnvioConfiguracionControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioConfiguracion = new EnvioConfiguracionControllerApi(settings)

export const getEnvioConfiguracion = async (filtro) => {
    const { data: dataEnvioConfiguraciones } = await apiEnvioConfiguracion.envioConfiguracionControllerFind(filtro)
    return dataEnvioConfiguraciones
}

export const postEnvioConfiguracion = async (objEnvioConfiguracion) => {
    const { data: dataEnvioConfiguracion } = await apiEnvioConfiguracion.envioConfiguracionControllerCreate(objEnvioConfiguracion)
    return dataEnvioConfiguracion
}

export const patchEnvioConfiguracion = async (idEnvioConfiguracion, objEnvioConfiguracion) => {
    const { data: dataEnvioConfiguracion } = await apiEnvioConfiguracion.envioConfiguracionControllerUpdateById(idEnvioConfiguracion, objEnvioConfiguracion)   
    return dataEnvioConfiguracion
}

export const deleteEnvioConfiguracion = async (idEnvioConfiguracion) => {
    const { data: dataEnvioConfiguracion } = await apiEnvioConfiguracion.envioConfiguracionControllerDeleteById(idEnvioConfiguracion)
    return dataEnvioConfiguracion
}

export const getEnvioConfiguracionCount = async (filtros) => {
    try {
        const { data: dataEnvioConfiguracion } = await apiEnvioConfiguracion.envioConfiguracionControllerCount(filtros)
        return dataEnvioConfiguracion   
    } catch (error) {
        console.log(error)
    }
}