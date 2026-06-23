"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { getTipoCarroceria, postTipoCarroceria, patchTipoCarroceria } from "@/app/api-endpoints/empresa-tipo-carroceria";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosTipoCarroceria from "./EditarDatosTipoCarroceria";
import { useIntl } from 'react-intl';

const EditarTipoCarroceria = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, empresaId }) => {
    const toast = useRef(null);
    const [tipoCarroceria, setTipoCarroceria] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setTipoCarroceria(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    useEffect(() => {
        const cargarTipos = async () => {
            const empresaIdActual = empresaId ?? getUsuarioSesion()?.empresaId;
            const tipos = await getTipoCarroceria();
            const tiposFiltrados = (tipos || []).filter((item) => {
                const mismaEmpresa = !empresaIdActual || item?.empresaId === empresaIdActual;
                const activo = item?.activoSn === "S" || item?.activoSn == null;
                return mismaEmpresa && activo;
            });
            const nombres = Array.from(new Set(tiposFiltrados.map((item) => item.nombre).filter(Boolean)));
            setTiposDisponibles(nombres);
        };

        cargarTipos();
    }, [empresaId]);

    useEffect(() => {
        if (tipoCarroceria?.nombre && !tiposDisponibles.includes(tipoCarroceria.nombre)) {
            setTiposDisponibles((prev) => [...prev, tipoCarroceria.nombre]);
        }
    }, [tipoCarroceria?.nombre, tiposDisponibles]);

    const validaciones = async () => {
        const validaNombre = tipoCarroceria.nombre === undefined || tipoCarroceria.nombre === "";
        const validaOrden = tipoCarroceria.orden === undefined || tipoCarroceria.orden === null || tipoCarroceria.orden === "";
        return (!validaNombre && !validaOrden)
    }

    const guardarTipoCarroceria = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...tipoCarroceria };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = empresaId ?? getUsuarioSesion()?.empresaId;
                
                const nuevoRegistro = await postTipoCarroceria(objGuardar);

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
                delete objGuardar.fechaModificacion;
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchTipoCarroceria(objGuardar.id, objGuardar);
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
                        <h2>{header} {(intl.formatMessage({ id: 'Tipo Carroceria' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Define el codigo, tipo, capacidad, estado y orden de la carroceria.</p>
                        <EditarDatosTipoCarroceria
                            tipoCarroceria={tipoCarroceria}
                            setTipoCarroceria={setTipoCarroceria}
                            estadoGuardando={estadoGuardando}
                            tiposDisponibles={tiposDisponibles}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarTipoCarroceria}
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

export default EditarTipoCarroceria;
