import { PalletsMovementsControllerApi, settings } from "@/app/api-neatpallet";

const apiMovimientos = new PalletsMovementsControllerApi(settings)

export const getMovimientos = async (filtro) => {
    const { data: dataMovimientos } = await apiMovimientos.palletsMovementsControllerFind(filtro)
    return dataMovimientos
}

export const getMovimientosCount = async (filtro) => {
    const { data: dataMovimientos } = await apiMovimientos.palletsMovementsControllerCount(filtro)
    return dataMovimientos
}

export const postMovimiento = async (objPais) => {
    try {
        const { data: dataMovimiento } = await apiMovimientos.palletsMovementsControllerCreate(objPais)
        return dataMovimiento

    } catch (error) {
        console.log(error)
    }
}

export const patchMovimiento = async (idPais, objMovimiento) => {
    try{
        const { data: dataMovimiento } = await apiMovimientos.palletsMovementsControllerUpdateById(idPais, objPais)
        return dataMovimiento
    }
    catch (error) {
        console.log(error)
    }
}

export const deleteMovimiento = async (idPais) => {
    const { data: dataMovimiento } = await apiMovimientos.palletsMovementsControllerDeleteById(idPais)
    return dataMovimiento
}
