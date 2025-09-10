import { EnvioControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvio = new EnvioControllerApi(settings)

export const getEnvio = async (filtro) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerFind(filtro)
    return dataEnvio
}

export const getEnvioCount = async (filtro) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerCount(filtro)
    return dataEnvio
}

export const postEnvio = async (objEnvio) => {
    try {
        const { data: dataEnvio } = await apiEnvio.envioControllerCreate(objEnvio)
        return dataEnvio

    } catch (error) {
        console.log(error)
    }
}

export const patchEnvio = async (idEnvio, objEnvio) => {
    try{
        const { data: dataEnvio } = await apiEnvio.envioControllerUpdateById(idEnvio, objEnvio)
        return dataEnvio
    }
    catch (error) {
        console.log(error)
    }
}

export const deleteEnvio = async (idEnvio) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerDeleteById(idEnvio)
    return dataEnvio
}
