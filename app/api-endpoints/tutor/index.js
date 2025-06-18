import { TutorAlergiaControllerApi, TutorControllerApi, TutorEnfermedadControllerApi, TutorHobbieControllerApi, TutorMascotaControllerApi, settings } from "@/app/api-neatpallet";
const apiTutor = new TutorControllerApi(settings)
const apiTutorAlergia = new TutorAlergiaControllerApi(settings)
const apiTutorMascota = new TutorMascotaControllerApi(settings)
const apiTutorEnfermedad = new TutorEnfermedadControllerApi(settings)
const apiTutorHobbie = new TutorHobbieControllerApi(settings)


export const getTutores = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutor.tutorControllerFind(filtro)
    return dataCentrosEscolares
}

export const getTutoresCount = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutor.tutorControllerCount(filtro)
    return dataCentrosEscolares
}

export const postTutor = async (objTutor) => {
    const { data: dataTutor } = await apiTutor.tutorControllerCreate(objTutor)
    return dataTutor
}

export const patchTutor = async (idTutor, objTutor) => {
    const { data: dataTutor } = await apiTutor.tutorControllerUpdateById(idTutor, objTutor)
    return dataTutor
}

export const deleteTutor = async (idTutor) => {
    const { data: dataTutor } = await apiTutor.tutorControllerDeleteById(idTutor)
    return dataTutor
}

export const getTutorAlergias = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutorAlergia.tutorAlergiaControllerFind(filtro)
    return dataCentrosEscolares
}

export const getTutorMascotas = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutorMascota.tutorMascotaControllerFind(filtro)
    return dataCentrosEscolares
}

export const getTutorHobbies = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutorHobbie.tutorHobbieControllerFind(filtro)
    return dataCentrosEscolares
}

export const getTutorEnfermedades = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutorEnfermedad.tutorEnfermedadControllerFind(filtro)
    return dataCentrosEscolares
}

export const getTutorEnfermedad = async (filtro) => {
    const { data: dataCentrosEscolares } = await apiTutorEnfermedad.tutorEnfermedadControllerFindById(filtro)
    return dataCentrosEscolares
}


export const postTutorAlergia = async (objTutorAlergia) => {
    const { data: dataTutorAlergia } = await apiTutorAlergia.tutorAlergiaControllerCreate(objTutorAlergia)
    return dataTutorAlergia
}

export const postTutorMascota = async (objTutorMascota) => {
    const { data: dataTutorMascota } = await apiTutorMascota.tutorMascotaControllerCreate(objTutorMascota)
    return dataTutorMascota
}

export const postTutorHobbie = async (objTutorHobbie) => {
    const { data: dataTutorHobbie } = await apiTutorHobbie.tutorHobbieControllerCreate(objTutorHobbie)
    return dataTutorHobbie
}

export const postTutorEnfermedad = async (objTutorEnfermedad) => {
    const { data: dataTutorEnfermedad } = await apiTutorEnfermedad.tutorEnfermedadControllerCreate(objTutorEnfermedad)
    return dataTutorEnfermedad
}

export const patchTutorAlergia = async (idTutorAlergia, objTutorAlergia) => {
    const { data: dataTutorAlergia } = await apiTutorAlergia.tutorAlergiaControllerUpdateById(idTutorAlergia, objTutorAlergia)
    return dataTutorAlergia
}

export const patchTutorMascota = async (idTutorMascota, objTutorMascota) => {
    const { data: dataTutorMascota } = await apiTutorMascota.tutorMascotaControllerUpdateById(idTutorMascota, objTutorMascota)
    return dataTutorMascota
}

export const patchTutorHobbie = async (idTutorHobbie, objTutorHobbie) => {
    const { data: dataTutorHobbie } = await apiTutorHobbie.tutorHobbieControllerUpdateById(idTutorHobbie, objTutorHobbie)
    return dataTutorHobbie
}

export const patchTutorEnfermedad = async (idTutorEnfermedad, objTutorEnfermedad) => {
    const { data: dataTutorEnfermedad } = await apiTutorEnfermedad.tutorEnfermedadControllerUpdateById(idTutorEnfermedad, objTutorEnfermedad)
    return dataTutorEnfermedad
}

export const deleteTutorAlergia = async (idTutorAlergia) => {
    const { data: dataTutorAlergia } = await apiTutorAlergia.tutorAlergiaControllerDeleteById(idTutorAlergia)
    return dataTutorAlergia
}

export const deleteTutorMascota = async (idTutorMascota) => {
    const { data: dataTutorMascota } = await apiTutorMascota.tutorMascotaControllerDeleteById(idTutorMascota)
    return dataTutorMascota
}

export const deleteTutorHobbie = async (idTutorHobbie) => {
    const { data: dataTutorHobbie } = await apiTutorHobbie.tutorHobbieControllerDeleteById(idTutorHobbie)
    return dataTutorHobbie
}

export const deleteTutorEnfermedad = async (idTutorEnfermedad) => {
    const { data: dataTutorEnfermedad } = await apiTutorEnfermedad.tutorEnfermedadControllerDeleteById(idTutorEnfermedad)
    return dataTutorEnfermedad
}

