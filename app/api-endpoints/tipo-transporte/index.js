import { TipoTransporteControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoTransporte = new TipoTransporteControllerApi(settings)

export const getTipoTransporte = async (filtro) => {
    const { data: dataTipoTransportes } = await apiTipoTransporte.tipoTransporteControllerFind(filtro)
    return dataTipoTransportes
}

export const postTipoTransporte = async (objTipoTransporte) => {
    const { data: dataTipoTransporte } = await apiTipoTransporte.tipoTransporteControllerCreate(objTipoTransporte)
    return dataTipoTransporte
}

export const patchTipoTransporte = async (idTipoTransporte, objTipoTransporte) => {
    const { data: dataTipoTransporte } = await apiTipoTransporte.tipoTransporteControllerUpdateById(idTipoTransporte, objTipoTransporte)   
    return dataTipoTransporte
}

export const deleteTipoTransporte = async (idTipoTransporte) => {
    const { data: dataTipoTransporte } = await apiTipoTransporte.tipoTransporteControllerDeleteById(idTipoTransporte)
    return dataTipoTransporte
}

export const getTipoTransporteCount = async (filtros) => {
    try {
        const { data: dataTipoTransporte } = await apiTipoTransporte.tipoTransporteControllerCount(filtros)
        return dataTipoTransporte   
    } catch (error) {
        console.log(error)
    }
}