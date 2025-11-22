import { EnvioControllerApi, EnvioFakeDataControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiEnvio = new EnvioControllerApi(settings);
const apiEnvioFakeData = new EnvioFakeDataControllerApi(settings);

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
    const { data: dataEnvio } = await apiEnvioFakeData.envioFakeDataControllerBorrarEnvioCascada(idEnvio);
    return dataEnvio;
    /*const { data: dataEnvio } = await apiEnvio.envioControllerDeleteById(idEnvio);
    return dataEnvio;*/
}

export const crearEnvioConfiguracionDesdeEmpresa = async (envioId) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerCrearEnvioConfiguracionDesdeEmpresa(envioId);
    return dataEnvio;
}

export const crearEnvioSensorDesdeEmpresa = async (envioId) => {
    const { data: dataEnvio } = await apiEnvio.envioControllerCrearEnvioSensorDesdeEmpresa(envioId);
    return dataEnvio;
}

export const generarDatosFake = async (usuarioId, empresaId) => {
    const { data: dataEnvio } = await apiEnvioFakeData.envioFakeDataControllerGenerarDatosFake(usuarioId, empresaId);
    return dataEnvio;
}

export const getResumenEnvio = async (idEnvio) => {
    const { data: dataResumenEnvio } = await apiEnvio.envioControllerResumenEnvio(idEnvio);
    return dataResumenEnvio;
}

export const getResumenEnvioCount = async (idEnvio) => {
    const { data: dataResumenEnvioContador } = await apiEnvio.envioControllerResumenEnvioCount(idEnvio);
    return dataResumenEnvioContador;
}

export const getResumenEnvioPallet = async (idPallet) => {
    const { data: dataResumenEnvioPallet } = await apiEnvio.envioControllerResumenEnvioPallet(idPallet);
    return dataResumenEnvioPallet;
}

export const getResumenEnvioPalletCount = async (idPallet) => {
    const { data: dataResumenEnvioPalletContador } = await apiEnvio.envioControllerResumenEnvioPalletCount(idPallet);
    return dataResumenEnvioPalletContador;
}