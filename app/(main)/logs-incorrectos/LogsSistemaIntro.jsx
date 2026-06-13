"use client";

const formatearTamano = (bytes = 0) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const esLoginFallido = (archivo) => {
    const texto = `${archivo?.tipo ?? ""} ${archivo?.nombre ?? ""}`.toLowerCase();
    return texto.includes("login") || texto.includes("fallido") || texto.includes("incorrecto");
};

const LogsSistemaIntro = ({ archivos = [] }) => {
    const totalBytes = archivos.reduce((total, archivo) => total + Number(archivo?.tamaño ?? archivo?.tamano ?? 0), 0);
    const loginFallidos = archivos.filter(esLoginFallido);
    const apiRequests = archivos.filter((archivo) => !esLoginFallido(archivo));
    const apiBytes = apiRequests.reduce((total, archivo) => total + Number(archivo?.tamaño ?? archivo?.tamano ?? 0), 0);
    const loginBytes = loginFallidos.reduce((total, archivo) => total + Number(archivo?.tamaño ?? archivo?.tamano ?? 0), 0);

    return (
        <>
            <div className="neat-info-panel">
                <span className="neat-info-icon pi pi-info-circle" aria-hidden="true"></span>
                <span>
                    Aquí se pueden visualizar y gestionar los archivos de logs del sistema. Se incluyen logs de intentos de login fallidos y logs de todas las peticiones a la API. Cada archivo contiene los registros de un mes específico.
                </span>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de logs del sistema">
                <div className="neat-summary-item">
                    <span>Total archivos</span>
                    <strong>{archivos.length}</strong>
                </div>
                <div className="neat-summary-item">
                    <span>Espacio total</span>
                    <strong>{formatearTamano(totalBytes)}</strong>
                </div>
                <div className="neat-summary-item">
                    <span className="neat-dot-label neat-dot-blue">API requests</span>
                    <strong>{apiRequests.length} <small>archivos</small></strong>
                    <small>{formatearTamano(apiBytes)}</small>
                </div>
                <div className="neat-summary-item">
                    <span className="neat-dot-label neat-dot-red">Login fallidos</span>
                    <strong>{loginFallidos.length} <small>archivos</small></strong>
                    <small>{formatearTamano(loginBytes)}</small>
                </div>
            </div>
        </>
    );
};

export default LogsSistemaIntro;
