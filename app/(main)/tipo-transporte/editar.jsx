"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postTipoTransporte, patchTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosTipoTransporte from "./EditarDatosTipoTransporte";
import { useIntl } from 'react-intl';

const EditarTipoTransporte = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [tipoTransporte, setTipoTransporte] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
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

    const validaciones = async () => {
        const validaNombre = tipoTransporte.nombre === undefined || tipoTransporte.nombre === "";
        const validaOrden = tipoTransporte.orden === undefined || tipoTransporte.orden === null || tipoTransporte.orden === "";
        return (!validaNombre && !validaOrden)
    }

    const guardarTipoTransporte = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...tipoTransporte };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
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
                        <EditarDatosTipoTransporte
                            tipoTransporte={tipoTransporte}
                            setTipoTransporte={setTipoTransporte}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarTipoTransporte}
                                    className="mr-2"
                                    disabled={estadoGuardandoBoton}
                                />
                            )}
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarTipoTransporte;