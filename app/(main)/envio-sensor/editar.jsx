import { EnvioConfiguracionEmpresaControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioConfiguracionEmpresa = new EnvioConfiguracionEmpresaControllerApi(settings)

export const getEnvioConfiguracionEmpresa = async (filtro) => {
    const { data: dataEnvioConfiguracionEmpresas } = await apiEnvioConfiguracionEmpresa.envioConfiguracionEmpresaControllerFind(filtro)
    return dataEnvioConfiguracionEmpresas
}

export const postEnvioConfiguracionEmpresa = async (objEnvioConfiguracionEmpresa) => {
    const { data: dataEnvioConfiguracionEmpresa } = await apiEnvioConfiguracionEmpresa.envioConfiguracionEmpresaControllerCreate(objEnvioConfiguracionEmpresa)
    return dataEnvioConfiguracionEmpresa
}

export const patchEnvioConfiguracionEmpresa = async (idEnvioConfiguracionEmpresa, objEnvioConfiguracionEmpresa) => {
    const { data: dataEnvioConfiguracionEmpresa } = await apiEnvioConfiguracionEmpresa.envioConfiguracionEmpresaControllerUpdateById(idEnvioConfiguracionEmpresa, objEnvioConfiguracionEmpresa)   
    return dataEnvioConfiguracionEmpresa
}

export const deleteEnvioConfiguracionEmpresa = async (idEnvioConfiguracionEmpresa) => {
    const { data: dataEnvioConfiguracionEmpresa } = await apiEnvioConfiguracionEmpresa.envioConfiguracionEmpresaControllerDeleteById(idEnvioConfiguracionEmpresa)
    return dataEnvioConfiguracionEmpresa
}

export const getEnvioConfiguracionEmpresaCount = async (filtros) => {
    try {
        const { data: dataEnvioConfiguracionEmpresa } = await apiEnvioConfiguracionEmpresa.envioConfiguracionEmpresaControllerCount(filtros)
        return dataEnvioConfiguracionEmpresa   
    } catch (error) {
        console.log(error)
    }
}