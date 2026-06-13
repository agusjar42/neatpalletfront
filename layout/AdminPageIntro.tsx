"use client";

import { usePathname } from "next/navigation";

type SummaryItem = {
    label: string;
    value: string;
    detail?: string;
    tone?: "neutral" | "success";
};

type PageMeta = {
    title: string;
    eyebrow: string;
    description: string;
    summary?: SummaryItem[];
};

const defaultSummary = (module: string, scope = "Gestión diaria"): SummaryItem[] => [
    { label: "Módulo", value: module },
    { label: "Uso", value: scope },
    { label: "Estado", value: "Operativo" },
];

const pageMeta: Record<string, PageMeta> = {
    "/tablas-maestras/empresa": {
        title: "Empresas",
        eyebrow: "Sistema",
        description: "Administra las empresas dadas de alta, su imagen corporativa y los datos principales de contacto.",
        summary: defaultSummary("Empresas", "Administración"),
    },
    "/tablas-maestras/rol": {
        title: "Roles",
        eyebrow: "Sistema",
        description: "Define qué puede ver y hacer cada perfil, y la pantalla en la que aterriza al iniciar sesión.",
        summary: [
            { label: "Roles totales", value: "9", detail: "7 pantallas distintas" },
            { label: "Activos", value: "8", detail: "disponibles para asignar", tone: "success" },
            { label: "Inactivos", value: "1", detail: "ocultos al asignar usuarios" },
        ],
    },
    "/tablas-maestras/permiso": {
        title: "Permisos",
        eyebrow: "Sistema",
        description: "Configura qué acciones puede ejecutar cada rol en los módulos de la plataforma.",
        summary: defaultSummary("Matriz de permisos", "Seguridad"),
    },
    "/usuarios": {
        title: "Usuarios",
        eyebrow: "Sistema",
        description: "Gestiona usuarios, credenciales, roles y acceso a la plataforma NEAT.",
        summary: defaultSummary("Usuarios", "Accesos"),
    },
    "/cliente": {
        title: "Clientes",
        eyebrow: "Operaciones",
        description: "Empresas cliente que utilizan la plataforma NEAT. Gestiona ficha, contacto y relación operativa.",
        summary: defaultSummary("Clientes", "Operaciones"),
    },
    "/producto": {
        title: "Productos",
        eyebrow: "Operaciones",
        description: "Mantén el catálogo de productos usados en envíos, pallets y operaciones logísticas.",
        summary: defaultSummary("Catálogo", "Operaciones"),
    },
    "/operario": {
        title: "Operarios",
        eyebrow: "Operaciones",
        description: "Administra los operarios vinculados a la empresa y su información de contacto.",
        summary: defaultSummary("Equipo", "Operaciones"),
    },
    "/lugar-parada": {
        title: "Lugares de parada",
        eyebrow: "Operaciones",
        description: "Gestiona puntos de parada, ubicaciones y referencias utilizadas en rutas y envíos.",
        summary: defaultSummary("Ubicaciones", "Rutas"),
    },
    "/envio": {
        title: "Envíos",
        eyebrow: "Operaciones",
        description: "Consulta y gestiona los envíos, su trazabilidad y la información logística asociada.",
        summary: defaultSummary("Envíos", "Trazabilidad"),
    },
    "/envio-configuracion": {
        title: "Configuración de envíos",
        eyebrow: "Operaciones",
        description: "Define parámetros generales para la gestión y seguimiento de envíos.",
        summary: defaultSummary("Configuración", "Envíos"),
    },
    "/envio-configuracion-empresa": {
        title: "Configuraciones de empresa",
        eyebrow: "Operaciones",
        description: "Ajusta la configuración de envíos específica para cada empresa.",
        summary: defaultSummary("Empresa", "Configuración"),
    },
    "/envio-contenido": {
        title: "Informes de contenido",
        eyebrow: "Informes",
        description: "Revisa el contenido asociado a los envíos y su detalle operativo.",
        summary: defaultSummary("Contenido", "Informes"),
    },
    "/envio-movimiento": {
        title: "Informes de movimientos",
        eyebrow: "Informes",
        description: "Consulta movimientos registrados durante la operativa y trazabilidad de envíos.",
        summary: defaultSummary("Movimientos", "Informes"),
    },
    "/envio-pallet": {
        title: "Informes de pallets",
        eyebrow: "Informes",
        description: "Controla la relación entre envíos y pallets utilizados en cada operación.",
        summary: defaultSummary("Pallets", "Informes"),
    },
    "/envio-parada": {
        title: "Paradas de envío",
        eyebrow: "Operaciones",
        description: "Gestiona las paradas vinculadas a cada envío y su secuencia logística.",
        summary: defaultSummary("Paradas", "Rutas"),
    },
    "/envio-sensor": {
        title: "Sensores de envío",
        eyebrow: "Sensores",
        description: "Consulta sensores asignados a envíos y sus referencias de trazabilidad.",
        summary: defaultSummary("Sensores", "Trazabilidad"),
    },
    "/envio-sensor-empresa": {
        title: "Sensores de empresa",
        eyebrow: "Sensores",
        description: "Administra sensores disponibles por empresa para seguimiento y control.",
        summary: defaultSummary("Sensores", "Empresa"),
    },
    "/eventos-configuracion": {
        title: "Eventos de configuración",
        eyebrow: "Sistema",
        description: "Configura eventos y reglas que intervienen en los procesos de seguimiento.",
        summary: defaultSummary("Eventos", "Automatización"),
    },
    "/pallet": {
        title: "Stock global de pallets",
        eyebrow: "Sistema",
        description: "Consulta y administra el inventario global de pallets y sus datos asociados.",
        summary: defaultSummary("Pallets", "Inventario"),
    },
    "/pallet-parametro": {
        title: "Parámetros de pallet",
        eyebrow: "Sistema",
        description: "Define parámetros técnicos y operativos asociados a los pallets.",
        summary: defaultSummary("Parámetros", "Pallets"),
    },
    "/parametro": {
        title: "Parámetros permitidos de pallet",
        eyebrow: "Sistema",
        description: "Controla los valores permitidos y reglas aplicables a la configuración de pallets.",
        summary: defaultSummary("Parámetros", "Validación"),
    },
    "/tipo-carroceria": {
        title: "Tipos de carrocería",
        eyebrow: "Maestros",
        description: "Mantén los tipos de carrocería usados en transporte y planificación logística.",
        summary: defaultSummary("Catálogo", "Transporte"),
    },
    "/tipo-sensor": {
        title: "Tipos de sensor",
        eyebrow: "Maestros",
        description: "Administra los tipos de sensor disponibles para seguimiento y medición.",
        summary: defaultSummary("Catálogo", "Sensores"),
    },
    "/tipo-transporte": {
        title: "Tipos de transporte",
        eyebrow: "Maestros",
        description: "Gestiona las modalidades de transporte utilizadas en envíos.",
        summary: defaultSummary("Catálogo", "Transporte"),
    },
    "/tablas-maestras/idioma": {
        title: "Idiomas",
        eyebrow: "Sistema",
        description: "Gestiona idiomas disponibles, códigos ISO y estado de activación.",
        summary: defaultSummary("Internacionalización", "Sistema"),
    },
    "/tablas-maestras/pais": {
        title: "Países",
        eyebrow: "Maestros",
        description: "Mantén el catálogo de países disponible para direcciones y operaciones.",
        summary: defaultSummary("Catálogo", "Geografía"),
    },
    "/tablas-maestras/traduccion": {
        title: "Traducciones",
        eyebrow: "Sistema",
        description: "Administra textos traducidos y claves de interfaz para la plataforma.",
        summary: defaultSummary("Contenido", "Idiomas"),
    },
    "/tablas-maestras/log_usuario": {
        title: "Logs de usuario",
        eyebrow: "Auditoría",
        description: "Consulta actividad registrada por usuarios dentro de la aplicación.",
        summary: defaultSummary("Auditoría", "Sistema"),
    },
    "/logs-incorrectos": {
        title: "Logs incorrectos",
        eyebrow: "Auditoría",
        description: "Revisa registros con errores o incidencias para diagnóstico operativo.",
        summary: defaultSummary("Incidencias", "Auditoría"),
    },
    "/tablas-maestras/pallets-asignados": {
        title: "Pallets asignados",
        eyebrow: "Sistema",
        description: "Consulta y ajusta la asignación de pallets a empresas y operaciones.",
        summary: defaultSummary("Asignaciones", "Pallets"),
    },
    "/resumen-envio": {
        title: "Resumen de envío",
        eyebrow: "Resumen",
        description: "Vista consolidada de los datos principales de envíos y su estado.",
        summary: defaultSummary("Resumen", "Envíos"),
    },
    "/resumen-envio-pallet": {
        title: "Resumen de envío pallet",
        eyebrow: "Resumen",
        description: "Vista consolidada de pallets asociados a envíos y su información relevante.",
        summary: defaultSummary("Resumen", "Pallets"),
    },
    "/seguimiento-rutas": {
        title: "Seguimiento de rutas",
        eyebrow: "Operaciones",
        description: "Visualiza rutas planificadas y reales para controlar la trazabilidad logística.",
        summary: defaultSummary("Rutas", "Seguimiento"),
    },
};

const normalizePath = (path: string) => {
    const normalized = path.split("?")[0].replace(/\/+$/, "");
    return normalized || "/";
};

const findMeta = (pathname: string) => {
    const normalized = normalizePath(pathname);

    if (pageMeta[normalized]) return pageMeta[normalized];

    const parentPath = Object.keys(pageMeta)
        .sort((a, b) => b.length - a.length)
        .find((path) => normalized.startsWith(`${path}/`));

    return parentPath ? pageMeta[parentPath] : null;
};

const AdminPageIntro = () => {
    const pathname = usePathname();
    const meta = findMeta(pathname);

    if (!meta) return null;

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>{meta.title}</h1>
                <p>{meta.description}</p>
            </div>

            {meta.summary && meta.summary.length > 0 && (
                <div className="neat-page-summary" aria-label="Resumen de pantalla">
                    {meta.summary.map((item) => (
                        <div className={`neat-summary-item ${item.tone === "success" ? "neat-summary-success" : ""}`} key={`${item.label}-${item.value}`}>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                            {item.detail && <small>{item.detail}</small>}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default AdminPageIntro;
