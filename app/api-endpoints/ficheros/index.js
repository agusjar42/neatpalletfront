import { FileUploadControllerApi, settings } from "@/app/api-neatpallet";

const apiFileUpload = new FileUploadControllerApi(settings)

export const postSubirImagen = async (ruta, nombre, imagen) => {
    const { data: dataFichero } = await apiFileUpload.fileUploadControllerImageUpload(ruta, nombre, imagen)
    return dataFichero
}

export const postSubirFichero = async (ruta, nombre, imagen) => {
    const { data: dataFichero } = await apiFileUpload.fileUploadControllerFileUpload(ruta, nombre, imagen)
    return dataFichero
}

export const borrarFichero = async (imagenUrl) => {
    const { data: dataFichero } = await apiFileUpload.fileUploadControllerDeleteFileByName(imagenUrl)
    return dataFichero
}



