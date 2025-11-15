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

export const upsertPalletFromCSV = async (palletData) => {
    try {
        // Primero buscamos si existe un pallet con el mismo código en la empresa
        const filtro = JSON.stringify({
            where: {
                and: {
                    codigo: palletData.codigo,
                    empresaId: palletData.empresaId,
                    alias: palletData.alias,
                    modelo: palletData.modelo,
                    medidas: palletData.medidas 
                }
            }
        });
        
        const {data: existingPallets} = await apiPallet.palletControllerFind(filtro);
        
        if (existingPallets && existingPallets.length > 0) {
            // Si existe, actualizamos el primer registro encontrado
            const existingPallet = existingPallets[0];
            const { data: updatedPallet } = await apiPallet.palletControllerUpdateById(existingPallet.id, palletData);
            return { action: 'updated', data: updatedPallet };
        } else {
            // Si no existe, creamos uno nuevo
            const { data: newPallet } = await apiPallet.palletControllerCreate(palletData);
            return { action: 'created', data: newPallet };
        }
    } catch (error) {
        console.error('Error en upsert de pallet:', error);
        throw error;
    }
}
