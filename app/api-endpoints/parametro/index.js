import { ParametroControllerApi, settings } from "@/app/api-neatpallet";

const apiParametro = new ParametroControllerApi(settings)

export const getParametro = async (filtro) => {
    const { data: dataParametros } = await apiParametro.parametroControllerFind(filtro)
    return dataParametros
}

export const postParametro = async (objParametro) => {
    const { data: dataParametro } = await apiParametro.parametroControllerCreate(objParametro)
    return dataParametro
}

export const patchParametro = async (idParametro, objParametro) => {
    const { data: dataParametro } = await apiParametro.parametroControllerUpdateById(idParametro, objParametro)   
    return dataParametro
}

export const deleteParametro = async (idParametro) => {
    const { data: dataParametro } = await apiParametro.parametroControllerDeleteById(idParametro)
    return dataParametro
}

export const getParametroCount = async (filtros) => {
    try {
        const { data: dataParametro } = await apiParametro.parametroControllerCount(filtros)
        return dataParametro   
    } catch (error) {
        console.log(error)
    }
}