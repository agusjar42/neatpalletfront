import { PaisControllerApi, settings } from "@/app/api-neatpallet";

const apiPais = new PaisControllerApi(settings)

export const getPaises = async (filtro) => {
    const { data: dataPaises } = await apiPais.paisControllerFind(filtro)
    return dataPaises
}

export const getPaisesCount = async (filtro) => {
    const { data: dataPaises } = await apiPais.paisControllerCount(filtro)
    return dataPaises
}

export const postPais = async (objPais) => {
    try {
        const { data: dataPais } = await apiPais.paisControllerCreate(objPais)
        return dataPais

    } catch (error) {
        console.log(error)
    }
}

export const patchPais = async (idPais, objPais) => {
    try{
        const { data: dataPais } = await apiPais.paisControllerUpdateById(idPais, objPais)
        return dataPais
    }
    catch (error) {
        console.log(error)
    }
}

export const deletePais = async (idPais) => {
    const { data: dataPais } = await apiPais.paisControllerDeleteById(idPais)
    return dataPais
}
