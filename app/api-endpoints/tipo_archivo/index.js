import { TipoArchivoControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoArchivo = new TipoArchivoControllerApi(settings)

export const getTipoArchivos = async () => {
    const { data: dataTipoArchivos } = await apiTipoArchivo.tipoArchivoControllerFind()
    return dataTipoArchivos
}

export const postTipoArchivo = async (objTipoArchivo) => {
    const { data: dataTipoArchivo } = await apiTipoArchivo.tipoArchivoControllerCreate(objTipoArchivo)
    return dataTipoArchivo
}

export const patchTipoArchivo = async (idTipoArchivo, objTipoArchivo) => {
    const { data: dataTipoArchivo } = await apiTipoArchivo.tipoArchivoControllerUpdateById(idTipoArchivo, objTipoArchivo)
    return dataTipoArchivo
}

export const deleteTipoArchivo = async (idTipoArchivo) => {
    const { data: dataTipoArchivo } = await apiTipoArchivo.tipoArchivoControllerDeleteById(idTipoArchivo)
    return dataTipoArchivo
}

export const getVistaTipoArchivoEmpresaSeccion = async (filtro) => {
    const { data: dataTipoArchivos } = await apiTipoArchivo.tipoArchivoControllerVistaTipoArchivoEmpresaSeccion(filtro)
    return dataTipoArchivos
}

export const getVistaTipoArchivoEmpresaSeccionCount = async (filtro) => {
    const { data: dataTipoArchivos } = await apiTipoArchivo.tipoArchivoControllerVistaTipoArchivoEmpresaSeccionCount(filtro)
    return dataTipoArchivos
}