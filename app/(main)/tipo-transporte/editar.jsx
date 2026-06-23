"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postTipoTransporte, patchTipoTransporte } from "@/app/api-endpoints/empresa-tipo-transporte";
import { getTipoVehiculo } from "@/app/api-endpoints/tipo-vehiculo";
import { getTipoCategoria } from "@/app/api-endpoints/tipo-categoria";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosTipoTransporte from "./EditarDatosTipoTransporte";
import { useIntl } from 'react-intl';

const EditarTipoTransporte = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, empresaId }) => {
    const toast = useRef(null);
    const [tipoTransporte, setTipoTransporte] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setTipoTransporte(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    useEffect(() => {
        const cargarCatalogos = async () => {
            const [vehiculos, categorias] = await Promise.all([
                getTipoVehiculo(),
                getTipoCategoria(),
            ]);

            const vehiculosActivos = (vehiculos || []).filter((item) => item?.activoSn === "S" || item?.activoSn == null);
            const categoriasActivas = (categorias || []).filter((item) => item?.activoSn === "S" || item?.activoSn == null);

            const vehiculosNormalizados = vehiculosActivos
                .filter((item) => item?.id && item?.nombre)
                .map((item) => ({ label: item.nombre, value: item.id }));
            const categoriasNormalizadas = categoriasActivas
                .filter((item) => item?.id && item?.nombre)
                .map((item) => ({ label: item.nombre, value: item.id }));

            setVehiculosDisponibles(vehiculosNormalizados);
            setCategoriasDisponibles(categoriasNormalizadas);
        };

        cargarCatalogos();
    }, []);

    const validaciones = async () => {
        const validaNombre = tipoTransporte.tipoVehiculoId === undefined || tipoTransporte.tipoVehiculoId === null || tipoTransporte.tipoVehiculoId === "";
        const validaOrden = tipoTransporte.orden === undefined || tipoTransporte.orden === null || tipoTransporte.orden === "";
        return (!validaNombre && !validaOrden)
    }

    const guardarTipoTransporte = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...tipoTransporte };
            const usuarioActual = getUsuarioSesion()?.id;
            delete objGuardar.vehiculo;
            delete objGuardar.categoria;
            delete objGuardar.nombre;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = empresaId ?? getUsuarioSesion()?.empresaId;
                
                const nuevoRegistro = await postTipoTransporte(objGuardar);

                if (nuevoRegistro?.id) {
                    setRegistroResult("insertado");
                    setIdEditar(null);
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }
            } else {
                objGuardar['usuarioModificacion'] = usuarioActual;
                delete objGuardar['fechaModificacion'];
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchTipoTransporte(objGuardar.id, objGuardar);
                setIdEditar(null)
                setRegistroResult("editado");
            }
        }
        else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        setEstadoGuardandoBoton(false);
    };

    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Tipo Transporte' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Define los mismos campos visibles en el crud del tipo de transporte.</p>
                        <EditarDatosTipoTransporte
                            tipoTransporte={tipoTransporte}
                            setTipoTransporte={setTipoTransporte}
                            estadoGuardando={estadoGuardando}
                            vehiculosDisponibles={vehiculosDisponibles}
                            categoriasDisponibles={categoriasDisponibles}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarTipoTransporte}
                                    disabled={estadoGuardandoBoton}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarTipoTransporte;
