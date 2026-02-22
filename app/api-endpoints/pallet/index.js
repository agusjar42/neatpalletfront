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
        // Normaliza tipos antes de llamar al backend (CSV suele traer strings)
        const normalizedPalletData = {
            ...palletData,
            orden:
                palletData?.orden === "" || palletData?.orden === null || palletData?.orden === undefined
                    ? palletData?.orden
                    : Number(palletData.orden),
        };

        if (
            normalizedPalletData.orden !== "" &&
            normalizedPalletData.orden !== null &&
            normalizedPalletData.orden !== undefined &&
            Number.isNaN(normalizedPalletData.orden)
        ) {
            throw new Error(`Campo 'orden' inválido: ${palletData.orden}`);
        }
        // Primero buscamos si existe un pallet con el mismo código en la empresa
        const filtro = JSON.stringify({
            where: {
                and: {
                    codigo: normalizedPalletData.codigo
                }
            }
        });
        
        const {data: existingPallets} = await apiPallet.palletControllerFind(filtro);
        
        if (existingPallets && existingPallets.length > 0) {
            // Si existe, actualizamos el primer registro encontrado
            const existingPallet = existingPallets[0];
            const { data: updatedPallet } = await apiPallet.palletControllerUpdateById(existingPallet.id, normalizedPalletData);
            return { action: 'updated', data: updatedPallet };
        } else {
            // Si no existe, creamos uno nuevo
            const { data: newPallet } = await apiPallet.palletControllerCreate(normalizedPalletData);
            return { action: 'created', data: newPallet };
        }
    } catch (error) {
        console.error('Error en upsert de pallet:', error);
        throw error;
    }
}
