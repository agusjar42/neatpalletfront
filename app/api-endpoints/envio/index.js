import { EnvioControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiEnvio = new EnvioControllerApi(settings);

export const getEnvio = async (filtro) => {
    const { data: dataEnvios } = await apiEnvio.envioControllerFind(filtro);
    return dataEnvios;
}

export const getEnvioCount = async (filtro) => {
    const { data: dataEnvios } = await apiEnvio.envioControllerCount(filtro);
    return dataEnvios;
}

export const postEnvio = async (objEnvio) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerCreate(objEnvio);
    return dataEnvio;
}

export const patchEnvio = async (idEnvio, objEnvio) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerUpdateById(idEnvio, objEnvio);   
    return dataEnvio;
}

export const deleteEnvio = async (idEnvio) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerDeleteById(idEnvio);
    return dataEnvio;
}

export const crearEnvioConfiguracionDesdeEmpresa = async (envioId) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerCrearEnvioConfiguracionDesdeEmpresa(envioId);
    return dataEnvio;
}
