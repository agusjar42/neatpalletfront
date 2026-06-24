"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useIntl } from 'react-intl';
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { postEnvioOperario, patchEnvioOperario } from "@/app/api-endpoints/envio-operario";
import EditarDatosEnvioOperario from "./EditarDatosEnvioOperario";

const EditarEnvioOperario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, editable, envioId, clienteId, estoyDentroDeUnTab, onDataChange }) => {
    const toast = useRef(null);
    const intl = useIntl();
    const [envioOperario, setEnvioOperario] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);

    useEffect(() => {
        if (idEditar !== 0) {
            const registro = rowData.find((element) => element.id === idEditar);
            setEnvioOperario(registro || emptyRegistro);
            return;
        }

        setEnvioOperario({
            ...emptyRegistro,
            envioId: envioId || "",
            operarioId: "",
        });
    }, [emptyRegistro, envioId, idEditar, rowData]);

    const validaciones = async () => {
        //
        //Si estamos dentro de un tab, el envio es el activo del detalle
        //
        if (estoyDentroDeUnTab && envioId) {
            envioOperario.envioId = envioId;
        }

        const validaEnvioId = envioOperario.envioId === undefined || envioOperario.envioId === null || envioOperario.envioId === "";
        const validaOperarioId = envioOperario.operarioId === undefined || envioOperario.operarioId === null || envioOperario.operarioId === "";

        return !validaEnvioId && !validaOperarioId;
    };

    const guardarEnvioOperario = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);

        if (await validaciones()) {
            let objGuardar = { ...envioOperario };
            const usuarioActual = getUsuarioSesion()?.id;

            //
            //Quitamos columnas de la vista que no pertenecen a la tabla real
            //
            delete objGuardar.nombre;
            delete objGuardar.telefono;
            delete objGuardar.email;
            delete objGuardar.activoSN;
            delete objGuardar.clienteId;
            delete objGuardar.clienteNombre;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar.usuCreacion = usuarioActual;

                const nuevoRegistro = await postEnvioOperario(objGuardar);

                if (nuevoRegistro?.id) {
                    setRegistroResult("insertado");
                    setIdEditar(null);
                    if (onDataChange) onDataChange();
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }
            } else {
                delete objGuardar.fechaCreacion;
                delete objGuardar.fechaModificacion;
                delete objGuardar.usuCreacion;
                objGuardar.usuModificacion = usuarioActual;

                await patchEnvioOperario(objGuardar.id, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
                if (onDataChange) onDataChange();
            }
        } else {
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
        setIdEditar(null);
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid envioOperario">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Operario de envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvioOperario
                            envioOperario={envioOperario}
                            setEnvioOperario={setEnvioOperario}
                            estadoGuardando={estadoGuardando}
                            envioId={envioId}
                            clienteId={clienteId}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                            idEditar={idEditar}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioOperario}
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

export default EditarEnvioOperario;
