import { EnvioPalletMovimientoControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioMovimiento = new EnvioPalletMovimientoControllerApi(settings)

export const getEnvioMovimiento = async (filtro) => {
    const { data: dataEnvioMovimientos } = await apiEnvioMovimiento.envioPalletMovimientoControllerFind(filtro)
    return dataEnvioMovimientos
}

export const postEnvioMovimiento = async (objEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioPalletMovimientoControllerCreate(objEnvioMovimiento)
    return dataEnvioMovimiento
}

export const patchEnvioMovimiento = async (idEnvioMovimiento, objEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioPalletMovimientoControllerUpdateById(idEnvioMovimiento, objEnvioMovimiento)   
    return dataEnvioMovimiento
}

export const deleteEnvioMovimiento = async (idEnvioMovimiento) => {
    const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioPalletMovimientoControllerDeleteById(idEnvioMovimiento)
    return dataEnvioMovimiento
}

export const getEnvioMovimientoCount = async (filtros) => {
    try {
        const { data: dataEnvioMovimiento } = await apiEnvioMovimiento.envioPalletMovimientoControllerCount(filtros)
        return dataEnvioMovimiento   
    } catch (error) {
        console.log(error)
    }
}
