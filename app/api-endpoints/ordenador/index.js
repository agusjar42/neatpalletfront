import { OrdenadorControllerApi, settings } from "@/app/api-neatpallet";

const apiOrdenador = new OrdenadorControllerApi(settings)


export const getOrdenadores = async () => {
    const { data: dataOrdenadors } = await apiOrdenador.ordenadorControllerFind()
    return dataOrdenadors
}

export const getVistaOrdenadorTeclado = async () => {
    const { data: dataOrdenadorTeclados } = await apiOrdenador.ordenadorControllerVistaOrdenadorTeclado()
    return dataOrdenadorTeclados
}

export const postOrdenador = async (objOrdenador) => {
    const { data: dataOrdenador } = await apiOrdenador.ordenadorControllerCreate(objOrdenador)
    return dataOrdenador
}

export const patchOrdenador = async (idOrdenador, objOrdenador) => {
    const { data: dataOrdenador } = await apiOrdenador.ordenadorControllerUpdateById(idOrdenador, objOrdenador)
    return dataOrdenador

}

export const deleteOrdenador = async (idOrdenador) => {
    const { data: dataOrdenador } = await apiOrdenador.ordenadorControllerDeleteById(idOrdenador)
    return dataOrdenador
}




