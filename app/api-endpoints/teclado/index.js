import { TecladoControllerApi, EmpresaControllerApi, settings } from "@/app/api-neatpallet";

const apiTeclado = new TecladoControllerApi(settings)


export const getTeclados = async () => {
    const { data: dataTeclados } = await apiTeclado.tecladoControllerFind()
    return dataTeclados
}

export const postTeclado = async (objTeclado) => {
    const { data: dataTeclado } = await apiTeclado.tecladoControllerCreate(objTeclado)
    return dataTeclado
}

export const patchTeclado = async (idTeclado, objTeclado) => {
    try {
        const { data: dataTeclado } = await apiTeclado.tecladoControllerUpdateById(idTeclado, objTeclado)
        return dataTeclado
    } catch (error) {
        console.log(error)
        return false
    }

}

export const deleteTeclado = async (idTeclado) => {
    const { data: dataTeclado } = await apiTeclado.tecladoControllerDeleteById(idTeclado)
    return dataTeclado
}




