import { EnvioMovimientoControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioMovimiento = new EnvioMovimientoControllerApi(settings)

export const getEnvioMovimiento = async (filtro) => {
    const { data: dataEnvioMovimientos } = await apiEnvioMovimiento.envioMovimientoControllerFind(filtro)
    return dataEnvioMovimientos
}

export const postEnvioMovimiento = async (objEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioMovimientoControllerCreate(objEnvioMovimiento)
    return dataEnvioMovimiento
}

export const patchEnvioMovimiento = async (idEnvioMovimiento, objEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioMovimientoControllerUpdateById(idEnvioMovimiento, objEnvioMovimiento)   
    return dataEnvioMovimiento
}

export const deleteEnvioMovimiento = async (idEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioMovimientoControllerDeleteById(idEnvioMovimiento)
    return dataEnvioMovimiento
}

export const getEnvioMovimientoCount = async (filtros) => {
    try {
        const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioMovimientoControllerCount(filtros)
        return dataEnvioMovimiento   
    } catch (error) {
        console.log(error)
    }
}