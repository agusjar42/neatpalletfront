"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { deleteEmpresa, getEmpresas, patchEmpresa } from "@/app/api-endpoints/empresa";
import { getEmpresaPalletCount } from "@/app/api-endpoints/empresa-pallet";
import { deleteUsuario, getVistaUsuarios, getVistaUsuariosCount } from "@/app/api-endpoints/usuario";
import { getUsuarioSesion } from "@/app/utility/Utils";
import Crud from "../../../components/shared/crud";
import { getCliente, getClienteCount, deleteCliente } from "@/app/api-endpoints/cliente";
import { getProducto, getProductoCount, deleteProducto } from "@/app/api-endpoints/empresa-producto";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import { getEnvioSensorEmpresa, getEnvioSensorEmpresaCount, deleteEnvioSensorEmpresa } from "@/app/api-endpoints/empresa-sensor";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/empresa-tipo-carroceria";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/empresa-tipo-transporte";
import { getEventoConfiguracion, getEventoConfiguracionCount } from "@/app/api-endpoints/evento-configuracion";
import EditarUsuario from "../../usuarios/editar";
import EditarCliente from "../../cliente/editar";
import EditarProducto from "../../producto/editar";
import EditarEnvio from "../../envio/editar";
import EditarEnvioSensorEmpresa from "../../envio-sensor-empresa/editar";
import EditarTipoCarroceria from "../../tipo-carroceria/editar";
import EditarTipoTransporte from "../../tipo-transporte/editar";
import PalletsAsignadosEmpresa from "./PalletsAsignadosEmpresa";
import EditarDatosEmpresa from "./EditarDatosEmpresa";

const camposPendientesBack = ["nombreComercial", "estado", "plan"];

const tabs = [
    "Envios",
    "Resumen",
    "Usuarios",
    "Puntos de entrega",
    "Productos",
    "Sensores activos",
    "Pallets asignados",
    "Carrocerias",
    "Tipos de transporte",
    "Configuracion de eventos",
];

const estados = [
    { label: "Activa", value: "Activa", className: "empresa-status-active" },
    { label: "En prueba", value: "En prueba", className: "empresa-status-trial" },
    { label: "Suspendida", value: "Suspendida", className: "empresa-status-suspended" },
];

const planes = [
    { label: "Starter", precio: "€290/mes" },
    { label: "Growth", precio: "€890/mes" },
    { label: "Business", precio: "€2490/mes" },
    { label: "Enterprise", precio: "€6900/mes" },
];

const columnasUsuariosEmpresa = [
    { campo: "nombreRol", header: "Rol", tipo: "string" },
    { campo: "avatar", header: "Avatar", tipo: "imagen" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "mail", header: "Email", tipo: "string" },
    { campo: "telefono", header: "Teléfono", tipo: "string" },
    { campo: "activoSn", header: "Activo", tipo: "booleano" },
];

const columnasPuntosEntrega = [
    { campo: "orden", header: "Orden", tipo: "number" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "telefono", header: "Teléfono", tipo: "string" },
    { campo: "mail", header: "Email", tipo: "string" },
];

const columnasProducto = [
    { campo: "orden", header: "Orden", tipo: "number" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "pesoKgs", header: "Peso (Kg)", tipo: "number" },
    { campo: "activoSN", header: "Activo", tipo: "booleano" },
];

const columnasEnvio = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "numero", header: "Numero", tipo: "string" },
    { campo: "clienteNombre", header: "Punto de entrega", tipo: "string" },
    { campo: "origenRuta", header: "Origen", tipo: "string" },
    { campo: "destinoRuta", header: "Destino", tipo: "string" },
    { campo: "fechaSalidaEspanol", header: "Fecha salida", tipo: "string" },
    { campo: "fechaLlegadaEspanol", header: "Fecha llegada", tipo: "string" },
];

const columnasSensorEmpresa = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Tipo de Sensor", tipo: "string" },
    { campo: "valor", header: "Valor", tipo: "string" },
];

const columnasCatalogosGlobales = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "descripcion", header: "Descripción", tipo: "string" },
    { campo: "activoSN", header: "Activo", tipo: "booleano" },
];

