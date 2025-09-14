import { PalletParametroControllerApi, settings } from "@/app/api-neatpallet";

const apiPalletParametro = new PalletParametroControllerApi(settings)

export const getPalletParametro = async (filtro) => {
    const { data: dataPalletParametros } = await apiPalletParametro.palletParametroControllerFind(filtro)
    return dataPalletParametros
}

export const postPalletParametro = async (objPalletParametro) => {
    const { data: dataPalletParametro } = await apiPalletParametro.palletParametroControllerCreate(objPalletParametro)
    return dataPalletParametro
}

export const patchPalletParametro = async (idPalletParametro, objPalletParametro) => {
    const { data: dataPalletParametro } = await apiPalletParametro.palletParametroControllerUpdateById(idPalletParametro, objPalletParametro)   
    return dataPalletParametro
}

export const deletePalletParametro = async (idPalletParametro) => {
    const { data: dataPalletParametro } = await apiPalletParametro.palletParametroControllerDeleteById(idPalletParametro)
    return dataPalletParametro
}

export const getPalletParametroCount = async (filtros) => {
    try {
        const { data: dataPalletParametro } = await apiPalletParametro.palletParametroControllerCount(filtros)
        return dataPalletParametro   
    } catch (error) {
        console.log(error)
    }
}