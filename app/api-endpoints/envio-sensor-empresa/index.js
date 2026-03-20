import { EnvioSensorEmpresaControllerApi, settings } from "@/app/api-neatpallet";
import { devuelveBasePath, getAccessToken } from "@/app/utility/Utils";

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

export const crearEnvioSensorEmpresaDesdetipoSensor = async (empresaId, usuarioCreacion) => {
    const basePath = devuelveBasePath();
    const token = getAccessToken();
    const response = await fetch(`${basePath}/crear-envio-sensor-empresa-desde-tipo-sensor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ empresaId, usuarioCreacion })
    });
    if (!response.ok) throw new Error('Error al crear sensores desde tipo sensor');
}
