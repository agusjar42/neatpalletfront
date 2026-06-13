"use client";

export const tiposLogUsuario = [
    { key: "inicio-sesion", label: "Inicios de sesión", className: "neat-log-type-blue" },
    { key: "acciones-usuario", label: "Acciones de usuario", className: "neat-log-type-green" },
    { key: "auditoria", label: "Auditoría", className: "neat-log-type-purple" },
    { key: "cambios-configuracion", label: "Cambios de configuración", className: "neat-log-type-orange" },
    { key: "sesiones-expiradas", label: "Sesiones expiradas", className: "neat-log-type-red" },
];

const normalizar = (valor = "") =>
    valor
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

export const obtenerTipoLogUsuario = (tipo) => {
    const texto = normalizar(tipo);

    if (texto.includes("inicio") || texto.includes("sesion") || texto.includes("login")) return tiposLogUsuario[0];
    if (texto.includes("accion") || texto.includes("usuario")) return tiposLogUsuario[1];
    if (texto.includes("auditor")) return tiposLogUsuario[2];
    if (texto.includes("configuracion") || texto.includes("cambio")) return tiposLogUsuario[3];
    if (texto.includes("expir")) return tiposLogUsuario[4];

    return { key: "otro", label: tipo || "Sin tipo", className: "neat-log-type-gray" };
};

export const obtenerTextoTipoLogUsuario = (registro) =>
    registro?.tipo ?? registro?.masDatos ?? "";

const obtenerTamano = (registro) =>
    Number(registro?.tamano ?? registro?.tamaño ?? registro?.bytes ?? registro?.size ?? 0);

const formatearTamano = (bytes = 0) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const contarPorTipo = (registros, tipoBuscado) => {
    const registrosTipo = registros.filter((registro) => obtenerTipoLogUsuario(obtenerTextoTipoLogUsuario(registro)).key === tipoBuscado.key);
    const bytes = registrosTipo.reduce((total, registro) => total + obtenerTamano(registro), 0);

    return {
        total: registrosTipo.length,
        bytes,
    };
};

const LogsUsuarioIntro = ({ registros = [] }) => {
    const totalBytes = registros.reduce((total, registro) => total + obtenerTamano(registro), 0);

    return (
        <>
            <div className="neat-info-panel">
                <span className="neat-info-icon pi pi-info-circle" aria-hidden="true"></span>
                <span>
                    Aquí se pueden consultar y gestionar los archivos de logs de actividad de los usuarios. Se incluyen inicios de sesión, acciones realizadas, eventos de auditoría y cambios de configuración. Cada archivo contiene los registros de un mes específico.
                </span>
            </div>

            <div className="neat-page-summary neat-page-summary-logs-usuario" aria-label="Resumen de logs de usuario">
                <div className="neat-summary-item">
                    <span>Total archivos</span>
                    <strong>{registros.length}</strong>
                </div>
                <div className="neat-summary-item">
                    <span>Espacio total</span>
                    <strong>{formatearTamano(totalBytes)}</strong>
                </div>
                {tiposLogUsuario.map((tipo) => {
                    const resumen = contarPorTipo(registros, tipo);

                    return (
                        <div className="neat-summary-item" key={tipo.key}>
                            <span className={`neat-log-type-label ${tipo.className}`}>{tipo.label}</span>
                            <strong>{resumen.total} <small>archivos</small></strong>
                            <small>{formatearTamano(resumen.bytes)}</small>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default LogsUsuarioIntro;
