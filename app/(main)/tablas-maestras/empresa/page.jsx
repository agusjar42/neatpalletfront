"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { deleteEmpresa, getEmpresas, getEmpresasCount, patchEmpresa } from "@/app/api-endpoints/empresa";
import { getEmpresaPalletCount } from "@/app/api-endpoints/empresa-pallet";
import { deleteUsuario, getVistaUsuarios, getVistaUsuariosCount } from "@/app/api-endpoints/usuario";
import { getUsuarioSesion } from "@/app/utility/Utils";
import Crud from "../../../components/shared/crud";
import { getCliente, getClienteCount, deleteCliente } from "@/app/api-endpoints/cliente";
import { getProducto, getProductoCount, deleteProducto } from "@/app/api-endpoints/empresa-producto";
import { getEnvio, getEnvioCount, deleteEnvio, getResumenEnvio } from "@/app/api-endpoints/envio";
import { getEmpresaSensor, getEmpresaSensorCount, deleteEmpresaSensor } from "@/app/api-endpoints/empresa-sensor";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/empresa-tipo-carroceria";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/empresa-tipo-transporte";
import { getEventoConfiguracion, getEventoConfiguracionCount } from "@/app/api-endpoints/evento-configuracion";
import { getEnvioContenido, getEnvioContenidoCount, deleteEnvioContenido } from "@/app/api-endpoints/envio-contenido";
import { getEnvioMovimiento, getEnvioMovimientoCount, deleteEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import { getEnvioParada, getEnvioParadaCount, deleteEnvioParada } from "@/app/api-endpoints/envio-parada";
import { getEnvioOperario, getEnvioOperarioCount, deleteEnvioOperario } from "@/app/api-endpoints/envio-operario";
import { getEnvioSensor, getEnvioSensorCount, deleteEnvioSensor } from "@/app/api-endpoints/envio-sensor";
import EditarUsuario from "../../usuarios/editar";
import EditarCliente from "../../cliente/editar";
import EditarProducto from "../../producto/editar";
import EditarEnvioContenido from "../../envio-contenido/editar";
import EditarEnvioMovimiento from "../../envio-movimiento/editar";
import EditarEnvioOperario from "../../envio-operario/editar";
import EditarEnvioParada from "../../envio-parada/editar";
import EditarEnvioSensor from "../../envio-sensor/editar";
import EditarEmpresaSensor from "../../empresa-sensor/editar";
import EditarTipoCarroceria from "../../tipo-carroceria/editar";
import EditarTipoTransporte from "../../tipo-transporte/editar";
import PalletsAsignadosEmpresa from "./PalletsAsignadosEmpresa";
import EditarDatosEmpresa from "./EditarDatosEmpresa";
import EmpresaIntro from "./EmpresaIntro";
import { InputText } from "primereact/inputtext";

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

const filtrosEstadoCrud = [
    { label: "Todos", value: "Todos" },
    { label: "Activa", value: "Activa" },
    { label: "En prueba", value: "En prueba" },
    { label: "Suspendida", value: "Suspendida" },
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

columnasPuntosEntrega.splice(0, columnasPuntosEntrega.length,
    { campo: "orden", header: "Orden", tipo: "number" },
    { campo: "codigo", header: "Codigo", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "direccion", header: "Direccion", tipo: "string" },
    { campo: "horario", header: "Horario", tipo: "string" },
    { campo: "telefono", header: "Telefono", tipo: "string" },
    { campo: "mail", header: "Email", tipo: "string" },
    { campo: "estado", header: "Estado", tipo: "string" },
);

columnasProducto.splice(0, columnasProducto.length,
    { campo: "orden", header: "Orden", tipo: "number" },
    { campo: "sku", header: "SKU", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "familia", header: "Familia", tipo: "string" },
    { campo: "rangoTemp", header: "Rango temp.", tipo: "string" },
    { campo: "vidaUtil", header: "Vida util", tipo: "string" },
    { campo: "pesoKgs", header: "Peso", tipo: "number" },
    { campo: "estado", header: "Estado", tipo: "string" },
);

const columnasEnvio = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "numero", header: "Envio", tipo: "string" },
    { campo: "palletCodigo", header: "Pallet", tipo: "string" },
    { campo: "clienteNombre", header: "Punto de entrega", tipo: "string" },
    { campo: "origenRuta", header: "Origen", tipo: "string" },
    { campo: "destinoRuta", header: "Destino", tipo: "string" },
    //
    //El estado se calcula en backend para que el CRUD interno
    //y la pantalla principal de envios muestren la misma columna
    //
    {
        campo: "estadoEnvio",
        header: "Estado",
        tipo: "string",
        body: (rowData) => <span style={{ color: "#2f8f63", fontWeight: 500 }}>{rowData.estadoEnvio || "-"}</span>,
    },
];

const columnasEnvioContenidoDetalle = [
    { campo: "sku", header: "SKU", tipo: "string" },
    { campo: "nombreProducto", header: "Producto", tipo: "string" },
    { campo: "pesoKgs", header: "Peso/ud.", tipo: "number" },
    { campo: "cantidad", header: "Unidades", tipo: "number" },
    { campo: "pesoTotal", header: "Peso total", tipo: "number" },
];

const columnasEnvioMovimientoDetalle = [
    { campo: "fechaEspanol", header: "Fecha", tipo: "date" },
    { campo: "nombreSensor", header: "Sensor", tipo: "string" },
    { campo: "valor", header: "Valor", tipo: "string" },
    { campo: "gps", header: "GPS", tipo: "string" },
];

const columnasEnvioParadaDetalle = [
    { campo: "tipo", header: "Tipo", tipo: "string" },
    { campo: "punto", header: "Punto", tipo: "string" },
    { campo: "coordenadas", header: "Coordenadas", tipo: "string" },
    { campo: "eta", header: "ETA", tipo: "string" },
    { campo: "horaReal", header: "Hora real", tipo: "string" },
    { campo: "detencion", header: "Detencion", tipo: "string" },
    { campo: "estado", header: "Estado", tipo: "string" },
];

const columnasEnvioSensorDetalle = [
    { campo: "orden", header: "Orden", tipo: "number" },
    { campo: "nombreSensor", header: "Tipo de sensor", tipo: "string" },
    { campo: "tipoSensorId", header: "ID", tipo: "number" },
    { campo: "valor", header: "Valor", tipo: "string" },
];

const columnasOperarioDetalle = [
    { campo: "nombre", header: "Operario", tipo: "string" },
    { campo: "telefono", header: "Telefono", tipo: "string" },
    { campo: "email", header: "Email", tipo: "string" },
    { campo: "activoSN", header: "Activo", tipo: "booleano" },
];

const columnasEmpresaSensor = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Tipo de Sensor", tipo: "string" },
    { campo: "unidad", header: "Unidad", tipo: "string" },
    { campo: "valorMinimo", header: "Minimo", tipo: "string" },
    { campo: "valorMaximo", header: "Maximo", tipo: "string" },
    { campo: "activoSn", header: "Activo", tipo: "booleano" },
];

const nombreTipoTransporteBodyTemplate = (rowData) => rowData?.nombre || rowData?.codigo || "-";

const columnasCatalogosGlobales = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "activoSn", header: "Activo", tipo: "booleano" },
];

const columnasCarroceria = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "codigo", header: "Codigo", tipo: "string" },
    { campo: "nombre", header: "Tipo", tipo: "string" },
    { campo: "capacidad", header: "Capacidad", tipo: "string" },
    { campo: "activoSn", header: "Estado", tipo: "booleano" },
];

const columnasEventoConfiguracion = [
    { campo: "orden", header: "Orden", tipo: "string" },
    { campo: "nombre", header: "Nombre", tipo: "string" },
    { campo: "descripcion", header: "Descripción", tipo: "string" },
    { campo: "valor", header: "Valor", tipo: "string" },
    { campo: "unidadMedida", header: "Unidad", tipo: "string" },
    { campo: "activoSn", header: "Activo", tipo: "booleano" },
];

const tabsDetalleEnvio = ["Resumen", "Configuracion", "Contenido", "Movimientos", "Paradas", "Sensores", "Operarios", "Informe"];

const resumenEnvioFallback = [
    { pallet: "NEAT-00001", eventosGuardados: 252, eventosEnviados: "232 (92%)", totalAlarmas: 2, bateriaActual: 49 },
    { pallet: "NEAT-00002", eventosGuardados: 204, eventosEnviados: "184 (90%)", totalAlarmas: 1, bateriaActual: 46 },
];

