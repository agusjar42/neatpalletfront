// NOTA: Los endpoints de LugarParada aún no están implementados en el backend
// Estos son endpoints de ejemplo hasta que se implemente el LugarParadaControllerApi

export const getLugarParada = async (filtro) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    // Datos de ejemplo para desarrollo
    return [
        {
            id: 1,
            nombre: "Almacén Central",
            direccion: "Calle Principal 123, Madrid", 
            direccionGps: "40.4168,-3.7038",
            clienteId: 1,
            clienteNombre: "Cliente Ejemplo 1"
        },
        {
            id: 2,
            nombre: "Centro de Distribución Norte", 
            direccion: "Polígono Industrial Norte, Nave 15",
            direccionGps: "40.5000,-3.6000",
            clienteId: 1,
            clienteNombre: "Cliente Ejemplo 1"
        }
    ];
}

export const getLugarParadaCount = async (filtro) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    return { count: 2 };
}

export const postLugarParada = async (objLugarParada) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    return { 
        ...objLugarParada, 
        id: Math.floor(Math.random() * 1000) + 3,
        fechaCreacion: new Date().toISOString(),
        clienteNombre: "Cliente Ejemplo"
    };
}

export const patchLugarParada = async (idLugarParada, objLugarParada) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    return { 
        ...objLugarParada, 
        id: idLugarParada,
        fechaModificacion: new Date().toISOString(),
        clienteNombre: "Cliente Ejemplo"
    };
}

export const deleteLugarParada = async (idLugarParada) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    return { success: true, id: idLugarParada };
}

export const getLugarParadaById = async (idLugarParada) => {
    console.warn('LugarParadaControllerApi no implementado aún');
    return {
        id: idLugarParada,
        nombre: `Lugar Parada ${idLugarParada}`,
        direccion: "Dirección ejemplo",
        direccionGps: "40.4168,-3.7038",
        clienteId: 1,
        clienteNombre: "Cliente Ejemplo"
    };
}