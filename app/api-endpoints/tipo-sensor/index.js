import { TipoSensorControllerApi, settings } from "@/app/api-neatpallet";

const apiTipoSensor = new TipoSensorControllerApi(settings)

export const getTipoSensor = async (filtro) => {
    const { data: dataTipoSensors } = await apiTipoSensor.tipoSensorControllerFind(filtro)
    return dataTipoSensors
}

export const postTipoSensor = async (objTipoSensor) => {
    const { data: dataTipoSensor } = await apiTipoSensor.tipoSensorControllerCreate(objTipoSensor)
    return dataTipoSensor
}

export const patchTipoSensor = async (idTipoSensor, objTipoSensor) => {
    const { data: dataTipoSensor } = await apiTipoSensor.tipoSensorControllerUpdateById(idTipoSensor, objTipoSensor)   
    return dataTipoSensor
}

export const deleteTipoSensor = async (idTipoSensor) => {
    const { data: dataTipoSensor } = await apiTipoSensor.tipoSensorControllerDeleteById(idTipoSensor)
    return dataTipoSensor
}

export const getTipoSensorCount = async (filtros) => {
    try {
        const { data: dataTipoSensor } = await apiTipoSensor.tipoSensorControllerCount(filtros)
        return dataTipoSensor   
    } catch (error) {
        console.log(error)
    }
}