const operariosEnvioFallback = [
    { rol: "Conductor", iniciales: "ME", nombre: "Mario Estevez", telefono: "+34 612 33 44 55", permiso: "C+E", turno: "5 may 06:00 - 5 may 18:00" },
    { rol: "Co-conductor", iniciales: "LP", nombre: "Lucia Pereira", telefono: "+34 644 21 09 88", permiso: "C+E", turno: "5 may 14:00 - 5 may 22:00" },
    { rol: "Supervisor logistico", iniciales: "AB", nombre: "Ainhoa Beltran", telefono: "+34 699 71 12 34", permiso: "—", turno: "24x7" },
    { rol: "Tecnico de carga", iniciales: "HE", nombre: "Hassan El-Mahdi", telefono: "+34 651 80 22 17", permiso: "—", turno: "5 may 05:30 - 5 may 08:00" },
];

const documentosEnvioFallback = [
    { tipo: "PDF", nombre: "CMR firmado", tamano: "142 KB", accion: "Descargar" },
    { tipo: "PDF", nombre: "Albaran salida", tamano: "58 KB", accion: "Descargar" },
    { tipo: "XLSX", nombre: "Lista de carga", tamano: "24 KB", accion: "Descargar" },
    { tipo: "PDF", nombre: "Pre-check vehiculo", tamano: "86 KB", accion: "Descargar" },
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

const getEstadoMeta = (estado) => {
    const valor = estado ?? "Activa";
    return estados.find((item) => item.value === valor) ?? estados[0];
};

const placeholderImageCell = (label) => (rowData) => {
    const src = rowData?.[label === "IMG" ? "imagen" : "logo"];
    if (src) {
        return (
            <div className="clientes-crud-thumb">
                <img src={src} alt={label} />
            </div>
        );
    }

    return (
        <div className="clientes-crud-thumb clientes-crud-thumb-placeholder">
            <span>{label}</span>
        </div>
    );
};

const ordenBodyTemplate = (rowData) => (
    <span>{rowData.orden ?? "-"}</span>
);

const nombreComercialBodyTemplate = (rowData) => (
    <span className={`clientes-crud-chip ${getEstadoMeta(rowData?.estado).className}`}>
        <span className="clientes-crud-chip-dot"></span>
        {rowData.nombreComercial || rowData.nombre || "-"}
    </span>
);

const empresaBodyTemplate = (rowData) => {
    const nombre = rowData.nombre || "-";
    const partes = String(nombre).split(" ");
    const primeraLinea = partes.slice(0, Math.max(1, Math.ceil(partes.length / 2))).join(" ");
    const segundaLinea = partes.slice(Math.max(1, Math.ceil(partes.length / 2))).join(" ");

    return (
        <div className="clientes-crud-company">
            <strong>{primeraLinea}</strong>
            {segundaLinea ? <span>{segundaLinea}</span> : null}
        </div>
    );
};

const emailBodyTemplate = (rowData) => (
    <a className="clientes-crud-email" href={`mailto:${rowData.email}`}>
        {rowData.email}
    </a>
);

const descripcionBodyTemplate = (rowData) => {
    const descripcion = rowData.descripcion || "-";
    const descripcionTexto = String(descripcion);
    const descripcionCorta = descripcionTexto.length > 25
        ? `${descripcionTexto.slice(0, 25)}...`
        : descripcionTexto;

    return (
        <div className="clientes-crud-description" title={descripcionTexto}>
            {descripcionCorta}
        </div>
    );
};

const columnasEmpresas = [
    { campo: "orden", header: "ORDEN", tipo: "number", body: ordenBodyTemplate, headerStyle: { minWidth: "5.5rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "codigo", header: "CÓDIGO", tipo: "string", headerStyle: { minWidth: "7rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "imagen", header: "IMAGEN", tipo: "string", body: placeholderImageCell("IMG"), headerStyle: { minWidth: "6.4rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "logo", header: "LOGO", tipo: "string", body: placeholderImageCell("LOGO"), headerStyle: { minWidth: "6.4rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "nombreComercial", header: "NOMBRE COMERCIAL", tipo: "string", body: nombreComercialBodyTemplate, headerStyle: { minWidth: "11rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "nombre", header: "EMPRESA", tipo: "string", body: empresaBodyTemplate, headerStyle: { minWidth: "12rem" } },
    { campo: "email", header: "EMAIL", tipo: "string", body: emailBodyTemplate, headerStyle: { minWidth: "12rem" }, style: { whiteSpace: "nowrap" } },
    { campo: "descripcion", header: "DESCRIPCIÓN", tipo: "string", body: descripcionBodyTemplate, headerStyle: { minWidth: "20rem" } },
];

const Empresa = () => {
    const [empresaActiva, setEmpresaActiva] = useState(null);
    const [empresaEdicion, setEmpresaEdicion] = useState(null);
    const [metricas, setMetricas] = useState({ pallets: 0, usuarios: 0, eventos24h: 0, enviosEnCurso: 0 });
    const [contactos, setContactos] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [hayEdicionEnPestana, setHayEdicionEnPestana] = useState(false);
    const [tabActiva, setTabActiva] = useState("Resumen");
    const [filtroEstadoCrud, setFiltroEstadoCrud] = useState("Todos");

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

        setEmpresaActiva((actual) => {
            if (usuarioAdmin) {
                return actual ? lista.find((empresa) => empresa.id === actual?.id) ?? null : null;
            }
            return lista.find((empresa) => empresa.id === actual?.id) ?? lista[0] ?? null;
        });
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
        return new Date(empresaActiva.fechaCreacion).toLocaleDateString("es-ES");
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
            estado: empresaEdicion.estado,
            plan: empresaEdicion.plan,
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
        confirmarSalidaSinGuardar(() => {
            setHayEdicionEnPestana(false);
            setModoEdicion(false);
        });
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
                            <span className={`empresa-pill ${getEstadoMeta(empresaActiva.estado).className}`}>{empresaActiva.estado}</span>
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
                <EmpresaResumenClienteMock metricas={metricas} empresa={empresaActiva} contactos={contactos} />
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
                        accionEntradaPorFila="ver"
                        editarComponente={<EmpresaEnvioDetalle />}
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
                        getRegistros={getEmpresaSensor}
                        getRegistrosCount={getEmpresaSensorCount}
                        botones={["nuevo", "ver", "editar", "eliminar"]}
                        controlador="Empresa Sensor"
                        editarComponente={<EditarEmpresaSensor />}
                        columnas={columnasEmpresaSensor}
                        filtradoBase={filtroEmpresa}
                        deleteRegistro={deleteEmpresaSensor}
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
                        columnas={columnasCarroceria}
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
                        columnas={[
                            { campo: "orden", header: "Orden", tipo: "string" },
                            { campo: "nombre", header: "Nombre", tipo: "string", body: nombreTipoTransporteBodyTemplate },
                            { campo: "activoSn", header: "Activo", tipo: "booleano" },
                        ]}
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

    if (!empresaActiva && !obtenerContextoSesion().usuarioAdmin) {
        return (
            <div className="empresa-profile-shell">
                <div className="empresa-profile-card empresa-empty-state">No hay empresas configuradas.</div>
            </div>
        );
    }

    if (!obtenerContextoSesion().usuarioAdmin) {
        return renderResumenCliente();
    }

    if (!empresaActiva) {
        const filtroCrudEmpresas = filtroEstadoCrud === "Todos"
            ? undefined
            : { estado: filtroEstadoCrud };

        const toolbarExtraEmpresas = (
            <>
                <span className="empresa-crud-quick-label">Estado:</span>
                {filtrosEstadoCrud.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        className={`empresa-crud-quick-filter ${filtroEstadoCrud === item.value ? "is-active" : ""}`}
                        onClick={() => setFiltroEstadoCrud(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </>
        );

        return (
            <div className="clientes-reference-crud">
                <EmpresaIntro />
                <Crud
                    key={`empresas-${filtroEstadoCrud}`}
                    headerCrud=""
                    getRegistros={getEmpresas}
                    getRegistrosCount={getEmpresasCount}
                    botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                    accionEntradaPorFila="ver"
                    controlador="Empresas"
                    editarComponente={<EmpresaAdminDetalle />}
                    columnas={columnasEmpresas}
                    deleteRegistro={deleteEmpresa}
                    filtradoBase={filtroCrudEmpresas}
                    toolbarExtraContent={toolbarExtraEmpresas}
                />
            </div>
        );
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
                        <div className="empresa-edit-footer-actions">
                            <Button label="Cancelar" outlined onClick={cancelarEdicionEmpresa} />
                            <Button label={guardando ? "Guardando..." : "Guardar cambios"} outlined onClick={guardarEmpresa} disabled={guardando} />
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
                            <span className={`empresa-pill ${getEstadoMeta(empresaActiva.estado).className}`}>{empresaActiva.estado}</span>
                            <span className="empresa-pill empresa-pill-blue">{empresaActiva.plan}</span>
                        </div>
                        <p>
                            {empresaActiva.codigo} · {empresaActiva.nombreComercial || empresaActiva.nombre} · ALTA {fechaAlta}
                        </p>
                    </div>
                    <div className="empresa-header-actions">
                        <Button label="Editar" icon="pi pi-pencil" outlined onClick={abrirEdicion} />
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
    <article className={`empresa-metric-card ${label === "Plan" ? "empresa-metric-card-plan" : ""}`}>
        <span className="empresa-metric-icon">
            <i className={icon} aria-hidden="true"></i>
        </span>
        <div className="empresa-metric-copy">
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

const EmpresaResumenClienteMock = ({ metricas, empresa, contactos = [] }) => {
    const actividad = [
        { tiempo: "2 min", texto: "Pallet NEAT-00009 reporto posicion Valencia -> Murcia", tipo: "PALLET" },
        { tiempo: "14 min", texto: "Diego Hansen actualizo configuracion de alertas", tipo: "USER" },
        { tiempo: "1 h", texto: "136 llamadas API en la ultima hora", tipo: "API" },
        { tiempo: "4 h", texto: "Pallet NEAT-00010 sensor de temperatura reemplazado", tipo: "SENSOR" },
        { tiempo: "ayer", texto: "Factura mensual de EUR2490 emitida (auto-cobro OK)", tipo: "BILLING" },
        { tiempo: "2 dias", texto: "Nuevo usuario invitado: jordi.ferrer@frutand.com", tipo: "USER" },
    ];

    const contactosFallback = [
        { nombre: "Diego Hansen", email: "diego.hansen@frutand.com", rol: "org_admin" },
        { nombre: "Sofia Muller", email: "sofia.muller@frutand.com", rol: "driver" },
        { nombre: "Marc Pereira", email: "marc.pereira@frutand.com", rol: "viewer" },
    ];
    const contactosVisibles = contactos.length > 0 ? contactos : contactosFallback;
    const estadoOperativo = [
        { label: "Pallets reportando", value: metricas.pallets || 95, progress: 0.95 },
        { label: "API errors", value: "2.3%", progress: 0.36, warning: true },
        { label: "SLA mes", value: "99.94%", progress: 0.99 },
        { label: "Onboarding", value: "100%", progress: 1 },
    ];

    return (
        <div className="empresa-resumen-grid empresa-resumen-grid-mock">
            <article className="empresa-resumen-panel empresa-resumen-panel-mock empresa-actividad-panel">
                <h3>Actividad reciente</h3>
                <div className="empresa-activity-list empresa-activity-list-mock">
                    {actividad.map((item) => (
                        <div className="empresa-activity-item empresa-activity-item-mock" key={`${item.tiempo}-${item.texto}`}>
                            <span>{item.tiempo}</span>
                            <div>
                                <strong>{item.texto}</strong>
                                <small>{item.tipo}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </article>

            <div className="empresa-resumen-side empresa-resumen-side-mock">
                <article className="empresa-resumen-panel empresa-resumen-panel-mock">
                    <h3>Estado operativo</h3>
                    {estadoOperativo.map((item) => (
                        <div className="empresa-operational-row empresa-operational-row-mock" key={item.label}>
                            <span>{item.label}</span>
                            <div>
                                <b className={item.warning ? "empresa-progress-warning" : ""} style={{ width: `${Math.max(0.18, Math.min(item.progress, 1)) * 100}%` }}></b>
                                <strong className={item.warning ? "empresa-value-warning" : ""}>{item.value}</strong>
                            </div>
                        </div>
                    ))}
                </article>

                <article className="empresa-resumen-panel empresa-resumen-panel-mock">
                    <h3>Contactos</h3>
                    <div className="empresa-contact-list empresa-contact-list-mock">
                        {contactosVisibles.map((contacto) => (
                            <div className="empresa-contact-item empresa-contact-item-mock" key={`${contacto.email}-${contacto.nombre}`}>
                                <span>{contacto.nombre.charAt(0).toUpperCase()}</span>
                                <div>
                                    <strong>{contacto.nombre}</strong>
                                    <small>{contacto.email}</small>
                                </div>
                                <em>{String(contacto.rol || "viewer").toLowerCase().replaceAll(" ", "_")}</em>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
};

const EmpresaEnvioDetalle = ({ idEditar, setIdEditar, rowData = [] }) => {
    const [envioActivo, setEnvioActivo] = useState(null);
    const [detalleTabActiva, setDetalleTabActiva] = useState("Resumen");
    const [contenido, setContenido] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [paradas, setParadas] = useState([]);
    const [sensores, setSensores] = useState([]);
    const [operarios, setOperarios] = useState([]);
    const [informePallets, setInformePallets] = useState([]);
    const [refreshContenido, setRefreshContenido] = useState(0);
    const [refreshMovimientos, setRefreshMovimientos] = useState(0);
    const [refreshParadas, setRefreshParadas] = useState(0);
    const [refreshSensores, setRefreshSensores] = useState(0);
    const [refreshOperarios, setRefreshOperarios] = useState(0);
    const [modalDetalleRegistro, setModalDetalleRegistro] = useState({ visible: false, accion: "ver", seccion: "", registro: null });

    useEffect(() => {
        const envioSeleccionado = rowData.find((envio) => envio.id === idEditar);
        setEnvioActivo(envioSeleccionado || null);
    }, [idEditar, rowData]);

    useEffect(() => {
        if (!envioActivo?.id) return;

        //
        //Cargamos los bloques del detalle y, si alguna llamada falla,
        //evitamos rellenar con mocks en contenido
        //
        Promise.all([
            getEnvioContenido(JSON.stringify({ where: { and: { envioId: envioActivo.id } }, order: "orden ASC" })).catch(() => []),
            getEnvioMovimiento(JSON.stringify({ where: { and: { envioId: envioActivo.id } }, order: "fecha DESC" })).catch(() => []),
            getEnvioParada(JSON.stringify({ where: { and: { envioId: envioActivo.id } }, order: "orden ASC" })).catch(() => []),
            getEnvioSensor(JSON.stringify({ where: { and: { envioId: envioActivo.id } }, order: "orden ASC" })).catch(() => []),
            getEnvioOperario(JSON.stringify({ where: { and: { envioId: envioActivo.id } }, order: "id ASC" })).catch(() => []),
            getResumenEnvio(envioActivo.id).catch(() => []),
        ]).then(([contenidoData, movimientosData, paradasData, sensoresData, operariosData, resumenData]) => {
            setContenido(Array.isArray(contenidoData) ? contenidoData : []);
            setMovimientos(Array.isArray(movimientosData) && movimientosData.length > 0 ? movimientosData : construirMovimientosFallback());
            setParadas(Array.isArray(paradasData) ? paradasData : []);
            setSensores(Array.isArray(sensoresData) ? sensoresData : []);
            setOperarios(Array.isArray(operariosData) ? operariosData : []);
            setInformePallets(Array.isArray(resumenData) && resumenData.length > 0 ? resumenData : resumenEnvioFallback);
        });
    }, [envioActivo?.id, envioActivo?.clienteId, refreshContenido, refreshMovimientos, refreshParadas, refreshSensores, refreshOperarios]);

    if (!envioActivo) {
        return <div className="empresa-profile-card empresa-empty-state">No se ha encontrado el envio seleccionado.</div>;
    }

    //
    //Abrimos un modal local para gestionar ver, editar y nuevo
    //en las subtabs internas del detalle de envios
    //
    const abrirModalDetalleRegistro = (seccion, accion, registro = null) => {
        setModalDetalleRegistro({ visible: true, accion, seccion, registro });
    };

    //
    //Cerramos el modal y limpiamos el registro temporal mostrado
    //
    const cerrarModalDetalleRegistro = () => {
        setModalDetalleRegistro({ visible: false, accion: "ver", seccion: "", registro: null });
    };

    const resumenTop = construirResumenTop(envioActivo, contenido, sensores);
    const conteos = {
        contenido: contenido.length,
        movimientos: movimientos.length || 14,
        paradas: paradas.length,
        sensores: sensores.length,
        operarios: operarios.length,
    };

    return (
        <div className="envio-detalle-shell">
            <section className="empresa-profile-card envio-detalle-card">
                <button className="empresa-back-button envio-volver-boton" type="button" onClick={() => setIdEditar(null)}>
                    <i className="pi pi-chevron-left" aria-hidden="true"></i>
                    Volver
                </button>

                <div className="envio-detalle-heading">
                    <small>ENVIO</small>
                    <div>
                        <h1>{envioActivo.numero || "ENV-00432"}</h1>
                        <span>En transito</span>
                    </div>
                </div>

                <div className="envio-detalle-strip">
                    <InfoItem label="Cliente" value={envioActivo.clienteNombre || "Logistica del Mediterraneo"} />
                    <InfoItem label="Pallet" value="NEAT-00001" mono />
                    <InfoItem label="Origen" value={envioActivo.origenRuta || "C/ Mayor 10, Madrid"} />
                    <InfoItem label="Destino" value={envioActivo.destinoRuta || "Av. Diagonal 20, Barcelona"} />
                    <InfoItem label="Salida" value={envioActivo.fechaSalidaEspanol || "4 may 2026 · 06:00"} />
                    <InfoItem label="ETA" value={envioActivo.fechaLlegadaEspanol || "6 may 2026 · 11:36"} />
                </div>

                <div className="envio-kpis-grid">
                    <EnvioKpiCard label="Temp. max" value={resumenTop.temperaturaMax} helper="min 2.4 C · objetivo 2–8" />
                    <EnvioKpiCard label="Distancia" value={resumenTop.distancia} helper="12 h 04 min en ruta" />
                    <EnvioKpiCard label="Carga" value={resumenTop.carga} helper={`${resumenTop.unidades} uds · ${resumenTop.skus} SKU`} />
                    <EnvioKpiCard label="Cumplimiento" value="Revisar" helper="temp · ETA" warning />
                </div>

                <nav className="envio-detalle-tabs">
                    {tabsDetalleEnvio.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={detalleTabActiva === tab ? "envio-detalle-tab envio-detalle-tab-active" : "envio-detalle-tab"}
                            onClick={() => setDetalleTabActiva(tab)}
                        >
                            {tab}
                            {tab === "Contenido" ? <b>{conteos.contenido}</b> : null}
                            {tab === "Movimientos" ? <b>{conteos.movimientos}</b> : null}
                            {tab === "Paradas" ? <b>{conteos.paradas}</b> : null}
                            {tab === "Sensores" ? <b>{conteos.sensores}</b> : null}
                            {tab === "Operarios" ? <b>{conteos.operarios}</b> : null}
                        </button>
                    ))}
                </nav>
            </section>

            <section className="empresa-tab-content">
                {detalleTabActiva === "Resumen" ? <EnvioResumenTab envio={envioActivo} sensores={sensores} paradas={paradas} resumenTop={resumenTop} /> : null}
                {detalleTabActiva === "Configuracion" ? <EnvioConfiguracionTab /> : null}
                {detalleTabActiva === "Contenido" ? (
                    <article className="envio-panel">
                        <Crud
                            key={`detalle-envio-contenido-${envioActivo.id}-${refreshContenido}`}
                            headerCrud="Contenido del pallet"
                            getRegistros={getEnvioContenido}
                            getRegistrosCount={getEnvioContenidoCount}
                            botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                            controlador="Envio Contenido"
                            editarComponente={<EditarEnvioContenido />}
                            columnas={columnasEnvioContenidoDetalle}
                            filtradoBase={{ envioId: envioActivo.id }}
                            deleteRegistro={deleteEnvioContenido}
                            cargarDatosInicialmente={true}
                            mostrarEdicionEnModal={true}
                            modalEdicionProps={{
                                showHeader: false,
                                className: "neat-crud-edit-dialog envio-registro-dialog",
                                style: { width: "min(760px, 92vw)" },
                            }}
                            onDataChange={() => setRefreshContenido(prev => prev + 1)}
                            editarComponenteParametrosExtra={{
                                envioId: envioActivo.id,
                                clienteId: envioActivo.clienteId,
                                empresaId: envioActivo.empresaId,
                                estoyDentroDeUnTab: true,
                                ocultarClienteResumenHeader: true,
                                onDataChange: () => setRefreshContenido(prev => prev + 1),
                            }}
                        />
                    </article>
                ) : null}
                {detalleTabActiva === "Movimientos" ? (
                    <article className="envio-panel">
                        <Crud
                            key={`detalle-envio-movimientos-${envioActivo.id}-${refreshMovimientos}`}
                            headerCrud="Movimientos"
                            getRegistros={getEnvioMovimiento}
                            getRegistrosCount={getEnvioMovimientoCount}
                            botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV", "generarGrafico"]}
                            controlador="Envio Movimiento"
                            editarComponente={<EditarEnvioMovimiento />}
                            columnas={columnasEnvioMovimientoDetalle}
                            filtradoBase={{ envioId: envioActivo.id }}
                            deleteRegistro={deleteEnvioMovimiento}
                            cargarDatosInicialmente={true}
                            mostrarEdicionEnModal={true}
                            modalEdicionProps={{
                                showHeader: false,
                                className: "neat-crud-edit-dialog envio-registro-dialog",
                                style: { width: "min(760px, 92vw)" },
                            }}
                            onDataChange={() => setRefreshMovimientos(prev => prev + 1)}
                            editarComponenteParametrosExtra={{
                                envioId: envioActivo.id,
                                estoyDentroDeUnTab: true,
                                ocultarClienteResumenHeader: true,
                                onDataChange: () => setRefreshMovimientos(prev => prev + 1),
                            }}
                        />
                    </article>
                ) : null}
                {detalleTabActiva === "Paradas" ? (
                    <article className="envio-panel">
                        <Crud
                            key={`detalle-envio-paradas-${envioActivo.id}-${refreshParadas}`}
                            headerCrud="Paradas"
                            getRegistros={getEnvioParada}
                            getRegistrosCount={getEnvioParadaCount}
                            botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                            controlador="Envio Parada"
                            editarComponente={<EditarEnvioParada />}
                            columnas={columnasEnvioParadaDetalle}
                            filtradoBase={{ envioId: envioActivo.id }}
                            deleteRegistro={deleteEnvioParada}
                            cargarDatosInicialmente={true}
                            mostrarEdicionEnModal={true}
                            modalEdicionProps={{
                                showHeader: false,
                                className: "neat-crud-edit-dialog envio-registro-dialog",
                                style: { width: "min(760px, 92vw)" },
                            }}
                            onDataChange={() => setRefreshParadas(prev => prev + 1)}
                            editarComponenteParametrosExtra={{
                                envioId: envioActivo.id,
                                clienteId: envioActivo.clienteId,
                                estoyDentroDeUnTab: true,
                                ocultarClienteResumenHeader: true,
                                onDataChange: () => setRefreshParadas(prev => prev + 1),
                            }}
                        />
                    </article>
                ) : null}
                {detalleTabActiva === "Sensores" ? (
                    <article className="envio-panel">
                        <Crud
                            key={`detalle-envio-sensores-${envioActivo.id}-${refreshSensores}`}
                            headerCrud="Sensores"
                            getRegistros={getEnvioSensor}
                            getRegistrosCount={getEnvioSensorCount}
                            botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                            controlador="Envio Sensor"
                            editarComponente={<EditarEnvioSensor />}
                            columnas={columnasEnvioSensorDetalle}
                            filtradoBase={{ envioId: envioActivo.id }}
                            deleteRegistro={deleteEnvioSensor}
                            cargarDatosInicialmente={true}
                            mostrarEdicionEnModal={true}
                            modalEdicionProps={{
                                showHeader: false,
                                className: "neat-crud-edit-dialog envio-registro-dialog",
                                style: { width: "min(760px, 92vw)" },
                            }}
                            onDataChange={() => setRefreshSensores(prev => prev + 1)}
                            editarComponenteParametrosExtra={{
                                envioId: envioActivo.id,
                                estoyDentroDeUnTab: true,
                                ocultarClienteResumenHeader: true,
                                onDataChange: () => setRefreshSensores(prev => prev + 1),
                            }}
                        />
                    </article>
                ) : null}
                {detalleTabActiva === "Operarios" ? (
                    <article className="envio-panel">
                        <Crud
                            key={`detalle-envio-operarios-${envioActivo.id}-${envioActivo.clienteId}-${refreshOperarios}`}
                            headerCrud="Operarios"
                            getRegistros={getEnvioOperario}
                            getRegistrosCount={getEnvioOperarioCount}
                            botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
                            controlador="Operarios"
                            editarComponente={<EditarEnvioOperario />}
                            columnas={columnasOperarioDetalle}
                            filtradoBase={{ envioId: envioActivo.id }}
                            deleteRegistro={deleteEnvioOperario}
                            cargarDatosInicialmente={true}
                            mostrarEdicionEnModal={true}
                            modalEdicionProps={{
                                showHeader: false,
                                className: "neat-crud-edit-dialog envio-registro-dialog",
                                style: { width: "min(760px, 92vw)" },
                            }}
                            onDataChange={() => setRefreshOperarios(prev => prev + 1)}
                            editarComponenteParametrosExtra={{
                                envioId: envioActivo.id,
                                clienteId: envioActivo.clienteId,
                                estoyDentroDeUnTab: true,
                                ocultarClienteResumenHeader: true,
                                onDataChange: () => setRefreshOperarios(prev => prev + 1),
                            }}
                        />
                    </article>
                ) : null}
                {detalleTabActiva === "Informe" ? <EnvioInformeTab envio={envioActivo} informePallets={informePallets} onAbrirModal={abrirModalDetalleRegistro} /> : null}
            </section>

            <Dialog
                visible={modalDetalleRegistro.visible}
                onHide={cerrarModalDetalleRegistro}
                modal
                draggable={false}
                resizable={false}
                showHeader={false}
                className="neat-crud-edit-dialog envio-registro-dialog"
                style={{ width: "min(760px, 92vw)" }}
            >
                <EnvioDetalleRegistroModal
                    accion={modalDetalleRegistro.accion}
                    seccion={modalDetalleRegistro.seccion}
                    registro={modalDetalleRegistro.registro}
                    onCerrar={cerrarModalDetalleRegistro}
                />
            </Dialog>
        </div>
    );
};

const construirResumenTop = (envio, contenido = [], sensores = []) => {
    const unidades = contenido.reduce((acumulado, item) => acumulado + Number(item.cantidad || item.unidades || 0), 0) || 1640;
    const cargaKg = contenido.reduce((acumulado, item) => acumulado + Number(item.pesoTotal || 0), 0) || 860;
    const skus = contenido.length || 4;
    const sensorTemperatura = sensores.find((sensor) => String(sensor.nombreSensor || sensor.nombre || "").toLowerCase().includes("temp"));
    const temperaturaMax = sensorTemperatura?.valor ? `${sensorTemperatura.valor}` : "8.2 C";

    return {
        temperaturaMax,
        distancia: "684 km",
        carga: `${cargaKg} kg`,
        unidades,
        skus,
    };
};

const construirMovimientosFallback = () => ([
    { id: 1, fechaEspanol: "05 may · 06:13", nombreSensor: "GPS-01", evento: "Paso por punto intermedio", valor: "71 km/h", gps: "40.7227, 0.5568", severidad: "info" },
    { id: 2, fechaEspanol: "05 may · 07:30", nombreSensor: "GPS-01", evento: "Parada tecnica", valor: "0 km/h", gps: "41.0227, 1.3068", severidad: "info" },
    { id: 3, fechaEspanol: "05 may · 08:47", nombreSensor: "GPS-01", evento: "Reanudacion de marcha", valor: "43 km/h", gps: "41.3227, -2.9431", severidad: "info" },
    { id: 4, fechaEspanol: "05 may · 09:04", nombreSensor: "TMP-01", evento: "Excursion de temperatura", valor: "10.4 C", gps: "41.6227, -2.1931", severidad: "alerta" },
    { id: 5, fechaEspanol: "05 may · 10:21", nombreSensor: "GPS-01", evento: "Llegada a destino", valor: "0 km/h", gps: "41.9227, -1.4431", severidad: "ok" },
    { id: 6, fechaEspanol: "05 may · 11:38", nombreSensor: "HUM-01", evento: "Lectura de humedad", valor: "57 %", gps: "40.2227, -0.6931", severidad: "info" },
    { id: 7, fechaEspanol: "05 may · 12:55", nombreSensor: "TMP-01", evento: "Lectura de temperatura", valor: "4.5 C", gps: "40.5227, 0.0569", severidad: "info" },
    { id: 8, fechaEspanol: "05 may · 13:12", nombreSensor: "BAT-01", evento: "Pallet activado", valor: "97 %", gps: "40.8227, 0.8070", severidad: "info" },
    { id: 9, fechaEspanol: "05 may · 14:29", nombreSensor: "PESO-01", evento: "Carga registrada", valor: "447 kg", gps: "41.1227, 1.5570", severidad: "info" },
    { id: 10, fechaEspanol: "05 may · 15:46", nombreSensor: "GPS-01", evento: "Salida desde origen", valor: "31 km/h", gps: "41.4227, -2.6930", severidad: "ok" },
    { id: 11, fechaEspanol: "05 may · 16:03", nombreSensor: "GPS-01", evento: "Paso por punto intermedio", valor: "86 km/h", gps: "41.7227, -1.9430", severidad: "info" },
    { id: 12, fechaEspanol: "05 may · 17:20", nombreSensor: "GPS-01", evento: "Parada tecnica", valor: "0 km/h", gps: "40.0227, -1.1929", severidad: "info" },
    { id: 13, fechaEspanol: "05 may · 18:37", nombreSensor: "GPS-01", evento: "Reanudacion de marcha", valor: "33 km/h", gps: "40.3228, -0.4429", severidad: "info" },
    { id: 14, fechaEspanol: "05 may · 19:54", nombreSensor: "TMP-01", evento: "Excursion de temperatura", valor: "8.9 C", gps: "40.6228, 0.3071", severidad: "alerta" },
]);

const construirParadasFallback = (envio) => ([
    { id: 1, tipo: "Origen", direccion: envio?.origenRuta || "C/ Mayor 10, Madrid", gps: "43.0000, -3.0000", eta: "4 may 2026 06:00", real: "4 may 2026 06:00", detencion: "12 min", estado: "Completada" },
    { id: 2, tipo: "Transito", direccion: "Centro logistico Zaragoza", gps: "41.6488, -0.8891", eta: "5 may 10:20", real: "5 may 10:34", detencion: "28 min", estado: "Completada" },
    { id: 3, tipo: "Transito", direccion: "Plataforma cross-dock Lleida", gps: "41.6176, 0.6200", eta: "5 may 13:05", real: "5 may 13:11", detencion: "18 min", estado: "Completada" },
    { id: 4, tipo: "Destino", direccion: envio?.destinoRuta || "Av. Diagonal 20, Barcelona", gps: "45.0000, 2.0000", eta: "6 may 2026 11:36", real: "—", detencion: "—", estado: "Pendiente" },
]);

const construirSensoresFallback = () => ([
    { id: 1, orden: "01", nombreSensor: "Temperatura", codigo: "TMP-01", valor: "3.2 C", estado: "OK", color: "verde" },
    { id: 2, orden: "02", nombreSensor: "Humedad", codigo: "HUM-01", valor: "55 %", estado: "OK", color: "azul" },
    { id: 3, orden: "03", nombreSensor: "Bateria", codigo: "BAT-01", valor: "49 %", estado: "OK", color: "gris" },
]);

const InfoItem = ({ label, value, mono = false }) => (
    <div className="envio-info-item">
        <small>{label}</small>
        <strong className={mono ? "envio-mono" : undefined}>{value}</strong>
    </div>
);

const EnvioKpiCard = ({ label, value, helper, warning = false }) => (
    <article className="envio-kpi-card">
        <small>{label}</small>
        <strong className={warning ? "envio-warning-text" : undefined}>{value}</strong>
        <span>{helper}</span>
    </article>
);

const EnvioResumenTab = ({ envio, sensores = [], paradas = [], resumenTop }) => (
    <div className="envio-resumen-grid">
        <article className="envio-panel envio-ruta-panel">
            <h3>Ruta</h3>
            <div className="envio-ruta-mapa">
                <div className="envio-ruta-linea"></div>
                {paradas.slice(0, 4).map((parada, index) => (
                    <div key={parada.id || index} className={`envio-ruta-punto envio-ruta-punto-${parada.tipo?.toLowerCase() || "transito"}`} style={{ left: `${8 + index * 28}%`, top: `${58 - (index % 2) * 12}%` }}>
                        <span>{parada.direccion}</span>
                    </div>
                ))}
            </div>
            <div className="envio-ruta-legend">
                <em><b className="origen"></b>Origen</em>
                <em><b className="transito"></b>Parada</em>
                <em><b className="destino"></b>Destino</em>
            </div>
        </article>

        <article className="envio-panel">
            <h3>Sensores activos</h3>
            <div className="envio-sensor-chart-list">
                {sensores.map((sensor) => (
                    <div className="envio-sensor-chart-row" key={sensor.id || sensor.codigo}>
                        <div className="envio-sensor-chart-head">
                            <strong><b className={`envio-sensor-dot ${sensor.color || "verde"}`}></b>{sensor.nombreSensor || sensor.nombre}</strong>
                            <span>{sensor.codigo || "TMP-01"}</span>
                            <strong>{sensor.valor}</strong>
                        </div>
                        <div className="envio-sensor-chart-track">
                            <i className={`envio-sensor-chart-wave ${sensor.color || "verde"}`}></i>
                        </div>
                    </div>
                ))}
            </div>
        </article>

        <article className="envio-panel">
            <h3>Linea de tiempo</h3>
            <div className="envio-timeline">
                {paradas.map((parada) => (
                    <div className="envio-timeline-item" key={parada.id}>
                        <b className={`envio-timeline-dot ${parada.tipo?.toLowerCase() || "transito"}`}></b>
                        <div>
                            <strong>{parada.direccion}</strong>
                            <span>{parada.gps}</span>
                            <small>ETA: {parada.eta} &nbsp;&nbsp; Real: {parada.real} &nbsp;&nbsp; Detencion: {parada.detencion}</small>
                        </div>
                    </div>
                ))}
            </div>
        </article>

        <article className="envio-panel">
            <h3>Pallet asignado</h3>
            <div className="envio-pallet-card">
                <div className="envio-pallet-visual"></div>
                <div className="envio-pallet-copy">
                    <h4>NEAT-00001</h4>
                    <small>NEAT One</small>
                    <div><span>Bateria</span><strong>49%</strong></div>
                    <div><span>Firmware</span><strong>v3.4.1</strong></div>
                    <div><span>Ultima senal</span><strong>hace 2 min</strong></div>
                    <div><span>Conexion</span><strong>4G + Bluetooth</strong></div>
                </div>
            </div>
        </article>
    </div>
);

const EnvioConfiguracionTab = () => (
    <div className="envio-config-grid">
        <article className="envio-panel">
            <div className="envio-panel-head">
                <h3>Telemetria</h3>
                <span>Captura, guardado y envio de datos del pallet</span>
            </div>
            <div className="envio-config-list">
                <ConfigRow label="Guardado de datos" helper="Cada cuanto se registran y almacenan las lecturas en el pallet.">
                    <div className="envio-inline-inputs"><strong>10</strong><span>min</span></div>
                </ConfigRow>
                <ConfigRow label="Envio de datos" helper="Frecuencia con la que el pallet vuelca los datos al servidor.">
                    <div className="envio-inline-inputs"><strong>12</strong><span>h</span></div>
                </ConfigRow>
                <ConfigRow label="Modo ahorro de energia" helper="Activo: guardado y envio usan los valores fijos del modo ahorro.">
                    <ToggleFake active />
                </ConfigRow>
            </div>
        </article>

        <article className="envio-panel">
            <h3>Alertas y notificaciones</h3>
            <div className="envio-config-stack">
                <ConfigRow label="Canales activos">
                    <div className="envio-chip-group">
                        <span>Email</span><span>SMS</span><span>WhatsApp</span>
                    </div>
                </ConfigRow>
                <ConfigRow label="Destinatarios" helper="Separados por coma.">
                    <div className="envio-pill-input">logistica@neat.com, cliente@empresa.com</div>
                </ConfigRow>
            </div>
        </article>

        <article className="envio-panel">
            <div className="envio-panel-head">
                <h3>Reglas y umbrales</h3>
                <button type="button">+ Anadir regla</button>
            </div>
            <table className="envio-mini-table">
                <thead>
                    <tr><th>Parametro</th><th>Min</th><th>Max</th><th>Unidad</th><th>Accion</th></tr>
                </thead>
                <tbody>
                    <tr><td>Temperatura</td><td>2</td><td>8</td><td>C</td><td><div className="envio-chip-group"><span>Email</span><span className="mute">SMS</span><span className="mute">WhatsApp</span></div></td></tr>
                    <tr><td>Humedad</td><td>45</td><td>75</td><td>%</td><td><div className="envio-chip-group"><span>Email</span><span className="mute">SMS</span><span className="mute">WhatsApp</span></div></td></tr>
                    <tr><td>Apertura no prevista</td><td>—</td><td>—</td><td>—</td><td><div className="envio-chip-group"><span className="mute">Email</span><span>SMS</span><span className="mute">WhatsApp</span></div></td></tr>
                    <tr><td>Retraso ETA</td><td>—</td><td>30</td><td>min</td><td><div className="envio-chip-group"><span>Email</span><span className="mute">SMS</span><span className="mute">WhatsApp</span></div></td></tr>
                </tbody>
            </table>
        </article>

        <article className="envio-panel">
            <h3>Operativa y formato</h3>
            <div className="envio-config-list">
                <ConfigRow label="Unidad de temperatura">
                    <div className="envio-segmented"><span className="active">C</span><span>F</span></div>
                </ConfigRow>
                <ConfigRow label="Zona horaria">
                    <div className="envio-pill-input">Europe/Madrid</div>
                </ConfigRow>
                <ConfigRow label="Idioma de notificaciones">
                    <div className="envio-pill-input">Espanol</div>
                </ConfigRow>
                <ConfigRow label="Cierre automatico tras entrega">
                    <ToggleFake active />
                </ConfigRow>
            </div>
        </article>

        <article className="envio-panel envio-documentos-panel">
            <div className="envio-panel-head">
                <h3>Documentacion adjunta</h3>
                <button type="button">Adjuntar archivo</button>
            </div>
            <div className="envio-document-list">
                {documentosEnvioFallback.map((documento) => (
                    <div className="envio-document-item" key={documento.nombre}>
                        <b>{documento.tipo}</b>
                        <div><strong>{documento.nombre}</strong><small>{documento.tamano}</small></div>
                        <button type="button">{documento.accion}</button>
                    </div>
                ))}
            </div>
            <div className="envio-document-footer">
                <button type="button">Restablecer valores por defecto</button>
            </div>
        </article>
    </div>
);

const EnvioContenidoTab = ({ contenido = [], resumenTop, onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Contenido del pallet</h3>
            <div className="envio-head-actions">
                <span><strong>{resumenTop.unidades}</strong> unidades &nbsp;&nbsp; <strong>{resumenTop.carga}</strong> &nbsp;&nbsp; <strong>{resumenTop.skus}</strong> SKU</span>
                <button type="button" onClick={() => onAbrirModal("Contenido", "nuevo")}>Nuevo registro</button>
            </div>
        </div>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>SKU</th><th>Producto</th><th>Peso/ud.</th><th>Unidades</th><th>Peso total</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {contenido.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center text-gray-600">No hay contenido registrado para este envio.</td>
                    </tr>
                ) : null}
                {contenido.map((item) => (
                    <tr key={item.id || item.referencia}>
                        <td>{item.sku || item.referencia || item.codigoPallet || "-"}</td>
                        <td><strong>{item.nombreProducto || item.nombre || "-"}</strong></td>
                        <td>{item.pesoKgs != null ? `${item.pesoKgs} g` : "-"}</td>
                        <td>{item.cantidad ?? "-"}</td>
                        <td>{item.pesoTotal != null ? `${item.pesoTotal} kg` : "-"}</td>
                        <td><ActionButtons seccion="Contenido" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
);

const EnvioMovimientosTab = ({ movimientos = [], onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Movimientos</h3>
            <button type="button" onClick={() => onAbrirModal("Movimientos", "nuevo")}>Nuevo registro</button>
        </div>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>Fecha</th><th>Evento</th><th>Sensor</th><th>Valor</th><th>GPS</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {movimientos.map((item) => (
                    <tr key={item.id}>
                        <td className="envio-mono">{item.fechaEspanol}</td>
                        <td><span className={`envio-event-dot ${item.severidad}`}></span>{item.evento || item.nombreSensor || "-"}</td>
                        <td>{item.nombreSensor}</td>
                        <td><strong>{item.valor}</strong></td>
                        <td><a href="#">{item.gps}</a></td>
                        <td><ActionButtons seccion="Movimientos" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
);

const EnvioParadasTab = ({ paradas = [], onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Paradas</h3>
            <button type="button" onClick={() => onAbrirModal("Paradas", "nuevo")}>Nuevo registro</button>
        </div>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>Tipo</th><th>Punto</th><th>Coordenadas</th><th>ETA</th><th>Hora real</th><th>Detencion</th><th>Estado</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {paradas.map((item) => (
                    <tr key={item.id}>
                        <td><span className={`envio-badge ${item.tipo?.toLowerCase()}`}>{item.tipo?.toUpperCase()}</span></td>
                        <td><strong>{item.direccion}</strong></td>
                        <td className="envio-mono">{item.gps}</td>
                        <td>{item.eta}</td>
                        <td>{item.real}</td>
                        <td>{item.detencion}</td>
                        <td><span className={item.estado === "Pendiente" ? "envio-warning-text" : "envio-ok-text"}>{item.estado === "Pendiente" ? "Pendiente" : "✓ Completada"}</span></td>
                        <td><ActionButtons seccion="Paradas" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
);

const EnvioSensoresTab = ({ sensores = [], onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Sensores</h3>
            <button type="button" onClick={() => onAbrirModal("Sensores", "nuevo")}>Nuevo registro</button>
        </div>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>#</th><th>Tipo de sensor</th><th>ID</th><th>Valor</th><th>Estado</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {sensores.map((item, index) => (
                    <tr key={item.id || index}>
                        <td>{item.orden || String(index + 1).padStart(2, "0")}</td>
                        <td><span className={`envio-sensor-dot ${item.color || "verde"}`}></span><strong>{item.nombreSensor || item.nombre}</strong></td>
                        <td className="envio-mono">{item.codigo || item.tipoSensorId || "-"}</td>
                        <td><strong>{item.valor}</strong></td>
                        <td className="envio-ok-text">{item.estado || "OK"}</td>
                        <td><ActionButtons seccion="Sensores" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
);

const EnvioOperariosTab = ({ operarios = [], onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Operarios</h3>
            <button type="button" onClick={() => onAbrirModal("Operarios", "nuevo")}>Nuevo registro</button>
        </div>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>Rol</th><th>Operario</th><th>Telefono</th><th>Permiso</th><th>Turno</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {operarios.map((item) => (
                    <tr key={`${item.rol}-${item.nombre}`}>
                        <td>{item.rol}</td>
                        <td><div className="envio-operario-cell"><span>{item.iniciales}</span><strong>{item.nombre}</strong></div></td>
                        <td className="envio-mono">{item.telefono}</td>
                        <td>{item.permiso}</td>
                        <td>{item.turno}</td>
                        <td><ActionButtons seccion="Operarios" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
);

const EnvioInformeTab = ({ envio, informePallets = [], onAbrirModal }) => (
    <article className="envio-panel">
        <div className="envio-panel-head">
            <h3>Informe del envio</h3>
            <div className="envio-inline-actions"><button type="button" onClick={() => onAbrirModal("Informe", "nuevo")}>Nuevo registro</button><button type="button">Imprimir</button><button type="button">Descargar PDF</button></div>
        </div>
        <h4 className="envio-subtitle">PALLETS DEL ENVIO</h4>
        <table className="envio-detail-table">
            <thead>
                <tr>
                    <th>Nº pallet</th><th>Eventos guardados</th><th>Eventos enviados</th><th>Alarmas</th><th>Bateria</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {informePallets.map((item, index) => (
                    <tr key={`${item.pallet}-${index}`}>
                        <td><strong>{item.pallet}</strong></td>
                        <td>{item.eventosGuardados}</td>
                        <td>{item.eventosEnviados}</td>
                        <td className="envio-danger-text">{item.totalAlarmas}</td>
                        <td><div className="envio-battery"><i style={{ width: `${Number(item.bateriaActual || 49)}%` }}></i><strong>{item.bateriaActual}%</strong></div></td>
                        <td><ActionButtons seccion="Informe" registro={item} onAbrirModal={onAbrirModal} /></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="envio-informe-summary">
            <h3>Resumen ejecutivo</h3>
            <p>Envio {envio.numero || "ENV-00432"} de Logistica del Mediterraneo desde {envio.origenRuta || "C/ Mayor 10, Madrid"} hasta {envio.destinoRuta || "Av. Diagonal 20, Barcelona"}, transportado en el pallet NEAT-00001. Estado actual: <span>En transito</span>.</p>
            <p>Distancia recorrida: <strong>684 km</strong> en <strong>12 h 04 min</strong>. Carga total: <strong>860 kg</strong> distribuida en <strong>4 SKU</strong>.</p>
        </div>

        <div className="envio-informe-kpis">
            <div><small>Cadena de frio</small><strong className="envio-danger-text">1 desviaciones</strong><span>Rango 2–8 C · pico 8.2 C · valle 2.4 C</span></div>
            <div><small>Puntualidad</small><strong className="envio-ok-text">Dentro de plazo</strong><span>ETA 6 may 2026 · 11:36</span></div>
            <div><small>Calidad documental</small><strong className="envio-ok-text">4 / 4 documentos</strong><span>CMR, albaran, lista carga, pre-check</span></div>
        </div>

        <div className="envio-informe-lista">
            <small>RECOMENDACIONES</small>
            <ul>
                <li>Revisar la calibracion del termostato del compartimento. 1 lecturas se salieron del rango objetivo.</li>
                <li>Programar mantenimiento preventivo del pallet NEAT-0001 tras este viaje.</li>
            </ul>
        </div>

        <div className="envio-informe-footer">
            <span>Generado automaticamente por NEAT · 19/6/2026, 16:23:53</span>
            <span>v3.4.1 · informe-ENV-00432.pdf</span>
        </div>
    </article>
);

const ConfigRow = ({ label, helper, children }) => (
    <div className="envio-config-row">
        <div>
            <strong>{label}</strong>
            {helper ? <span>{helper}</span> : null}
        </div>
        {children}
    </div>
);

const ToggleFake = ({ active = false }) => (
    <span className={active ? "envio-toggle envio-toggle-active" : "envio-toggle"}></span>
);

const EnvioDetalleRegistroModal = ({ accion, seccion, registro, onCerrar }) => {
    const tituloAccion = accion === "nuevo" ? "Nuevo registro" : accion === "editar" ? "Editar registro" : "Ver registro";
    const camposRegistro = registro && typeof registro === "object" ? Object.entries(registro).filter(([clave]) => clave !== "id") : [];

    //
    //Mostramos un modal generico para todas las subtabs internas
    //de envios, evitando crear un formulario distinto por bloque
    //
    return (
        <section className="envio-registro-modal">
            <header className="envio-registro-modal-head">
                <div>
                    <h2>{tituloAccion}</h2>
                    <p>{seccion}</p>
                </div>
            </header>

            <div className="envio-registro-modal-body">
                {camposRegistro.length > 0 ? camposRegistro.map(([clave, valor]) => (
                    <label className="envio-registro-modal-field" key={clave}>
                        <span>{formatearLabelModal(clave)}</span>
                        <InputText value={valor == null ? "" : String(valor)} readOnly={accion === "ver"} />
                    </label>
                )) : (
                    <div className="envio-registro-modal-empty">
                        <p>Prepara los datos del nuevo registro de {seccion.toLowerCase()}.</p>
                    </div>
                )}
            </div>

            <footer className="envio-registro-modal-footer">
                <Button label="Cancelar" text onClick={onCerrar} />
                <Button label={accion === "ver" ? "Cerrar" : "Guardar cambios"} onClick={onCerrar} />
            </footer>
        </section>
    );
};

const formatearLabelModal = (clave = "") => clave
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (texto) => texto.toUpperCase());

const ActionButtons = ({ seccion, registro, onAbrirModal }) => (
    <div className="envio-action-buttons">
        <button type="button" onClick={() => onAbrirModal(seccion, "ver", registro)}><i className="pi pi-eye" aria-hidden="true"></i></button>
        <button type="button" onClick={() => onAbrirModal(seccion, "editar", registro)}><i className="pi pi-pencil" aria-hidden="true"></i></button>
        <button type="button"><i className="pi pi-trash" aria-hidden="true"></i></button>
    </div>
);

export default Empresa;
export { camposPendientesBack, EmpresaEnvioDetalle };

const EmpresaAdminDetalle = ({ idEditar, editable, puedeEditar, setIdEditar, rowData = [], setRegistroResult, setRegistroEditarFlag }) => {
    const [empresaActiva, setEmpresaActiva] = useState(null);
    const [empresaEdicion, setEmpresaEdicion] = useState(null);
    const [metricas, setMetricas] = useState({ pallets: 0, usuarios: 0, eventos24h: 0, enviosEnCurso: 0 });
    const [contactos, setContactos] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [hayEdicionEnPestana, setHayEdicionEnPestana] = useState(false);
    const [tabActiva, setTabActiva] = useState("Resumen");

    useEffect(() => {
        const empresaSeleccionada = rowData.find((empresa) => empresa.id === idEditar);
        setEmpresaActiva(empresaSeleccionada ? normalizarEmpresa(empresaSeleccionada) : null);
    }, [idEditar, rowData]);

    useEffect(() => {
        if (empresaActiva) {
            setEmpresaEdicion({ ...empresaActiva });
        }
    }, [empresaActiva]);

    useEffect(() => {
        setModoEdicion(Boolean(editable && idEditar > 0));
        setRegistroEditarFlag?.(false);
    }, [editable, idEditar, setRegistroEditarFlag]);

    useEffect(() => {
        if (!empresaActiva?.id) return;

        const whereEmpresa = { and: { empresaId: empresaActiva.id } };
        Promise.all([
            getEmpresaPalletCount(JSON.stringify(whereEmpresa)).catch(() => ({ count: 0 })),
            getVistaUsuariosCount(JSON.stringify(whereEmpresa)).catch(() => ({ count: 0 })),
            getEnvioCount(JSON.stringify(whereEmpresa)).catch(() => ({ count: 0 })),
            getVistaUsuarios(JSON.stringify({
                limit: 3,
                offset: 0,
                order: "nombre ASC",
                where: whereEmpresa,
            })).catch(() => []),
        ]).then(([pallets, usuarios, envios, usuariosEmpresa]) => {
            setMetricas({
                pallets: extraerCount(pallets),
                usuarios: extraerCount(usuarios),
                eventos24h: empresaActiva?.eventos24h ?? 0,
                enviosEnCurso: extraerCount(envios),
            });
            setContactos(Array.isArray(usuariosEmpresa)
                ? usuariosEmpresa.map((usuario) => ({
                    nombre: usuario.nombre || usuario.mail || "Usuario",
                    email: usuario.mail || "",
                    rol: usuario.nombreRol || "usuario",
                }))
                : []);
        });
    }, [empresaActiva?.eventos24h, empresaActiva?.id]);

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
        return new Date(empresaActiva.fechaCreacion).toLocaleDateString("es-ES");
    }, [empresaActiva?.fechaCreacion]);

    const confirmarSalidaSinGuardar = (continuar) => {
        confirmDialog({
            message: "Los datos introducidos se perderan si sales de esta edicion.",
            header: "Salir sin guardar?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Continuar",
            rejectLabel: "Cancelar",
            accept: continuar,
        });
    };

    const volverAlListado = () => {
        if (modoEdicion || hayEdicionEnPestana) {
            confirmarSalidaSinGuardar(() => {
                setHayEdicionEnPestana(false);
                setIdEditar(null);
            });
            return;
        }
        setIdEditar(null);
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

    const guardarEmpresa = async () => {
        if (!empresaEdicion?.id) return;

        setGuardando(true);
        const payload = {
            codigo: empresaEdicion.codigo,
            nombre: empresaEdicion.nombre,
            estado: empresaEdicion.estado,
            plan: empresaEdicion.plan,
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
        setEmpresaActiva(normalizarEmpresa({ ...empresaActiva, ...empresaEdicion }));
        setModoEdicion(false);
        setGuardando(false);
        setRegistroResult("editado");
    };

    const cancelarEdicionEmpresa = () => {
        confirmarSalidaSinGuardar(() => {
            setHayEdicionEnPestana(false);
            setEmpresaEdicion({ ...empresaActiva });
            setModoEdicion(false);
        });
    };

    const renderCrudTab = () => {
        if (!empresaActiva?.id) return null;

        const extra = { empresaId: empresaActiva.id, estoyDentroDeUnTab: true };
        const filtroEmpresa = { empresaId: empresaActiva.id };
        const propsEdicionTab = { onModoEdicionChange: setHayEdicionEnPestana };
        const propsModalTab = {
            mostrarEdicionEnModal: true,
            modalEdicionProps: {
                showHeader: false,
                closable: false,
                closeOnEscape: false,
                dismissableMask: false,
                style: { width: "min(900px, 92vw)" },
            },
        };

        switch (tabActiva) {
            case "Envios":
                return <Crud key={`envios-${empresaActiva.id}`} headerCrud="Envios" getRegistros={getEnvio} getRegistrosCount={getEnvioCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} accionEntradaPorFila="ver" controlador="Envios" editarComponente={<EmpresaEnvioDetalle />} columnas={columnasEnvio} filtradoBase={filtroEmpresa} deleteRegistro={deleteEnvio} editarComponenteParametrosExtra={extra} {...propsEdicionTab} />;
            case "Usuarios":
                return <Crud key={`usuarios-${empresaActiva.id}`} headerCrud="Usuarios de empresa" getRegistros={getVistaUsuarios} getRegistrosCount={getVistaUsuariosCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} controlador="Usuarios" editarComponente={<EditarUsuario />} columnas={columnasUsuariosEmpresa} filtradoBase={filtroEmpresa} deleteRegistro={deleteUsuario} editarComponenteParametrosExtra={extra} {...propsEdicionTab} {...propsModalTab} />;
            case "Puntos de entrega":
                return <Crud key={`puntos-entrega-${empresaActiva.id}`} headerCrud="Puntos de entrega" getRegistros={getCliente} getRegistrosCount={getClienteCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} controlador="Clientes" editarComponente={<EditarCliente />} columnas={columnasPuntosEntrega} filtradoBase={filtroEmpresa} deleteRegistro={deleteCliente} editarComponenteParametrosExtra={extra} {...propsEdicionTab} />;
            case "Productos":
                return <Crud key={`productos-${empresaActiva.id}`} headerCrud="Productos" getRegistros={getProducto} getRegistrosCount={getProductoCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} controlador="Productos" editarComponente={<EditarProducto />} columnas={columnasProducto} filtradoBase={filtroEmpresa} deleteRegistro={deleteProducto} editarComponenteParametrosExtra={extra} {...propsEdicionTab} {...propsModalTab} />;
            case "Sensores activos":
                return <Crud key={`sensores-${empresaActiva.id}`} headerCrud="Sensores de empresa" getRegistros={getEmpresaSensor} getRegistrosCount={getEmpresaSensorCount} botones={["nuevo", "ver", "editar", "eliminar"]} controlador="Sensores activos" editarComponente={<EditarEmpresaSensor />} columnas={columnasEmpresaSensor} filtradoBase={filtroEmpresa} deleteRegistro={deleteEmpresaSensor} editarComponenteParametrosExtra={extra} {...propsEdicionTab} {...propsModalTab} />;
            case "Pallets asignados":
                return <PalletsAsignadosEmpresa key={`pallets-${empresaActiva.id}`} empresaId={empresaActiva.id} />;
            case "Carrocerias":
                return <Crud key={`carrocerias-${empresaActiva.id}`} headerCrud="Tipos de Carroceria" getRegistros={getTipoCarroceria} getRegistrosCount={getTipoCarroceriaCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} controlador="Tipos de Carroceria" editarComponente={<EditarTipoCarroceria />} columnas={columnasCarroceria} filtradoBase={filtroEmpresa} deleteRegistro={deleteTipoCarroceria} editarComponenteParametrosExtra={extra} {...propsEdicionTab} {...propsModalTab} />;
            case "Tipos de transporte":
                return <Crud key={`transportes-${empresaActiva.id}`} headerCrud="Tipos de Transporte" getRegistros={getTipoTransporte} getRegistrosCount={getTipoTransporteCount} botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]} controlador="Tipo Transporte" editarComponente={<EditarTipoTransporte />} columnas={columnasCatalogosGlobales} filtradoBase={filtroEmpresa} deleteRegistro={deleteTipoTransporte} editarComponenteParametrosExtra={extra} {...propsEdicionTab} {...propsModalTab} />;
            case "Configuracion de eventos":
                return <Crud key={`eventos-${empresaActiva.id}`} headerCrud="Configuracion de eventos" getRegistros={getEventoConfiguracion} getRegistrosCount={getEventoConfiguracionCount} botones={[]} controlador="Eventos Configuracion" editarComponente={<div />} columnas={columnasEventoConfiguracion} deleteRegistro={() => {}} editarComponenteParametrosExtra={{ estoyDentroDeUnTab: true }} {...propsEdicionTab} />;
            default:
                return <EmpresaResumen key={`resumen-${empresaActiva.id}`} metricas={metricas} empresa={empresaActiva} contactos={contactos} />;
        }
    };

    if (!empresaActiva) {
        return <div className="empresa-profile-card empresa-empty-state">No se ha encontrado la empresa seleccionada.</div>;
    }

    if (modoEdicion && empresaEdicion) {
        return (
            <div className="empresa-profile-shell">
                <ConfirmDialog />
                <Dialog
                    visible={true}
                    onHide={cancelarEdicionEmpresa}
                    modal
                    draggable={false}
                    resizable={false}
                    closable={false}
                    closeOnEscape={false}
                    dismissableMask={false}
                    showHeader={false}
                    className="neat-crud-edit-dialog empresa-edit-main-dialog"
                    style={{ width: "min(1180px, 92vw)" }}
                >
                    <section className="empresa-profile-card empresa-edit-screen">
                        <div className="empresa-edit-screen-header">
                            <button className="empresa-back-button" type="button" onClick={cancelarEdicionEmpresa}>
                                <i className="pi pi-chevron-left" aria-hidden="true"></i>
                                Clientes
                            </button>
                            <div>
                                <h1>Editar cliente</h1>
                                <p>Modifica la ficha de <strong>{empresaActiva.nombre}</strong>. Los cambios se aplican al guardar.</p>
                            </div>
                        </div>

                        <EditarDatosEmpresa empresa={empresaEdicion} setEmpresa={setEmpresaEdicion} estadoGuardando={guardando} />

                        <footer className="empresa-edit-footer empresa-edit-screen-footer">
                            <span></span>
                            <div className="empresa-edit-footer-actions">
                                <Button label="Cancelar" outlined onClick={cancelarEdicionEmpresa} />
                                <Button label={guardando ? "Guardando..." : "Guardar cambios"} outlined onClick={guardarEmpresa} disabled={guardando} />
                            </div>
                        </footer>
                    </section>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="empresa-profile-shell">
            <ConfirmDialog />
            <section className="empresa-profile-card">
                <div className="empresa-profile-topbar">
                    <button className="empresa-back-button" type="button" onClick={volverAlListado}>
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
                            <span className={`empresa-pill ${getEstadoMeta(empresaActiva.estado).className}`}>{empresaActiva.estado}</span>
                            <span className="empresa-pill empresa-pill-blue">{empresaActiva.plan}</span>
                        </div>
                        <p>{empresaActiva.codigo} · {empresaActiva.nombreComercial || empresaActiva.nombre} · ALTA {fechaAlta}</p>
                    </div>
                    <div className="empresa-header-actions">
                        {puedeEditar ? (
                        <Button label="Editar" icon="pi pi-pencil" outlined onClick={() => setModoEdicion(true)} />
                        ) : null}
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
                        <button key={tab} className={tabActiva === tab ? "empresa-tab empresa-tab-active" : "empresa-tab"} type="button" onClick={() => cambiarTab(tab)}>
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
