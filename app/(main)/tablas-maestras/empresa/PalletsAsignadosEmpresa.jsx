"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { getPallet } from "@/app/api-endpoints/pallet";
import { deleteEmpresaPallet, getEmpresaPallet, postEmpresaPallet } from "@/app/api-endpoints/empresa-pallet";
import { formatearFechaDate } from "@/app/utility/Utils";
import { useIntl } from "react-intl";

const PalletsAsignadosEmpresa = ({ empresaId }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [pallets, setPallets] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);
    const [palletsPendientes, setPalletsPendientes] = useState(new Set());

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
        if (!empresaId) {
            return;
        }

        setCargando(true);
        try {
            const [respuestaPallets, respuestaAsignaciones] = await Promise.all([
                getPallet(JSON.stringify({ order: ["orden ASC", "codigo ASC"] })),
                getEmpresaPallet(JSON.stringify({}))
            ]);

            const asignacionesEmpresa = (Array.isArray(respuestaAsignaciones) ? respuestaAsignaciones : []).filter(
                (asignacion) => Number(asignacion?.empresaId) === Number(empresaId)
            );
            const palletIdsEmpresa = new Set(
                asignacionesEmpresa
                    .map((asignacion) => asignacion?.palletId)
                    .filter((palletId) => palletId !== undefined && palletId !== null)
                    .map((palletId) => String(palletId))
            );
            const palletsEmpresa = (Array.isArray(respuestaPallets) ? respuestaPallets : []).filter((pallet) =>
                palletIdsEmpresa.has(String(pallet?.id))
            );

            setPallets(palletsEmpresa);
            setAsignaciones(asignacionesEmpresa);
        } catch (error) {
            console.error("Error cargando pallets asignados", error);
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: intl.formatMessage({ id: "No se pudieron cargar los pallets asignados" }),
                life: 3000
            });
        } finally {
            setCargando(false);
        }
    }, [empresaId, intl]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const asignacionesPorPallet = useMemo(() => {
        const mapa = new Map();

        for (const asignacion of asignaciones) {
            if (!asignacion?.palletId) {
                continue;
            }

            if (!mapa.has(asignacion.palletId)) {
                mapa.set(asignacion.palletId, []);
            }
            mapa.get(asignacion.palletId).push(asignacion);
        }

        return mapa;
    }, [asignaciones]);

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

        if (!termino) {
            return palletsOrdenados;
        }

        return palletsOrdenados.filter((pallet) => `${pallet?.codigo ?? ""}`.toLowerCase().includes(termino));
    }, [pallets, textoBusqueda]);

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

    const obtenerEstadoPallet = (pallet) => {
        const asignacionesPallet = asignacionesPorPallet.get(pallet.id) ?? [];
        const asignacionesEmpresaActual = asignacionesPallet.filter((asignacion) => asignacion?.empresaId === empresaId);
        const asignadoAEmpresaActual = asignacionesEmpresaActual.length > 0;
        const asignadoAOtraEmpresa = asignacionesPallet.some((asignacion) => asignacion?.empresaId !== empresaId);

        return {
            asignadoAEmpresaActual,
            asignadoAOtraEmpresa,
            asignacionesEmpresaActual
        };
    };

    const estaDeshabilitado = (pallet) => {
        const { asignadoAEmpresaActual, asignadoAOtraEmpresa } = obtenerEstadoPallet(pallet);
        return palletsPendientes.has(pallet.id) || (!asignadoAEmpresaActual && asignadoAOtraEmpresa);
    };

    const claseTextoFila = (pallet) => {
        const { asignadoAEmpresaActual } = obtenerEstadoPallet(pallet);
        return estaDeshabilitado(pallet) && !asignadoAEmpresaActual ? "text-500" : "";
    };

    const handleTogglePallet = async (pallet, checked) => {
        const palletId = pallet.id;
        const { asignacionesEmpresaActual } = obtenerEstadoPallet(pallet);

        try {
            marcarPalletPendiente(palletId, true);

            if (checked) {
                await postEmpresaPallet({
                    empresaId,
                    palletId
                });
            } else {
                const asignacionesConId = asignacionesEmpresaActual.filter((asignacion) => asignacion?.id !== undefined && asignacion?.id !== null);
                await Promise.all(asignacionesConId.map((asignacion) => deleteEmpresaPallet(asignacion.id)));
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
            <h5 className="m-0">{intl.formatMessage({ id: "Pallets asignados a empresa" })}</h5>
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

    const asignadoBodyTemplate = (pallet) => {
        const { asignadoAEmpresaActual } = obtenerEstadoPallet(pallet);

        return (
            <Checkbox
                inputId={`empresa-pallet-${empresaId}-${pallet.id}`}
                checked={asignadoAEmpresaActual}
                disabled={estaDeshabilitado(pallet)}
                onChange={(evento) => handleTogglePallet(pallet, evento.checked)}
            />
        );
    };

    const textoBodyTemplate = (campo) => (pallet) => (
        <span className={claseTextoFila(pallet)}>{obtenerTexto(pallet[campo])}</span>
    );

    const codigoBodyTemplate = (pallet) => (
        <span className={claseTextoFila(pallet)}>{obtenerTexto(pallet.codigo ?? `Pallet ${pallet.id}`)}</span>
    );

    const fechaImpresionBodyTemplate = (pallet) => (
        <span className={claseTextoFila(pallet)}>{obtenerFecha(pallet.fechaImpresion)}</span>
    );

    if (cargando) {
        return (
            <div className="flex justify-content-center align-items-center p-4">
                <ProgressSpinner style={{ width: "42px", height: "42px" }} strokeWidth="8" />
            </div>
        );
    }

    return (
        <div>
            <Toast ref={toast} position="top-right" />

            <DataTable
                className="datatable-responsive"
                dataKey="id"
                value={palletsFiltrados}
                header={renderCabeceraTabla()}
                paginator
                rows={100}
                rowsPerPageOptions={[25, 50, 100, 200]}
                emptyMessage={<span>{intl.formatMessage({ id: "No se han encontrado registros" })}</span>}
            >
                {/*
                <Column
                    field="asignado"
                    header={intl.formatMessage({ id: "Asignado" })}
                    body={asignadoBodyTemplate}
                    headerStyle={{ minWidth: "8rem" }}
                />
                */}
                <Column
                    field="orden"
                    header={intl.formatMessage({ id: "Orden" })}
                    body={textoBodyTemplate("orden")}
                    headerStyle={{ minWidth: "8rem" }}
                />
                <Column
                    field="codigo"
                    header={intl.formatMessage({ id: "Código" })}
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
                    header={intl.formatMessage({ id: "Fecha de impresión" })}
                    body={fechaImpresionBodyTemplate}
                    headerStyle={{ minWidth: "12rem" }}
                />
            </DataTable>
        </div>
    );
};

export default PalletsAsignadosEmpresa;
