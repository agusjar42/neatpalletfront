// NOTA: Los endpoints de Operario aún no están implementados en el backend
// Estos son endpoints de ejemplo hasta que se implemente el OperarioControllerApi

export const getOperario = async (filtro) => {
    console.warn('OperarioControllerApi no implementado aún');
    // Datos de ejemplo para desarrollo
    return [
        {
            id: 1,
            nombre: "Juan Pérez",
            telefono: "123456789", 
            email: "juan@ejemplo.com",
            clienteId: 1,
            clienteNombre: "Cliente Ejemplo 1"
        },
        {
            id: 2,
            nombre: "María García", 
            telefono: "987654321",
            email: "maria@ejemplo.com",
            clienteId: 1,
            clienteNombre: "Cliente Ejemplo 1"
        }
    ];
}

export const getOperarioCount = async (filtro) => {
    console.warn('OperarioControllerApi no implementado aún');
    return { count: 2 };
}

export const postOperario = async (objOperario) => {
    console.warn('OperarioControllerApi no implementado aún');
    return { 
        ...objOperario, 
        id: Math.floor(Math.random() * 1000) + 3,
        fechaCreacion: new Date().toISOString(),
        clienteNombre: "Cliente Ejemplo"
    };
}

export const patchOperario = async (idOperario, objOperario) => {
    console.warn('OperarioControllerApi no implementado aún');
    return { 
        ...objOperario, 
        id: idOperario,
        fechaModificacion: new Date().toISOString(),
        clienteNombre: "Cliente Ejemplo"
    };
}

export const deleteOperario = async (idOperario) => {
    console.warn('OperarioControllerApi no implementado aún');
    return { success: true, id: idOperario };
}

export const getOperarioById = async (idOperario) => {
    console.warn('OperarioControllerApi no implementado aún');
    return {
        id: idOperario,
        nombre: `Operario ${idOperario}`,
        telefono: "123456789",
        email: `operario${idOperario}@ejemplo.com`,
        clienteId: 1,
        clienteNombre: "Cliente Ejemplo"
    };
}