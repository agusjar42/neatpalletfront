import { PalletConfiguracionControllerApi, settings } from "@/app/api-neatpallet";

const apiPalletConfiguracion = new PalletConfiguracionControllerApi(settings)

export const getPalletConfiguracion = async (filtro) => {
    const { data: dataPalletConfiguracion } = await apiPalletConfiguracion.palletConfiguracionControllerFind(filtro)
    return dataPalletConfiguracion
}

export const getPalletConfiguracionCount = async (filtro) => {
    const { data: dataPalletConfiguracion } = await apiPalletConfiguracion.palletConfiguracionControllerCount(filtro)
    return dataPalletConfiguracion
}

export const postPalletConfiguracion = async (objPalletConfiguracion) => {
    try {
        const { data: dataPalletConfiguracion } = await apiPalletConfiguracion.palletConfiguracionControllerCreate(objPalletConfiguracion)
        return dataPalletConfiguracion

    } catch (error) {
        console.log(error)
    }
}

export const patchPalletConfiguracion = async (idPalletConfiguracion, objPalletConfiguracion) => {
    try{
        const { data: dataPalletConfiguracion } = await apiPalletConfiguracion.palletConfiguracionControllerUpdateById(idPalletConfiguracion, objPalletConfiguracion)
        return dataPalletConfiguracion
    }
    catch (error) {
        console.log(error)
    }
}

export const deletePalletConfiguracion = async (idPalletConfiguracion) => {
    const { data: dataPalletConfiguracion } = await apiPalletConfiguracion.palletConfiguracionControlleDeleteById(idPalletConfiguracion)
    return dataPalletConfiguracion
}
