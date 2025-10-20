import { EnvioSensorEmpresaControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioSensorEmpresa = new EnvioSensorEmpresaControllerApi(settings)

export const getEnvioSensorEmpresa = async (filtro) => {
    const { data: dataEnvioSensorEmpresas } = await apiEnvioSensorEmpresa.envioSensorEmpresaControllerFind(filtro)
    return dataEnvioSensorEmpresas
}

export const postEnvioSensorEmpresa = async (objEnvioSensorEmpresa) => {
    const { data: dataEnvioSensorEmpresa } = await apiEnvioSensorEmpresa.envioSensorEmpresaControllerCreate(objEnvioSensorEmpresa)
    return dataEnvioSensorEmpresa
}

export const patchEnvioSensorEmpresa = async (idEnvioSensorEmpresa, objEnvioSensorEmpresa) => {
    const { data: dataEnvioSensorEmpresa } = await apiEnvioSensorEmpresa.envioSensorEmpresaControllerUpdateById(idEnvioSensorEmpresa, objEnvioSensorEmpresa)
    return dataEnvioSensorEmpresa
}

export const deleteEnvioSensorEmpresa = async (idEnvioSensorEmpresa) => {
    const { data: dataEnvioSensorEmpresa } = await apiEnvioSensorEmpresa.envioSensorEmpresaControllerDeleteById(idEnvioSensorEmpresa)
    return dataEnvioSensorEmpresa
}

export const getEnvioSensorEmpresaCount = async (filtros) => {
    try {
        const { data: dataEnvioSensorEmpresa } = await apiEnvioSensorEmpresa.envioSensorEmpresaControllerCount(filtros)
        return dataEnvioSensorEmpresa
    } catch (error) {
        console.log(error)
    }
}
