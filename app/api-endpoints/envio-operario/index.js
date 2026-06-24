import axios from "axios";
import { settings } from "@/app/api-neatpallet";

const baseURL = settings.basePath;

export const getEnvioOperario = async (filtro) => {
    const { data } = await axios.get(`${baseURL}/envio-operarios`, {
        params: filtro ? { filter: filtro } : {},
    });
    return data;
}

export const getEnvioOperarioCount = async (filtro) => {
    const { data } = await axios.get(`${baseURL}/envio-operarios/count`, {
        params: filtro ? { where: filtro } : {},
    });
    return data;
}

export const postEnvioOperario = async (objEnvioOperario) => {
    const { data } = await axios.post(`${baseURL}/envio-operarios`, objEnvioOperario);
    return data;
}

export const patchEnvioOperario = async (idEnvioOperario, objEnvioOperario) => {
    const { data } = await axios.patch(`${baseURL}/envio-operarios/${idEnvioOperario}`, objEnvioOperario);
    return data;
}

export const deleteEnvioOperario = async (idEnvioOperario) => {
    const { data } = await axios.delete(`${baseURL}/envio-operarios/${idEnvioOperario}`);
    return data;
}
