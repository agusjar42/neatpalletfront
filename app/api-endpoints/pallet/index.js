import { PalletControllerApi, settings } from "@/app/api-neatpallet";

const apiPallet = new PalletControllerApi(settings)

export const getPallet = async (filtro) => {
    const { data: dataPallet } = await apiPallet.palletControllerFind(filtro)
    return dataPallet
}

export const getPalletCount = async (filtro) => {
    const { data: dataPallet } = await apiPallet.palletControllerCount(filtro)
    return dataPallet
}

export const postPallet = async (objPallet) => {
    try {
        const { data: dataPallet } = await apiPallet.palletControllerCreate(objPallet)
        return dataPallet

    } catch (error) {
        console.log(error)
    }
}

export const patchPallet = async (idPallet, objPallet) => {
    try{
        const { data: dataPallet } = await apiPallet.palletControllerUpdateById(idPallet, objPallet)
        return dataPallet
    }
    catch (error) {
        console.log(error)
    }
}

export const deletePallet = async (idPallet) => {
    const { data: dataPallet } = await apiPallet.palletControlleDeleteById(idPallet)
    return dataPallet
}
