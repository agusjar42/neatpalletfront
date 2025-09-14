import { EnvioSensorControllerApi, settings } from "@/app/api-neatpallet";

const apiEnvioSensor = new EnvioSensorControllerApi(settings)

export const getEnvioSensor = async (filtro) => {
    const { data: dataEnvioSensors } = await apiEnvioSensor.envioSensorControllerFind(filtro)
    return dataEnvioSensors
}

export const postEnvioSensor = async (objEnvioSensor) => {
    const { data: dataEnvioSensor } = await apiEnvioSensor.envioSensorControllerCreate(objEnvioSensor)
    return dataEnvioSensor
}

export const patchEnvioSensor = async (idEnvioSensor, objEnvioSensor) => {
    const { data: dataEnvioSensor } = await apiEnvioSensor.envioSensorControllerUpdateById(idEnvioSensor, objEnvioSensor)   
    return dataEnvioSensor
}

export const deleteEnvioSensor = async (idEnvioSensor) => {
    const { data: dataEnvioSensor } = await apiEnvioSensor.envioSensorControllerDeleteById(idEnvioSensor)
    return dataEnvioSensor
}

export const getEnvioSensorCount = async (filtros) => {
    try {
        const { data: dataEnvioSensor } = await apiEnvioSensor.envioSensorControllerCount(filtros)
        return dataEnvioSensor   
    } catch (error) {
        console.log(error)
    }
}