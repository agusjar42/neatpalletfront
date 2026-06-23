import { TipoCategoriaControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoCategoria = new TipoCategoriaControllerApi(settings);

export const getTipoCategoria = async (filtro) => {
    const { data: dataTipoCategorias } = await apiTipoCategoria.tipoCategoriaControllerFind(filtro);
    return dataTipoCategorias;
};

export const getTipoCategoriaCount = async (filtros) => {
    const { data: dataTipoCategoria } = await apiTipoCategoria.tipoCategoriaControllerCount(filtros);
    return dataTipoCategoria;
};

export const postTipoCategoria = async (objTipoCategoria) => {
    const { data: dataTipoCategoria } = await apiTipoCategoria.tipoCategoriaControllerCreate(objTipoCategoria);
    return dataTipoCategoria;
};

export const patchTipoCategoria = async (idTipoCategoria, objTipoCategoria) => {
    const { data: dataTipoCategoria } = await apiTipoCategoria.tipoCategoriaControllerUpdateById(idTipoCategoria, objTipoCategoria);
    return dataTipoCategoria;
};

export const deleteTipoCategoria = async (idTipoCategoria) => {
    const { data: dataTipoCategoria } = await apiTipoCategoria.tipoCategoriaControllerDeleteById(idTipoCategoria);
    return dataTipoCategoria;
};
