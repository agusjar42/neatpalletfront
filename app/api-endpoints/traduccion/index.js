import { TraduccionControllerApi, IdiomaControllerApi, settings } from "@/app/api-neatpallet";

const apiTraduccion = new TraduccionControllerApi(settings)
const apiIdioma = new IdiomaControllerApi(settings)

export const getTraducciones = async () => {
    const { data: dataTraducciones } = await apiTraduccion.traduccionControllerFind()
    return dataTraducciones
}

export const postTraduccion = async (objTraduccion) => {
    const { data: dataTraduccion } = await apiTraduccion.traduccionControllerCreate(objTraduccion)
    return dataTraduccion
}

export const patchTraduccion = async (idTraduccion, objTraduccion) => {
    const { data: dataTraduccion } = await apiTraduccion.traduccionControllerUpdateById(idTraduccion, objTraduccion)
    return dataTraduccion
}

export const deleteTraduccion = async (idTraduccion) => {
    const { data: dataTraduccion } = await apiTraduccion.traduccionControllerDeleteById(idTraduccion)
    return dataTraduccion
}

export const getVistaTraduccionIdioma = async (filtrar) => {
    const { data: dataTraducciones } = await apiTraduccion.traduccionControllerVistaTraduccionIdioma(filtrar)
    return dataTraducciones
}

export const getVistaTraduccionIdiomaCount = async (filtrar) => {
    const { data: dataTraducciones } = await apiTraduccion.traduccionControllerVistaTraduccionIdiomaCount(filtrar)
    return dataTraducciones
}

export const buscaTraduccion = async (iso) => {
    try {
        const { data: dataTraduccion } = await apiTraduccion.traduccionControllerBuscarTraduccion(iso);
        const newLanguageObj = {}; // {"Announcements": "Comunicados"}
        
        dataTraduccion?.forEach(traduccion => {
            if (traduccion?.valor?.length) {
                newLanguageObj[`${traduccion.clave}`] = traduccion.valor;
            }
        });

        return newLanguageObj;
    } catch (error) {
        console.log(error);
    }
};

export const getIdiomas = async () => {
    const { data: dataTraducciones } = await apiIdioma.idiomaControllerFind()
    return dataTraducciones
}

export const crearVistaTraduccionesDinamica = async () => {
    try {
        // Obtener todos los idiomas activos
        const idiomas = await getIdiomas();
        
        // Crear la consulta dinámica
        let query = `
            CREATE OR REPLACE VIEW vista_traducciones_dinamica AS
            SELECT 
                t.clave,
                ${idiomas.map(idioma => `
                    MAX(CASE WHEN t.idiomaId = ${idioma.id} THEN t.valor END) as ${idioma.iso.toLowerCase()}
                `).join(',\n')}
            FROM traduccion t
            GROUP BY t.clave
        `;

        // Ejecutar la consulta
        const { data } = await apiTraduccion.traduccionControllerExecuteQuery(query);
        return data;
    } catch (error) {
        console.error('Error al crear la vista dinámica:', error);
        throw error;
    }
}

export const getVistaTraduccionesDinamica = async (filtro) => {
    try {
        const { data } = await apiTraduccion.traduccionControllerVistaTraduccionesDinamica(filtro);
        return data;
    } catch (error) {
        console.error('Error al obtener la vista dinámica:', error);
        throw error;
    }
}