const columnasEventoConfiguracion = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "descripcion", header: "Descripción", tipo: "string" },
    { campo: "valor", header: "Valor", tipo: "string" },
    { campo: "unidadMedida", header: "Unidad", tipo: "string" },
    { campo: "activoSN", header: "Activo", tipo: "booleano" },
];

const normalizarEmpresa = (empresa = {}) => ({
    ...empresa,
    codigo: empresa.codigo ?? `C-${String(empresa.id ?? 1).padStart(3, "0")}`,
    nombreComercial: empresa.nombreComercial ?? empresa.nombre ?? "",
    estado: empresa.estado ?? "Activa",
    plan: empresa.plan ?? "Enterprise",
});

const extraerCount = (valor) => {
    if (typeof valor === "number") return valor;
    if (Array.isArray(valor)) return Number(valor[0]?.count ?? 0);
    return Number(valor?.count ?? 0);
};

const Empresa = () => {
    const [empresaActiva, setEmpresaActiva] = useState(null);
    const [empresaEdicion, setEmpresaEdicion] = useState(null);
    const [metricas, setMetricas] = useState({ pallets: 0, usuarios: 0, eventos24h: 0, enviosEnCurso: 0 });
    const [contactos, setContactos] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [hayEdicionEnPestana, setHayEdicionEnPestana] = useState(false);
    const [tabActiva, setTabActiva] = useState("Resumen");

    const puedeCargarDatosProtegidos = () => {
        if (typeof window === "undefined") {
            return false;
        }
        const isLoggingOut = sessionStorage.getItem("np_logging_out") === "1";
        const hasSession = Boolean(localStorage.getItem("userDataNeatpallet"));
        return !isLoggingOut && hasSession;
    };

    const obtenerContextoSesion = () => {
        if (typeof window === "undefined") {
            return { usuarioAdmin: false, empresaId: null };
        }

        return {
            usuarioAdmin: (JSON.parse(localStorage.getItem("userDataNeatpallet"))?.["usuarioAdmin"] || "N") === "S",
            empresaId: Number(localStorage.getItem("empresa")),
        };
    };

    const cargarEmpresas = async () => {
        if (!puedeCargarDatosProtegidos()) {
            return;
        }
        const { usuarioAdmin, empresaId } = obtenerContextoSesion();
        const where = usuarioAdmin ? { and: {} } : { and: { id: empresaId } };
        const queryParams = {
            limit: 100,
            offset: 0,
            order: "orden ASC",
            where,
        };
        const data = await getEmpresas(JSON.stringify(queryParams));
        const lista = Array.isArray(data) ? data.map(normalizarEmpresa) : [];

        setEmpresaActiva((actual) => lista.find((empresa) => empresa.id === actual?.id) ?? lista[0] ?? null);
    };

    const cargarMetricas = async (empresaId) => {
        if (!puedeCargarDatosProtegidos()) {
            return;
        }
        if (!empresaId) return;

        const whereEmpresa = { and: { empresaId } };
        const whereEnviosCurso = { and: { empresaId } };
        const [pallets, usuarios, envios] = await Promise.all([
            getEmpresaPalletCount(JSON.stringify(whereEmpresa)).catch(() => ({ count: 0 })),
            getVistaUsuariosCount(JSON.stringify(whereEmpresa)).catch(() => ({ count: 0 })),
            getEnvioCount(JSON.stringify(whereEnviosCurso)).catch(() => ({ count: 0 })),
        ]);

        setMetricas({
            pallets: extraerCount(pallets),
            usuarios: extraerCount(usuarios),
            eventos24h: empresaActiva?.eventos24h ?? 0,
            enviosEnCurso: extraerCount(envios),
        });
    };

    const cargarContactos = async (empresaId) => {
        if (!puedeCargarDatosProtegidos()) {
            return;
        }
        if (!empresaId) return;

        const queryParams = {
            limit: 3,
            offset: 0,
            order: "nombre ASC",
            where: {and: {empresaId}},
        };
        const usuarios = await getVistaUsuarios(JSON.stringify(queryParams)).catch(() => []);
        const contactosEmpresa = Array.isArray(usuarios)
            ? usuarios.map((usuario) => ({
                nombre: usuario.nombre || usuario.mail || "Usuario",
                email: usuario.mail || "",
                rol: usuario.nombreRol || "usuario",
            }))
            : [];
        setContactos(contactosEmpresa);
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    useEffect(() => {
        if (empresaActiva?.id) {
            cargarMetricas(empresaActiva.id);
            cargarContactos(empresaActiva.id);
        }
    }, [empresaActiva?.id]);

    useEffect(() => {
        const hayCambiosSinGuardar = modoEdicion || hayEdicionEnPestana;
        if (!hayCambiosSinGuardar) return;

        const manejarBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", manejarBeforeUnload);
        return () => window.removeEventListener("beforeunload", manejarBeforeUnload);
    }, [modoEdicion, hayEdicionEnPestana]);

    const fechaAlta = useMemo(() => {
        if (!empresaActiva?.fechaCreacion) return "-";
        return new Date(empresaActiva.fechaCreacion).toLocaleDateString("sv-SE");
    }, [empresaActiva?.fechaCreacion]);

    const abrirEdicion = () => {
        setEmpresaEdicion({ ...empresaActiva });
        setModoEdicion(true);
    };

    const guardarEmpresa = async () => {
        if (!empresaEdicion?.id) return;

        setGuardando(true);
        const payload = {
            codigo: empresaEdicion.codigo,
            nombre: empresaEdicion.nombre,
            descripcion: empresaEdicion.descripcion,
            email: empresaEdicion.email,
            imagen: empresaEdicion.imagen,
            logo: empresaEdicion.logo,
            imagenBase64: empresaEdicion.imagenBase64,
            imagenNombre: empresaEdicion.imagenNombre,
            imagenTipo: empresaEdicion.imagenTipo,
            logoBase64: empresaEdicion.logoBase64,
            logoNombre: empresaEdicion.logoNombre,
            logoTipo: empresaEdicion.logoTipo,
            orden: empresaEdicion.orden,
            tiempoInactividad: empresaEdicion.tiempoInactividad,
            usuModificacion: getUsuarioSesion()?.id,
        };

        await patchEmpresa(empresaEdicion.id, payload);
        setModoEdicion(false);
        setGuardando(false);
        await cargarEmpresas();
    };

    const eliminarEmpresa = async () => {
        if (!empresaEdicion?.id) return;
        await deleteEmpresa(empresaEdicion.id);
        setModoEdicion(false);
        await cargarEmpresas();
    };

    const confirmarSalidaSinGuardar = (continuar) => {
        confirmDialog({
            message: "Los datos introducidos se perderán si sales de esta edición.",
            header: "¿Salir sin guardar?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Continuar",
            rejectLabel: "Cancelar",
            accept: continuar,
        });
    };

    const cambiarTab = (tab) => {
        if (tab === tabActiva) return;
        if (hayEdicionEnPestana) {
            confirmarSalidaSinGuardar(() => {
                setHayEdicionEnPestana(false);
                setTabActiva(tab);
            });
            return;
        }
        setTabActiva(tab);
    };

    const cancelarEdicionEmpresa = () => {
        confirmarSalidaSinGuardar(() => setModoEdicion(false));
    };

    const renderResumenCliente = () => (
        <div className="empresa-profile-shell empresa-client-summary">
            <section className="empresa-profile-card">
                <div className="empresa-profile-header">
                    <div className="empresa-avatar">
                        {empresaActiva.logo ? <img src={empresaActiva.logo} alt="" /> : empresaActiva.nombre?.charAt(0) ?? "E"}
                    </div>
                    <div className="empresa-heading">
                        <div className="empresa-title-row">
                            <h1>{empresaActiva.nombre}</h1>
                            <span className="empresa-pill empresa-pill-blue">{empresaActiva.plan}</span>
                        </div>
                        <p>{empresaActiva.nombreComercial || empresaActiva.nombre}</p>
                    </div>
                </div>

                <div className="empresa-metrics">
                    <MetricCard icon="pi pi-box" label="Pallets" value={metricas.pallets} />
                    <MetricCard icon="pi pi-users" label="Usuarios" value={metricas.usuarios} />
                    <MetricCard icon="pi pi-star" label="Plan" value={empresaActiva.plan} />
                    <MetricCard icon="pi pi-bolt" label="Eventos · 24 h" value={metricas.eventos24h} />
                    <MetricCard icon="pi pi-truck" label="Envios en curso" value={metricas.enviosEnCurso} />
                </div>
            </section>

            <section className="empresa-tab-content">
                <EmpresaResumen metricas={metricas} empresa={empresaActiva} contactos={contactos} />
            </section>
        </div>
    );

    const renderCrudTab = () => {
        if (!empresaActiva?.id) return null;

        const extra = { empresaId: empresaActiva.id, estoyDentroDeUnTab: true };
        const filtroEmpresa = { empresaId: empresaActiva.id };
        const propsEdicionTab = { onModoEdicionChange: setHayEdicionEnPestana };

        switch (tabActiva) {
            case "Envios":
                return (
                    <Crud
                        key={`envios-${empresaActiva.id}`}
                        headerCrud="Envíos"
                        getRegistros={getEnvio}
                        getRegistrosCount={getEnvioCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Envíos"
                        editarComponente={<EditarEnvio />}
                        columnas={columnasEnvio}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteEnvio}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Usuarios":
                return (
                    <Crud
                        key={`usuarios-${empresaActiva.id}`}
                        headerCrud="Usuarios de empresa"
                        getRegistros={getVistaUsuarios}
                        getRegistrosCount={getVistaUsuariosCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Usuarios"
                        editarComponente={<EditarUsuario />}
                        columnas={columnasUsuariosEmpresa}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteUsuario}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Puntos de entrega":
                return (
                    <Crud
                        key={`puntos-entrega-${empresaActiva.id}`}
                        headerCrud="Puntos de entrega"
                        getRegistros={getCliente}
                        getRegistrosCount={getClienteCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Clientes"
                        editarComponente={<EditarCliente />}
                        columnas={columnasPuntosEntrega}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteCliente}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Productos":
                return (
                    <Crud
                        key={`productos-${empresaActiva.id}`}
                        headerCrud="Productos"
                        getRegistros={getProducto}
                        getRegistrosCount={getProductoCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Productos"
                        editarComponente={<EditarProducto />}
                        columnas={columnasProducto}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteProducto}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Sensores activos":
                return (
                    <Crud
                        key={`sensores-${empresaActiva.id}`}
                        headerCrud="Sensores de empresa"
                        getRegistros={getEnvioSensorEmpresa}
                        getRegistrosCount={getEnvioSensorEmpresaCount}
                        botones={["nuevo", "ver", "editar", "eliminar"]}
                        controlador="Envio Sensor Empresa"
                        editarComponente={<EditarEnvioSensorEmpresa />}
                        columnas={columnasSensorEmpresa}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteEnvioSensorEmpresa}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Pallets asignados":
                return <PalletsAsignadosEmpresa key={`pallets-${empresaActiva.id}`} empresaId={empresaActiva.id} />;
            case "Carrocerias":
                return (
                    <Crud
                        key={`carrocerias-${empresaActiva.id}`}
                        headerCrud="Tipos de Carrocería"
                        getRegistros={getTipoCarroceria}
                        getRegistrosCount={getTipoCarroceriaCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Tipos de Carrocería"
                        editarComponente={<EditarTipoCarroceria />}
                        columnas={columnasCatalogosGlobales}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteTipoCarroceria}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Tipos de transporte":
                return (
                    <Crud
                        key={`transportes-${empresaActiva.id}`}
                        headerCrud="Tipos de Transporte"
                        getRegistros={getTipoTransporte}
                        getRegistrosCount={getTipoTransporteCount}
                        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                        controlador="Tipo Transporte"
                        editarComponente={<EditarTipoTransporte />}
                        columnas={columnasCatalogosGlobales}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteTipoTransporte}
                        editarComponenteParametrosExtra={extra}
                        {...propsEdicionTab}
                    />
                );
            case "Configuracion de eventos":
                return (
                    <Crud
                        key={`eventos-${empresaActiva.id}`}
                        headerCrud="Configuración de eventos"
                        getRegistros={getEventoConfiguracion}
                        getRegistrosCount={getEventoConfiguracionCount}
                        botones={[]}
                        controlador="Eventos Configuracion"
                        editarComponente={<div />}
                        columnas={columnasEventoConfiguracion}
                        deleteRegistro={() => {}}
                        editarComponenteParametrosExtra={{ estoyDentroDeUnTab: true }}
                        {...propsEdicionTab}
                    />
                );
            default:
                return <EmpresaResumen key={`resumen-${empresaActiva.id}`} metricas={metricas} empresa={empresaActiva} />;
        }
    };

    if (!empresaActiva) {
        return (
            <div className="empresa-profile-shell">
                <div className="empresa-profile-card empresa-empty-state">No hay empresas configuradas.</div>
            </div>
        );
    }

    if (!obtenerContextoSesion().usuarioAdmin) {
        return renderResumenCliente();
    }

    if (modoEdicion && empresaEdicion) {
        return (
            <div className="empresa-profile-shell">
                <ConfirmDialog />
                <section className="empresa-profile-card empresa-edit-screen">
                    <div className="empresa-edit-screen-header">
                        <button className="empresa-back-button" type="button" onClick={cancelarEdicionEmpresa}>
                            <i className="pi pi-chevron-left" aria-hidden="true"></i>
                            Clientes
                        </button>
                        <div>
                            <h1>Editar cliente</h1>
                            <p>
                                Modifica la ficha de <strong>{empresaActiva.nombre}</strong>. Los cambios se aplican al guardar.
                            </p>
                        </div>
                    </div>

                    <EditarDatosEmpresa
                        empresa={empresaEdicion}
                        setEmpresa={setEmpresaEdicion}
                        estadoGuardando={guardando}
                    />

                    <footer className="empresa-edit-footer empresa-edit-screen-footer">
                        <span></span>
                        <div>
                            <Button label="Cancelar" text onClick={cancelarEdicionEmpresa} />
                            <Button label={guardando ? "Guardando..." : "Guardar cambios"} onClick={guardarEmpresa} disabled={guardando} />
                        </div>
                    </footer>
                </section>
            </div>
        );
    }

    return (
        <div className="empresa-profile-shell">
            <ConfirmDialog />
            <section className="empresa-profile-card">
                <div className="empresa-profile-topbar">
                    <button className="empresa-back-button" type="button">
                        <i className="pi pi-chevron-left" aria-hidden="true"></i>
                        Clientes
                    </button>
                </div>

                <div className="empresa-profile-header">
                    <div className="empresa-avatar">
                        {empresaActiva.logo ? <img src={empresaActiva.logo} alt="" /> : empresaActiva.nombre?.charAt(0) ?? "E"}
                    </div>
                    <div className="empresa-heading">
                        <div className="empresa-title-row">
                            <h1>{empresaActiva.nombre}</h1>
                            <span className="empresa-pill empresa-pill-success">{empresaActiva.estado}</span>
                            <span className="empresa-pill empresa-pill-blue">{empresaActiva.plan}</span>
                        </div>
                        <p>
                            {empresaActiva.codigo} · {empresaActiva.nombreComercial || empresaActiva.nombre} · ALTA {fechaAlta}
                        </p>
                    </div>
                    <div className="empresa-header-actions">
                        <Button label="Editar" icon="pi pi-pencil" outlined onClick={abrirEdicion} />
                        <Button label={empresaActiva.estado} icon="pi pi-circle-fill" severity="success" outlined />
                    </div>
                </div>

                <div className="empresa-metrics">
                    <MetricCard icon="pi pi-box" label="Pallets" value={metricas.pallets} />
                    <MetricCard icon="pi pi-users" label="Usuarios" value={metricas.usuarios} />
                    <MetricCard icon="pi pi-star" label="Plan" value={empresaActiva.plan} />
                    <MetricCard icon="pi pi-bolt" label="Eventos · 24 h" value={metricas.eventos24h} />
                    <MetricCard icon="pi pi-truck" label="Envios en curso" value={metricas.enviosEnCurso} />
                </div>

                <nav className="empresa-tabs" aria-label="Secciones de empresa">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={tabActiva === tab ? "empresa-tab empresa-tab-active" : "empresa-tab"}
                            type="button"
                            onClick={() => cambiarTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </section>

            <section className="empresa-tab-content" key={`${empresaActiva.id}-${tabActiva}`}>
                {renderCrudTab()}
            </section>
        </div>
    );
};

const MetricCard = ({ icon, label, value }) => (
    <article className="empresa-metric-card">
        <span className="empresa-metric-icon">
            <i className={icon} aria-hidden="true"></i>
        </span>
        <div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    </article>
);

const EmpresaResumen = ({ metricas, empresa, contactos = [] }) => {
    const actividad = [
        { tiempo: "2 min", texto: "Pallet NEAT-00001 reportó posición Valencia → Murcia", tipo: "PALLET" },
        { tiempo: "14 min", texto: "Andrea Soler actualizó configuración de alertas", tipo: "USER" },
        { tiempo: "1 h", texto: "892 llamadas API en la última hora", tipo: "API" },
        { tiempo: "4 h", texto: "Pallet NEAT-00002 sensor de temperatura reemplazado", tipo: "SENSOR" },
        { tiempo: "ayer", texto: "Factura mensual de €6900 emitida (auto-cobro OK)", tipo: "BILLING" },
        { tiempo: "2 días", texto: "Nuevo usuario invitado: jordi.ferrer@logmed.com", tipo: "USER" },
    ];

    const contactosFallback = [
        { nombre: "Andrea Soler", email: "andrea.soler@logmed.com", rol: "org_admin" },
        { nombre: "Lucas Lindqvist", email: "lucas.lindqvist@logmed.com", rol: "ops_manager" },
        { nombre: "María Vidal", email: "maria.vidal@logmed.com", rol: "driver" },
    ];
    const contactosVisibles = contactos.length > 0 ? contactos : contactosFallback;

    return (
        <div className="empresa-resumen-grid">
            <article className="empresa-resumen-panel empresa-actividad-panel">
                <h3>Actividad reciente</h3>
                <div className="empresa-activity-list">
                    {actividad.map((item) => (
                        <div className="empresa-activity-item" key={`${item.tiempo}-${item.texto}`}>
                            <span>{item.tiempo}</span>
                            <div>
                                <strong>{item.texto}</strong>
                                <small>{item.tipo}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </article>

            <div className="empresa-resumen-side">
                <article className="empresa-resumen-panel">
                    <h3>Estado operativo</h3>
                    <OperationalRow label="Pallets reportando" value={metricas.pallets || 95} />
                    <OperationalRow label="API errors" value="2.3%" warning />
                    <OperationalRow label="SLA mes" value="99.94%" />
                    <OperationalRow label="Onboarding" value="100%" />
                </article>

                <article className="empresa-resumen-panel">
                    <h3>Contactos</h3>
                    <div className="empresa-contact-list">
                        {contactosVisibles.map((contacto) => (
                            <div className="empresa-contact-item" key={`${contacto.email}-${contacto.nombre}`}>
                                <span>{contacto.nombre.charAt(0)}</span>
                                <div>
                                    <strong>{contacto.nombre}</strong>
                                    <small>{contacto.email}</small>
                                </div>
                                <em>{contacto.rol}</em>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
};

const OperationalRow = ({ label, value, warning = false }) => (
    <div className="empresa-operational-row">
        <span>{label}</span>
        <div>
            <b className={warning ? "empresa-progress-warning" : ""}></b>
            <strong className={warning ? "empresa-value-warning" : ""}>{value}</strong>
        </div>
    </div>
);

export default Empresa;
export { camposPendientesBack };
