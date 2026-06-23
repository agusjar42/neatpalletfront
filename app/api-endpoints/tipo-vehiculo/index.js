import { TipoVehiculoControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoVehiculo = new TipoVehiculoControllerApi(settings);

export const getTipoVehiculo = async (filtro) => {
    const { data: dataTipoVehiculos } = await apiTipoVehiculo.tipoVehiculoControllerFind(filtro);
    return dataTipoVehiculos;
};

export const getTipoVehiculoCount = async (filtros) => {
    const { data: dataTipoVehiculo } = await apiTipoVehiculo.tipoVehiculoControllerCount(filtros);
    return dataTipoVehiculo;
};

export const postTipoVehiculo = async (objTipoVehiculo) => {
    const { data: dataTipoVehiculo } = await apiTipoVehiculo.tipoVehiculoControllerCreate(objTipoVehiculo);
    return dataTipoVehiculo;
};

export const patchTipoVehiculo = async (idTipoVehiculo, objTipoVehiculo) => {
    const { data: dataTipoVehiculo } = await apiTipoVehiculo.tipoVehiculoControllerUpdateById(idTipoVehiculo, objTipoVehiculo);
    return dataTipoVehiculo;
};

export const deleteTipoVehiculo = async (idTipoVehiculo) => {
    const { data: dataTipoVehiculo } = await apiTipoVehiculo.tipoVehiculoControllerDeleteById(idTipoVehiculo);
    return dataTipoVehiculo;
};
