import { settings, ListaPermisosControllerApi } from "@/app/api-neatpallet";

const apiListaPermisos = new ListaPermisosControllerApi(settings)
export const getListaPermisos = async () => {
    const { data: dataPermisos } = await apiListaPermisos.listaPermisosControllerFind()
    return dataPermisos
}