"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { getEmpresas } from "@/app/api-endpoints/empresa";
import { deleteEmpresaPallet, getEmpresaPallet, postEmpresaPallet } from "@/app/api-endpoints/empresa-pallet";
import { getEnvio } from "@/app/api-endpoints/envio";
import { getEnvioPallet } from "@/app/api-endpoints/envio-pallet-usado";
import { getPallet } from "@/app/api-endpoints/pallet";
import { formatearFechaDate, getUsuarioSesion } from "@/app/utility/Utils";
import { useIntl } from "react-intl";
import { tieneUsuarioPermiso } from "@/app/components/shared/componentes";
import PalletsAsignadosIntro from "./PalletsAsignadosIntro";
import ClienteResumenHeader from "@/app/components/shared/ClienteResumenHeader";

    const VALOR_TODAS_EMPRESAS = "__TODAS__";

    const PalletsAsignadosGlobal = () => {
    const intl = useIntl();
    const toast = useRef(null);
    const usuarioSesion = getUsuarioSesion();
    const esUsuarioAdmin = usuarioSesion?.usuarioAdmin === "S";
    const empresaSesionId = Number(usuarioSesion?.empresaId ?? 0) || null;
    const [pallets, setPallets] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState(
        esUsuarioAdmin ? VALOR_TODAS_EMPRESAS : (empresaSesionId ? String(empresaSesionId) : VALOR_TODAS_EMPRESAS)
    );
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);
    const [palletsPendientes, setPalletsPendientes] = useState(new Set());
    const [tienePermiso, setTienePermiso] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(100);

    const puedeCargarDatosProtegidos = () => {
        if (typeof window === "undefined") {
            return false;
        }
        const isLoggingOut = sessionStorage.getItem("np_logging_out") === "1";
        const hasSession = Boolean(localStorage.getItem("userDataNeatpallet"));
        return !isLoggingOut && hasSession;
    };

    const empresaSeleccionadaNumerica = useMemo(() => {
        if (empresaSeleccionadaId === VALOR_TODAS_EMPRESAS) {
            return null;
        }
        return Number(empresaSeleccionadaId);
    }, [empresaSeleccionadaId]);

    const marcarPalletPendiente = (palletId, pendiente) => {
        setPalletsPendientes((prev) => {
            const next = new Set(prev);
            if (pendiente) {
                next.add(palletId);
            } else {
                next.delete(palletId);
            }
            return next;
        });
    };

    const cargarDatos = useCallback(async () => {
        if (!puedeCargarDatosProtegidos()) {
            return;
        }
        setCargando(true);
        try {
            const [respuestaPallets, respuestaEmpresas, respuestaAsignaciones] = await Promise.all([
                getPallet(JSON.stringify({ order: ["orden ASC", "codigo ASC"] })),
                getEmpresas(JSON.stringify({ order: ["orden ASC", "nombre ASC"] })),
                getEmpresaPallet(JSON.stringify({}))
            ]);

            setPallets(Array.isArray(respuestaPallets) ? respuestaPallets : []);
            setEmpresas(Array.isArray(respuestaEmpresas) ? respuestaEmpresas : []);
            setAsignaciones(Array.isArray(respuestaAsignaciones) ? respuestaAsignaciones : []);
        } catch (error) {
            console.error("Error cargando pallets por empresa", error);
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: intl.formatMessage({ id: "No se pudieron cargar los pallets asignados" }),
                life: 3000
            });
        } finally {
            setCargando(false);
        }
    }, [intl]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    useEffect(() => {
        if (!esUsuarioAdmin && empresaSesionId) {
            setEmpresaSeleccionadaId(String(empresaSesionId));
        }
    }, [empresaSesionId, esUsuarioAdmin]);

    useEffect(() => {
        const verificarPermiso = async () => {
            if (!puedeCargarDatosProtegidos()) {
                return;
            }
            const permiso = await tieneUsuarioPermiso('Neatpallet', 'Pallets Asignados', 'Actualizar');
            setTienePermiso(permiso);
        };
        verificarPermiso();
    }, []);

    const empresaPorId = useMemo(() => {
        const mapa = new Map();
        for (const empresa of empresas) {
            if (empresa?.id !== undefined && empresa?.id !== null) {
                mapa.set(String(empresa.id), empresa);
            }
        }
        return mapa;
    }, [empresas]);

    const estadoPorPallet = useMemo(() => {
        const mapa = new Map();

        for (const asignacion of asignaciones) {
            const palletId = asignacion?.palletId;
            if (palletId === undefined || palletId === null) {
                continue;
            }

            const key = String(palletId);
            if (!mapa.has(key)) {
                mapa.set(key, {
                    asignaciones: [],
                    asignacionActual: null
                });
            }

            const estadoActual = mapa.get(key);
            estadoActual.asignaciones.push(asignacion);

            const idAsignacionActual = Number(estadoActual.asignacionActual?.id ?? 0);
            const idAsignacionNueva = Number(asignacion?.id ?? 0);
            if (!estadoActual.asignacionActual || idAsignacionNueva >= idAsignacionActual) {
                estadoActual.asignacionActual = asignacion;
            }
        }

        return mapa;
    }, [asignaciones]);

    const obtenerEstadoPallet = useCallback((pallet) => {
        const key = String(pallet?.id);
        const estado = estadoPorPallet.get(key);
        const asignacionesPallet = estado?.asignaciones ?? [];
        const asignacionActual = estado?.asignacionActual ?? null;
        const empresaActualId = asignacionActual?.empresaId ?? null;
        const empresaActual = empresaActualId !== null ? empresaPorId.get(String(empresaActualId)) : null;
        const asignacionesEmpresaSeleccionada = empresaSeleccionadaNumerica === null
            ? []
            : asignacionesPallet.filter((asignacion) => Number(asignacion?.empresaId) === empresaSeleccionadaNumerica);

        return {
            asignacionesPallet,
            asignacionActual,
            empresaActualId,
            nombreEmpresaActual: empresaActual?.nombre ?? "-",
            asignacionesEmpresaSeleccionada,
            asignadoEmpresaSeleccionada: empresaSeleccionadaNumerica !== null && Number(empresaActualId) === empresaSeleccionadaNumerica,
            tieneAsignacion: Boolean(asignacionActual)
        };
    }, [empresaPorId, estadoPorPallet, empresaSeleccionadaNumerica]);

    const opcionesEmpresas = useMemo(() => {
        const empresasDisponibles = esUsuarioAdmin
            ? empresas
            : empresas.filter((empresa) => Number(empresa?.id) === empresaSesionId);

        return [
            ...(esUsuarioAdmin ? [{
                label: intl.formatMessage({ id: "Todas las empresas" }),
                value: VALOR_TODAS_EMPRESAS
            }] : []),
            ...empresasDisponibles.map((empresa) => ({
                label: empresa?.nombre ?? `Empresa ${empresa?.id}`,
                value: String(empresa?.id)
            }))
        ];
    }, [empresas, empresaSesionId, esUsuarioAdmin, intl]);

    const palletsFiltrados = useMemo(() => {
        const termino = (textoBusqueda ?? "").trim().toLowerCase();
        const palletsOrdenados = [...pallets].sort((a, b) => {
            const ordenA = a?.orden ?? Number.MAX_SAFE_INTEGER;
            const ordenB = b?.orden ?? Number.MAX_SAFE_INTEGER;

            if (ordenA !== ordenB) {
                return ordenA - ordenB;
            }

            return `${a?.codigo ?? ""}`.localeCompare(`${b?.codigo ?? ""}`);
        });

        return palletsOrdenados.filter((pallet) => {
            const coincideTexto = !termino || `${pallet?.codigo ?? ""}`.toLowerCase().includes(termino);
            if (!coincideTexto) {
                return false;
            }

            const { empresaActualId } = obtenerEstadoPallet(pallet);

            if (!esUsuarioAdmin) {
                return empresaSesionId !== null && Number(empresaActualId) === empresaSesionId;
            }

            if (empresaSeleccionadaNumerica === null) {
                return true;
            }

            return empresaActualId === null || Number(empresaActualId) === empresaSeleccionadaNumerica;
        });
    }, [empresaSeleccionadaNumerica, empresaSesionId, esUsuarioAdmin, obtenerEstadoPallet, pallets, textoBusqueda]);

    const obtenerTexto = (valor) => {
        if (valor === undefined || valor === null || valor === "") {
            return "-";
        }
        return `${valor}`;
    };

    const obtenerFecha = (fecha) => {
        if (!fecha) {
            return "-";
        }

        const fechaDate = new Date(fecha);
        if (Number.isNaN(fechaDate.getTime())) {
            return "-";
        }
        return formatearFechaDate(fechaDate);
    };

    const parsearFechaSoloDia = (fecha) => {
        if (!fecha) {
            return null;
        }

        if (fecha instanceof Date && !Number.isNaN(fecha.getTime())) {
            return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        }

        if (typeof fecha !== "string") {
            return null;
        }

        const fechaNormalizada = fecha.trim();
        if (!fechaNormalizada) {
            return null;
        }

        const matchIso = fechaNormalizada.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (matchIso) {
            const year = Number(matchIso[1]);
            const month = Number(matchIso[2]) - 1;
            const day = Number(matchIso[3]);
            return new Date(year, month, day);
        }

        const matchEs = fechaNormalizada.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (matchEs) {
            const day = Number(matchEs[1]);
            const month = Number(matchEs[2]) - 1;
            const year = Number(matchEs[3]);
            return new Date(year, month, day);
        }

        const parsedDate = new Date(fechaNormalizada);
        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    };

    const tieneFechaLlegadaEnTransito = (fechaLlegada) => {
        const fechaLlegadaDia = parsearFechaSoloDia(fechaLlegada);
        if (!fechaLlegadaDia) {
            return false;
        }

        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

        // Regla solicitada: bloquear cuando fechaLlegada sea superior a hoy.
        return fechaLlegadaDia > inicioHoy;
    };

    const palletEstaEnTransito = useCallback(async (palletId) => {
        const enviosPallet = await getEnvioPallet(JSON.stringify({
            where: {
                and: {
                    id: palletId
                }
            }
        }));

        const registrosEnvioPallet = Array.isArray(enviosPallet) ? enviosPallet : [];
        if (registrosEnvioPallet.length === 0) {
            return false;
        }

        const envioIdsPendientes = new Set();

        for (const envioPallet of registrosEnvioPallet) {
            if (
                tieneFechaLlegadaEnTransito(envioPallet?.fechaLlegada) ||
                tieneFechaLlegadaEnTransito(envioPallet?.fechaLlegadaEspanol)
            ) {
                return true;
            }

            if (envioPallet?.envioId !== undefined && envioPallet?.envioId !== null) {
                envioIdsPendientes.add(Number(envioPallet.envioId));
            }
        }

        for (const envioId of envioIdsPendientes) {
            const respuestaEnvio = await getEnvio(JSON.stringify({
                where: {
                    and: {
                        id: envioId
                    }
                }
            }));
            const envio = Array.isArray(respuestaEnvio) ? respuestaEnvio[0] : null;

            if (
                tieneFechaLlegadaEnTransito(envio?.fechaLlegada) ||
                tieneFechaLlegadaEnTransito(envio?.fechaLlegadaEspanol)
            ) {
                return true;
            }
        }

        return false;
    }, []);

    const estaDeshabilitado = (pallet) => {
        if (palletsPendientes.has(pallet.id)) {
            return true;
        }

        const { tieneAsignacion } = obtenerEstadoPallet(pallet);
        if (empresaSeleccionadaNumerica === null) {
            return !tieneAsignacion;
        }

        return false;
    };

    const handleTogglePallet = async (pallet, checked) => {
        const palletId = pallet.id;
        const {
            asignacionesPallet,
            asignacionesEmpresaSeleccionada
        } = obtenerEstadoPallet(pallet);
        const asignacionesConId = asignacionesPallet.filter((asignacion) => asignacion?.id !== undefined && asignacion?.id !== null);

        try {
            marcarPalletPendiente(palletId, true);

            if (!checked) {
                const estaEnTransito = await palletEstaEnTransito(palletId);
                if (estaEnTransito) {
                    toast.current?.show({
                        severity: "warn",
                        summary: intl.formatMessage({ id: "Advertencia" }),
                        detail: intl.formatMessage({ id: "No se puede desasignar el pallet porque esta en transito" }),
                        life: 4000
                    });
                    return;
                }
            }

            if (empresaSeleccionadaNumerica === null) {
                if (checked) {
                    toast.current?.show({
                        severity: "warn",
                        summary: intl.formatMessage({ id: "Advertencia" }),
                        detail: intl.formatMessage({ id: "Seleccione una empresa para poder asociar pallets" }),
                        life: 3000
                    });
                    return;
                }

                await Promise.all(asignacionesConId.map((asignacion) => deleteEmpresaPallet(asignacion.id)));
            } else if (checked) {
                const asignacionesOtrasEmpresas = asignacionesConId.filter(
                    (asignacion) => Number(asignacion?.empresaId) !== empresaSeleccionadaNumerica
                );
                const duplicadosEmpresaSeleccionada = asignacionesEmpresaSeleccionada.slice(1);

                await Promise.all([
                    ...asignacionesOtrasEmpresas.map((asignacion) => deleteEmpresaPallet(asignacion.id)),
                    ...duplicadosEmpresaSeleccionada
                        .filter((asignacion) => asignacion?.id !== undefined && asignacion?.id !== null)
                        .map((asignacion) => deleteEmpresaPallet(asignacion.id))
                ]);

                if (asignacionesEmpresaSeleccionada.length === 0) {
                    await postEmpresaPallet({
                        empresaId: empresaSeleccionadaNumerica,
                        palletId
                    });
                }
            } else {
                const asignacionesAEliminar = asignacionesEmpresaSeleccionada
                    .filter((asignacion) => asignacion?.id !== undefined && asignacion?.id !== null);
                await Promise.all(asignacionesAEliminar.map((asignacion) => deleteEmpresaPallet(asignacion.id)));
            }

            await cargarDatos();
        } catch (error) {
            console.error("Error actualizando asignacion de pallet", error);

            const esConflicto = error?.response?.status === 409;
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: esConflicto
                    ? intl.formatMessage({ id: "El pallet ya esta asignado a otra empresa" })
                    : intl.formatMessage({ id: "No se pudo actualizar la asignacion del pallet" }),
                life: 3000
            });

            await cargarDatos();
        } finally {
            marcarPalletPendiente(palletId, false);
        }
    };

    const renderCabeceraTabla = () => (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-2">
            <div className="flex flex-column md:flex-row md:align-items-center gap-2 w-full md:w-auto">
                <h5 className="m-0">{intl.formatMessage({ id: "Pallets asignados" })}</h5>
                {esUsuarioAdmin ? (
                    <Dropdown
                        className="w-full md:w-20rem"
                        value={empresaSeleccionadaId}
                        options={opcionesEmpresas}
                        onChange={(evento) => setEmpresaSeleccionadaId(evento.value)}
                        placeholder={intl.formatMessage({ id: "Empresas" })}
                    />
                ) : (
                    <span className="neat-log-type-badge neat-log-type-green">
                        {opcionesEmpresas[0]?.label ?? intl.formatMessage({ id: "Mi empresa" })}
                    </span>
                )}
            </div>

            <span className="p-input-icon-left w-full md:w-20rem">
                <i className="pi pi-search" />
                <InputText
                    className="w-full"
                    value={textoBusqueda}
                    onChange={(evento) => setTextoBusqueda(evento.target.value)}
                    placeholder={intl.formatMessage({ id: "Buscar por codigo de pallet" })}
                />
            </span>
        </div>
    );

    const manejarCambioDePagina = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const paginatorTemplate = {
        layout: "CurrentPageReport RowsPerPageDropdown",
        CurrentPageReport: (options) => (
            <span className="neat-paginator-report">
                {intl.formatMessage({ id: "Mostrando" })} {options.last} {intl.formatMessage({ id: "de" })} {options.totalRecords} (total {options.totalRecords})
            </span>
        ),
        RowsPerPageDropdown: (options) => {
            const rowOptions = [25, 50, 100, 200];
            const currentRows = Number(options.value) || rows;
            const currentPage = options.currentPage || 0;
            const totalPages = options.totalPages || 1;
            const hasMultiplePages = totalPages > 1;
            const goToPage = (page) => manejarCambioDePagina({ first: page * currentRows, rows: currentRows });

            return (
                <div className="neat-rows-per-page">
                    {hasMultiplePages && (
                        <div className="neat-page-nav-group">
                            <button
                                type="button"
                                className="neat-page-nav"
                                disabled={currentPage <= 0}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                className="neat-page-nav"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                    <span>Por pagina:</span>
                    {rowOptions.map((rowCount) => (
                        <button
                            key={rowCount}
                            type="button"
                            className={options.value === rowCount ? "active" : ""}
                            onClick={(event) => options.onChange({ originalEvent: event, value: rowCount })}
                        >
                            {rowCount}
                        </button>
                    ))}
                </div>
            );
        }
    };

    const asignadoBodyTemplate = (pallet) => {
        const { asignadoEmpresaSeleccionada, tieneAsignacion } = obtenerEstadoPallet(pallet);
        const checked = empresaSeleccionadaNumerica === null ? tieneAsignacion : asignadoEmpresaSeleccionada;

        return (
            <Checkbox
                inputId={`empresa-pallet-global-${pallet.id}`}
                checked={checked}
                disabled={estaDeshabilitado(pallet)}
                onChange={(evento) => handleTogglePallet(pallet, evento.checked)}
            />
        );
    };

    const nombreEmpresaBodyTemplate = (pallet) => {
        const { nombreEmpresaActual } = obtenerEstadoPallet(pallet);
        return <span>{obtenerTexto(nombreEmpresaActual)}</span>;
    };

    const textoBodyTemplate = (campo) => (pallet) => (
        <span>{obtenerTexto(pallet[campo])}</span>
    );

    const codigoBodyTemplate = (pallet) => (
        <span>{obtenerTexto(pallet.codigo ?? `Pallet ${pallet.id}`)}</span>
    );

    const fechaImpresionBodyTemplate = (pallet) => (
        <span>{obtenerFecha(pallet.fechaImpresion)}</span>
    );

    if (cargando) {
        return (
            <div className="flex justify-content-center align-items-center p-4">
                <ProgressSpinner style={{ width: "42px", height: "42px" }} strokeWidth="8" />
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <ClienteResumenHeader />
            </div>
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} position="top-right" />
                    {esUsuarioAdmin && (
                        <PalletsAsignadosIntro
                            pallets={pallets}
                            empresas={empresas}
                            estadoPorPallet={estadoPorPallet}
                        />
                    )}

                    <DataTable
                        className="datatable-responsive pallets-asignados-table"
                        dataKey="id"
                        value={palletsFiltrados}
                        header={renderCabeceraTabla()}
                        rowHover
                        paginator
                        first={first}
                        rows={rows}
                        onPage={manejarCambioDePagina}
                        rowsPerPageOptions={[25, 50, 100, 200]}
                        paginatorTemplate={paginatorTemplate}
                        emptyMessage={<span>{intl.formatMessage({ id: "No se han encontrado registros" })}</span>}
                    >
                        {esUsuarioAdmin && tienePermiso && (
                            <Column
                                field="asignado"
                                header={intl.formatMessage({ id: "Asignado" })}
                                body={asignadoBodyTemplate}
                                headerStyle={{ minWidth: "8rem" }}
                            />
                        )}
                        <Column
                            field="nombreEmpresa"
                            header={intl.formatMessage({ id: "Nombre empresa" })}
                            body={nombreEmpresaBodyTemplate}
                            headerStyle={{ minWidth: "14rem" }}
                        />
                        <Column
                            field="orden"
                            header={intl.formatMessage({ id: "Orden" })}
                            body={textoBodyTemplate("orden")}
                            headerStyle={{ minWidth: "8rem" }}
                        />
                        <Column
                            field="codigo"
                            header={intl.formatMessage({ id: "Codigo" })}
                            body={codigoBodyTemplate}
                            headerStyle={{ minWidth: "12rem" }}
                        />
                        <Column
                            field="alias"
                            header={intl.formatMessage({ id: "Alias" })}
                            body={textoBodyTemplate("alias")}
                            headerStyle={{ minWidth: "12rem" }}
                        />
                        <Column
                            field="medidas"
                            header={intl.formatMessage({ id: "Medidas" })}
                            body={textoBodyTemplate("medidas")}
                            headerStyle={{ minWidth: "12rem" }}
                        />
                        <Column
                            field="modelo"
                            header={intl.formatMessage({ id: "Modelo" })}
                            body={textoBodyTemplate("modelo")}
                            headerStyle={{ minWidth: "12rem" }}
                        />
                        <Column
                            field="fechaImpresion"
                            header={intl.formatMessage({ id: "Fecha de impresion" })}
                            body={fechaImpresionBodyTemplate}
                            headerStyle={{ minWidth: "12rem" }}
                        />
                    </DataTable>

                    <style jsx global>{`
                        .pallets-asignados-table .p-datatable-tbody > tr:hover {
                            background: #d8f5df !important;
                            transition: background-color 0.15s ease-in-out;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default PalletsAsignadosGlobal;
