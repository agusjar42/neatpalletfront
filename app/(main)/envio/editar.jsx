"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvio, patchEnvio } from "@/app/api-endpoints/envio";
import { getTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import { getTipoCarroceria } from "@/app/api-endpoints/tipo-carroceria";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosEnvio from  "./EditarDatosEnvio";
import { useIntl } from 'react-intl';

const EditarEnvio = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [envio, setEnvio] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [tiposTransporte, setTiposTransporte] = useState([]);
    const [tiposCarroceria, setTiposCarroceria] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar tipos de transporte y carrocería disponibles
            const dataTiposTransporte = await getTipoTransporte('{}');
            const dataTiposCarroceria = await getTipoCarroceria('{}');
            setTiposTransporte(dataTiposTransporte || []);
            setTiposCarroceria(dataTiposCarroceria || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvio(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaDescripcion = envio.descripcion === undefined || envio.descripcion === "";
        return (!validaDescripcion)
    }

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _envio = { ...envio };
        const esTrue = valor === true ? 'S' : 'N';
        _envio[`${nombreInputSwitch}`] = esTrue;
        setEnvio(_envio);
    };

    const guardarEnvio = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...envio };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                
                const nuevoRegistro = await postEnvio(objGuardar);

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
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                delete objGuardar['fechaModificacion'];
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvio(objGuardar.id, objGuardar);
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
                        <h2>{header} {(intl.formatMessage({ id: 'Envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvio
                            envio={envio}
                            setEnvio={setEnvio}
                            estadoGuardando={estadoGuardando}
                            manejarCambioInputSwitch={manejarCambioInputSwitch}
                            tiposTransporte={tiposTransporte}
                            tiposCarroceria={tiposCarroceria}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvio}
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

export default EditarEnvio;