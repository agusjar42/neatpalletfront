import { PalletControllerApi, settings } from "@/app/api-neatpallet";

const apiPallet = new PalletControllerApi(settings)

export const getPallet = async (filtro) => {
    const { data: dataPallets } = await apiPallet.palletControllerFind(filtro)
    return dataPallets
}

export const getPalletById = async (id) => {
    const { data: dataPallet } = await apiPallet.palletControllerFindById(id)
    return dataPallet
}

export const postPallet = async (objPallet) => {
    const { data: dataPallet } = await apiPallet.palletControllerCreate(objPallet)
    return dataPallet
}

export const patchPallet = async (idPallet, objPallet) => {
    const { data: dataPallet } = await apiPallet.palletControllerUpdateById(idPallet, objPallet)   
    return dataPallet
}

export const deletePallet = async (idPallet) => {
    const { data: dataPallet } = await apiPallet.palletControllerDeleteById(idPallet)
    return dataPallet
}

export const getPalletCount = async (filtros) => {
    try {
        const { data: dataPallet } = await apiPallet.palletControllerCount(filtros)
        return dataPallet   
    } catch (error) {
        console.log(error)
    }
}
