"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
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

            setPallets(Array.isArray(respuestaPallets) ? respuestaPallets : []);
            setAsignaciones(Array.isArray(respuestaAsignaciones) ? respuestaAsignaciones : []);
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
        const asignadoAOtraEmpresa = asignacionesPallet.some(
            (asignacion) => asignacion?.empresaId !== empresaId
        );

        return {
            asignadoAEmpresaActual,
            asignadoAOtraEmpresa,
            asignacionesEmpresaActual
        };
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

            <div className="mb-3">
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

            <div className="border-1 surface-border border-round overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr className="surface-100">
                            <th className="text-left p-3">{intl.formatMessage({ id: "Asignado" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Orden" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Código" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Alias" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Medidas" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Modelo" })}</th>
                            <th className="text-left p-3">{intl.formatMessage({ id: "Fecha de impresión" })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {palletsFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-4 text-600">
                                    {intl.formatMessage({ id: "No hay pallets disponibles" })}
                                </td>
                            </tr>
                        ) : (
                            palletsFiltrados.map((pallet) => {
                                const { asignadoAEmpresaActual, asignadoAOtraEmpresa } = obtenerEstadoPallet(pallet);
                                const deshabilitado = palletsPendientes.has(pallet.id) || (!asignadoAEmpresaActual && asignadoAOtraEmpresa);
                                const estiloTexto = deshabilitado && !asignadoAEmpresaActual ? "text-500" : "";

                                return (
                                    <tr key={pallet.id} className="border-bottom-1 surface-border">
                                        <td className="p-3">
                                            <Checkbox
                                                inputId={`empresa-pallet-${empresaId}-${pallet.id}`}
                                                checked={asignadoAEmpresaActual}
                                                disabled={deshabilitado}
                                                onChange={(evento) => handleTogglePallet(pallet, evento.checked)}
                                            />
                                        </td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerTexto(pallet.orden)}</td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerTexto(pallet.codigo ?? `Pallet ${pallet.id}`)}</td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerTexto(pallet.alias)}</td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerTexto(pallet.medidas)}</td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerTexto(pallet.modelo)}</td>
                                        <td className={`p-3 ${estiloTexto}`}>{obtenerFecha(pallet.fechaImpresion)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PalletsAsignadosEmpresa;
