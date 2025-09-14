
import { EnvioContenidoControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioContenido = new EnvioContenidoControllerApi(settings)

export const getEnvioContenido = async (filtro) => {
    const { data: dataContenidos } = await apiEnvioContenido.envioContenidoControllerFind(filtro)
    return dataContenidos
}

export const postEnvioContenido = async (objContenido) => {
    const { data: dataContenido } = await apiEnvioContenido.envioContenidoControllerCreate(objContenido)
    return dataContenido
}

export const patchEnvioContenido = async (idContenido, objContenido) => {
    const { data: dataContenido } = await apiEnvioContenido.envioContenidoControllerUpdateById(idContenido, objContenido)
    return dataContenido
}

export const deleteEnvioContenido = async (idContenido) => {
    const { data: dataContenido } = await apiEnvioContenido.envioContenidoControllerDeleteById(idContenido)
    return dataContenido
}

export const getEnvioContenidoCount = async (filtros) => {
    try {
        const { data: dataContenido } = await apiEnvioContenido.envioContenidoControllerCount(filtros)
        return dataContenido   
    } catch (error) {
        console.log(error)
    }
}
