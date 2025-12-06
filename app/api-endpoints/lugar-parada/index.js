import { LugarParadaControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiLugarParada = new LugarParadaControllerApi(settings);

export const getLugarParada = async (filtro) => {
    const { data: dataLugaresParada } = await apiLugarParada.lugarParadaControllerFind(filtro);
    return dataLugaresParada;
}

export const getLugarParadaCount = async (filtro) => {
    const { data: dataCount } = await apiLugarParada.lugarParadaControllerCount(filtro);
    return dataCount;
}

export const postLugarParada = async (objLugarParada) => {
    const { data: dataLugarParada } = await apiLugarParada.lugarParadaControllerCreate(objLugarParada);
    return dataLugarParada;
}

export const patchLugarParada = async (idLugarParada, objLugarParada) => {
    const { data: dataLugarParada } = await apiLugarParada.lugarParadaControllerUpdateById(idLugarParada, objLugarParada);   
    return dataLugarParada;
}

export const deleteLugarParada = async (idLugarParada) => {
    const { data: dataLugarParada } = await apiLugarParada.lugarParadaControllerDeleteById(idLugarParada);
    return dataLugarParada;
}

export const getLugarParadaById = async (idLugarParada) => {
    const { data: dataLugarParada } = await apiLugarParada.lugarParadaControllerFindById(idLugarParada);
    return dataLugarParada;
}