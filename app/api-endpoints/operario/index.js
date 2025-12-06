import { OperarioControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiOperario = new OperarioControllerApi(settings);

export const getOperario = async (filtro) => {
    const { data: dataOperarios } = await apiOperario.operarioControllerFind(filtro);
    return dataOperarios;
}

export const getOperarioCount = async (filtro) => {
    const { data: dataCount } = await apiOperario.operarioControllerCount(filtro);
    return dataCount;
}

export const postOperario = async (objOperario) => {
    const { data: dataOperario } = await apiOperario.operarioControllerCreate(objOperario);
    return dataOperario;
}

export const patchOperario = async (idOperario, objOperario) => {
    const { data: dataOperario } = await apiOperario.operarioControllerUpdateById(idOperario, objOperario);   
    return dataOperario;
}

export const deleteOperario = async (idOperario) => {
    const { data: dataOperario } = await apiOperario.operarioControllerDeleteById(idOperario);
    return dataOperario;
}

export const getOperarioById = async (idOperario) => {
    const { data: dataOperario } = await apiOperario.operarioControllerFindById(idOperario);
    return dataOperario;
}