
import { EnvioPalletControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioPallet = new EnvioPalletControllerApi(settings)

export const getEnvioPallet = async (filtro) => {
    const { data: dataEnvioPallets } = await apiEnvioPallet.envioPalletControllerFind(filtro)
    return dataEnvioPallets
}

export const postEnvioPallet = async (objEnvioPallet) => {
    const { data: dataEnvioPallet } = await apiEnvioPallet.envioPalletControllerCreate(objEnvioPallet)
    return dataEnvioPallet
}

export const patchEnvioPallet = async (idEnvioPallet, objEnvioPallet) => {
    const { data: dataEnvioPallet } = await apiEnvioPallet.envioPalletControllerUpdateById(idEnvioPallet, objEnvioPallet)   
    return dataEnvioPallet
}

export const deleteEnvioPallet = async (idEnvioPallet) => {
    const { data: dataEnvioPallet } = await apiEnvioPallet.envioPalletControllerDeleteById(idEnvioPallet)
    return dataEnvioPallet
}

export const getEnvioPalletCount = async (filtros) => {
    try {
        const { data: dataEnvioPallet } = await apiEnvioPallet.envioPalletControllerCount(filtros)
        return dataEnvioPallet   
    } catch (error) {
        console.log(error)
    }
}