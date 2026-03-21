import { EmpresaPalletControllerApi, settings } from "@/app/api-neatpallet";

const apiEmpresaPallet = new EmpresaPalletControllerApi(settings);

export const getEmpresaPallet = async (filtro) => {
    const { data: dataEmpresaPallet } = await apiEmpresaPallet.empresaPalletControllerFind(filtro);
    return dataEmpresaPallet;
};

export const getEmpresaPalletCount = async (where) => {
    const { data: dataEmpresaPallet } = await apiEmpresaPallet.empresaPalletControllerCount(where);
    return dataEmpresaPallet;
};

export const postEmpresaPallet = async (objEmpresaPallet) => {
    const { data: dataEmpresaPallet } = await apiEmpresaPallet.empresaPalletControllerCreate(objEmpresaPallet);
    return dataEmpresaPallet;
};

export const deleteEmpresaPallet = async (idEmpresaPallet) => {
    const { data: dataEmpresaPallet } = await apiEmpresaPallet.empresaPalletControllerDeleteById(idEmpresaPallet);
    return dataEmpresaPallet;
};
