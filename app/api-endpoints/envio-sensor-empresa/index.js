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

export const getSensorEmpresa = async (filtro) => {
    return await fetchJson('/sensor-empresas', { queryParams: { filter: filtro } });
};

export const postSensorEmpresa = async (objSensorEmpresa) => {
    return await fetchJson('/sensor-empresas', { method: 'POST', body: objSensorEmpresa });
};

export const patchSensorEmpresa = async (idSensorEmpresa, objSensorEmpresa) => {
    return await fetchJson(`/sensor-empresas/${idSensorEmpresa}`, { method: 'PATCH', body: objSensorEmpresa });
};

export const deleteSensorEmpresa = async (idSensorEmpresa) => {
    return await fetchJson(`/sensor-empresas/${idSensorEmpresa}`, { method: 'DELETE' });
};

export const getSensorEmpresaCount = async (filtros) => {
    return await fetchJson('/sensor-empresas/count', { queryParams: { where: filtros } });
};

export const crearSensorEmpresaDesdeTipoSensor = async (empresaId, usuarioCreacion) => {
    return await fetchJson('/crear-sensor-empresa-desde-tipo-sensor', {
        method: 'POST',
        body: { empresaId, usuarioCreacion }
    });
};

// Compatibilidad temporal mientras se actualizan imports restantes
export const getEnvioSensorEmpresa = getSensorEmpresa;
export const postEnvioSensorEmpresa = postSensorEmpresa;
export const patchEnvioSensorEmpresa = patchSensorEmpresa;
export const deleteEnvioSensorEmpresa = deleteSensorEmpresa;
export const getEnvioSensorEmpresaCount = getSensorEmpresaCount;
export const crearEnvioSensorEmpresaDesdetipoSensor = crearSensorEmpresaDesdeTipoSensor;
