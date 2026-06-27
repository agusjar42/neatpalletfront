import { devuelveBasePath, getAccessToken } from "@/app/utility/Utils";

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAccessToken()}`
});

const buildUrl = (path, queryParams = {}) => {
    const basePath = devuelveBasePath();
    const url = new URL(`${basePath}${path}`);

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
};

const fetchJson = async (path, options = {}) => {
    const response = await fetch(buildUrl(path, options.queryParams), {
        method: options.method || 'GET',
        headers: getAuthHeaders(),
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status} en ${path}`);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

export const getEmpresaSensor = async (filtro) => {
    return await fetchJson('/empresa-sensores', { queryParams: { filter: filtro } });
};

export const postEmpresaSensor = async (objEmpresaSensor) => {
    return await fetchJson('/empresa-sensores', { method: 'POST', body: objEmpresaSensor });
};

export const patchEmpresaSensor = async (idEmpresaSensor, objEmpresaSensor) => {
    return await fetchJson(`/empresa-sensores/${idEmpresaSensor}`, { method: 'PATCH', body: objEmpresaSensor });
};

export const deleteEmpresaSensor = async (idEmpresaSensor) => {
    return await fetchJson(`/empresa-sensores/${idEmpresaSensor}`, { method: 'DELETE' });
};

export const getEmpresaSensorCount = async (filtros) => {
    return await fetchJson('/empresa-sensores/count', { queryParams: { where: filtros } });
};

export const crearEmpresaSensorDesdeTipoSensor = async (empresaId, usuarioCreacion) => {
    return await fetchJson('/crear-empresa-sensor-desde-tipo-sensor', {
        method: 'POST',
        body: { empresaId, usuarioCreacion }
    });
};
