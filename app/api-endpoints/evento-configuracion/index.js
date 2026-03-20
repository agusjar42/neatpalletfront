import axios from "axios";
import { devuelveBasePath } from "@/app/utility/Utils";

const getBaseUrl = () => `${devuelveBasePath()}/evento-configuraciones`;
const getAuthHeaders = () => {
    if (typeof window === "undefined") {
        return {};
    }
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEventoConfiguracion = async (filtro) => {
    const { data } = await axios.get(getBaseUrl(), {
        headers: getAuthHeaders(),
        params: filtro ? { filter: filtro } : {}
    });
    return data;
};

export const getEventoConfiguracionCount = async (filtros) => {
    const { data } = await axios.get(`${getBaseUrl()}/count`, {
        headers: getAuthHeaders(),
        params: filtros ? { where: filtros } : {}
    });
    return data;
};

export const postEventoConfiguracion = async (objEventoConfiguracion) => {
    const { data } = await axios.post(getBaseUrl(), objEventoConfiguracion, {
        headers: getAuthHeaders(),
    });
    return data;
};

export const patchEventoConfiguracion = async (idEventoConfiguracion, objEventoConfiguracion) => {
    const { data } = await axios.patch(`${getBaseUrl()}/${idEventoConfiguracion}`, objEventoConfiguracion, {
        headers: getAuthHeaders(),
    });
    return data;
};

export const deleteEventoConfiguracion = async (idEventoConfiguracion) => {
    const { data } = await axios.delete(`${getBaseUrl()}/${idEventoConfiguracion}`, {
        headers: getAuthHeaders(),
    });
    return data;
};
