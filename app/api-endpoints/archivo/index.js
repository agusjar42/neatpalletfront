import { ArchivoControllerApi, settings } from "@/app/api-neatpallet";

const apiArchivo = new ArchivoControllerApi(settings)

export const getArchivos = async () => {
    const { data: dataArchivos } = await apiArchivo.archivoControllerFind()
    return dataArchivos
}

export const postArchivo = async (objArchivo) => {
    const { data: dataArchivo } = await apiArchivo.archivoControllerCreate(objArchivo)
    return dataArchivo
}

export const patchArchivo = async (idArchivo, objArchivo) => {
    const { data: dataArchivo } = await apiArchivo.archivoControllerUpdateById(idArchivo, objArchivo)
    return dataArchivo
}

export const deleteArchivo = async (idArchivo) => {
    const { data: dataArchivo } = await apiArchivo.archivoControllerDeleteById(idArchivo)
    return dataArchivo
}

export const getVistaArchivoEmpresa = async (filtro) => {
    const { data: dataArchivos } = await apiArchivo.archivoControllerVistaArchivoEmpresa(filtro)
    return dataArchivos
}

export const getVistaArchivoEmpresaCount = async (filtro) => {
    const { data: dataArchivos } = await apiArchivo.archivoControllerVistaArchivoEmpresaCount(filtro)
    return dataArchivos
}