import { TipoCarroceriaControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoCarroceria = new TipoCarroceriaControllerApi(settings)

export const getTipoCarroceria = async (filtro) => {
    const { data: dataTipoCarrocerias } = await apiTipoCarroceria.tipoCarroceriaControllerFind(filtro)
    return dataTipoCarrocerias
}

export const postTipoCarroceria = async (objTipoCarroceria) => {
    const { data: dataTipoCarroceria } = await apiTipoCarroceria.tipoCarroceriaControllerCreate(objTipoCarroceria)
    return dataTipoCarroceria
}

export const patchTipoCarroceria = async (idTipoCarroceria, objTipoCarroceria) => {
    const { data: dataTipoCarroceria } = await apiTipoCarroceria.tipoCarroceriaControllerUpdateById(idTipoCarroceria, objTipoCarroceria)   
    return dataTipoCarroceria
}

export const deleteTipoCarroceria = async (idTipoCarroceria) => {
    const { data: dataTipoCarroceria } = await apiTipoCarroceria.tipoCarroceriaControllerDeleteById(idTipoCarroceria)
    return dataTipoCarroceria
}

export const getTipoCarroceriaCount = async (filtros) => {
    try {
        const { data: dataTipoCarroceria } = await apiTipoCarroceria.tipoCarroceriaControllerCount(filtros)
        return dataTipoCarroceria   
    } catch (error) {
        console.log(error)
    }
}