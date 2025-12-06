import { ClienteControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiCliente = new ClienteControllerApi(settings);

export const getCliente = async (filtro) => {
    const { data: dataClientes } = await apiCliente.clienteControllerFind(filtro);
    return dataClientes;
}

export const getClienteCount = async (filtro) => {
    const { data: dataCount } = await apiCliente.clienteControllerCount(filtro);
    return dataCount;
}

export const postCliente = async (objCliente) => {
    const { data: dataCliente } = await apiCliente.clienteControllerCreate(objCliente);
    return dataCliente;
}

export const patchCliente = async (idCliente, objCliente) => {
    const { data: dataCliente } = await apiCliente.clienteControllerUpdateById(idCliente, objCliente);   
    return dataCliente;
}

export const deleteCliente = async (idCliente) => {
    const { data: dataCliente } = await apiCliente.clienteControllerDeleteById(idCliente);
    return dataCliente;
}

export const getClienteById = async (idCliente) => {
    const { data: dataCliente } = await apiCliente.clienteControllerFindById(idCliente);
    return dataCliente;
}