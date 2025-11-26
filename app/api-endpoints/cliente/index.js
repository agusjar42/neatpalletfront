// NOTA: Los endpoints de Cliente aún no están implementados en el backend
// Estos son endpoints de ejemplo hasta que se implemente el ClienteControllerApi

export const getCliente = async (filtro) => {
    console.warn('ClienteControllerApi no implementado aún');
    // Datos de ejemplo para desarrollo
    return [
        {
            id: 1,
            nombre: "Cliente Ejemplo 1",
            telefono: "123456789", 
            mail: "cliente1@ejemplo.com",
            empresaId: 1,
            empresaNombre: "Empresa 1"
        },
        {
            id: 2,
            nombre: "Cliente Ejemplo 2", 
            telefono: "987654321",
            mail: "cliente2@ejemplo.com",
            empresaId: 1,
            empresaNombre: "Empresa 1"
        }
    ];
}

export const getClienteCount = async (filtro) => {
    console.warn('ClienteControllerApi no implementado aún');
    return { count: 2 };
}

export const postCliente = async (objCliente) => {
    console.warn('ClienteControllerApi no implementado aún');
    return { 
        ...objCliente, 
        id: Math.floor(Math.random() * 1000) + 3,
        fechaCreacion: new Date().toISOString(),
        empresaNombre: "Empresa 1"
    };
}

export const patchCliente = async (idCliente, objCliente) => {
    console.warn('ClienteControllerApi no implementado aún');
    return { 
        ...objCliente, 
        id: idCliente,
        fechaModificacion: new Date().toISOString(),
        empresaNombre: "Empresa 1"
    };
}

export const deleteCliente = async (idCliente) => {
    console.warn('ClienteControllerApi no implementado aún');
    return { success: true, id: idCliente };
}

export const getClienteById = async (idCliente) => {
    console.warn('ClienteControllerApi no implementado aún');
    return {
        id: idCliente,
        nombre: `Cliente ${idCliente}`,
        telefono: "123456789",
        mail: `cliente${idCliente}@ejemplo.com`,
        empresaId: 1,
        empresaNombre: "Empresa 1"
    };
}