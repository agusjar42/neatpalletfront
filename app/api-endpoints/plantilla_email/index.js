import { PlantillaEmailControllerApi, settings } from "@/app/api-neatpallet";

const apiPlantillaEmail = new PlantillaEmailControllerApi(settings)

export const getPlantillaEmails = async (filtro) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerFind(filtro)
    return dataPlantillaEmail
}

export const getPlantillaEmailsCount = async (filtro) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerCount(filtro)
    return dataPlantillaEmail
}

export const postEnviarQR = async (url, objPlantillaEmail) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerEnviarQR(url, objPlantillaEmail)
    return dataPlantillaEmail
}

export const postEnviarEmails = async (plantillaEmailId, emails) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerEnviarEmails(plantillaEmailId, {emails: emails})
    return dataPlantillaEmail
}

export const postPlantillaEmail = async (objPlantillaEmail) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerCreate(objPlantillaEmail)
    return dataPlantillaEmail
}

export const patchPlantillaEmail = async (idPlantillaEmail, objPlantillaEmail) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerUpdateById(idPlantillaEmail, objPlantillaEmail)
    return dataPlantillaEmail
}

export const deletePlantillaEmail = async (idPlantillaEmail) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerDeleteById(idPlantillaEmail)
    return dataPlantillaEmail
}

export const getVistaPlantillaEmailIdioma = async (filtrar) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerVistaPlantillaEmailIdioma(filtrar)
    return dataPlantillaEmail
}

export const getVistaPlantillaEmailIdiomaCount = async (filtrar) => {
    const { data: dataPlantillaEmail } = await apiPlantillaEmail.plantillaEmailControllerVistaPlantillaEmailIdiomaCount(filtrar)
    return dataPlantillaEmail
}