import { IdiomaControllerApi, TraduccionControllerApi, settings } from "@/app/api-neatpallet";

const apiIdioma = new IdiomaControllerApi(settings)
const apiTraduccion = new TraduccionControllerApi(settings)

export const getIdiomas = async (filtro) => {
    const { data: dataIdiomas } = await apiIdioma.idiomaControllerFind(filtro)
    return dataIdiomas
}
export const getIdiomasCount = async (filtro) => {
    const { data: dataIdiomas } = await apiIdioma.idiomaControllerCount(filtro)
    return dataIdiomas
}

export const postIdioma = async (objIdioma) => {
    try {
        const { data: dataIdioma } = await apiIdioma.idiomaControllerCreate(objIdioma)
        return dataIdioma

    } catch (error) {
        console.log(error)
    }
}

export const patchIdioma = async (idIdioma, objIdioma) => {
    const { data: dataIdioma } = await apiIdioma.idiomaControllerUpdateById(idIdioma, objIdioma)
    return dataIdioma
}

export const deleteIdioma = async (idIdioma) => {
    const { data: dataIdioma } = await apiIdioma.idiomaControllerDeleteById(idIdioma)
    return dataIdioma
}


export const buscarTraduccionExistente = async (idIdioma) => {
    const { data: dataIdioma } = await apiTraduccion.traduccionControllerFind(JSON.stringify(
        { where: { idiomaId: idIdioma } }
    ));
    return dataIdioma;
}
