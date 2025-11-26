"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { postOperario, patchOperario } from "@/app/api-endpoints/operario";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosOperario from "./EditarDatosOperario";
import { useIntl } from 'react-intl';

const EditarOperario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, clienteId, estoyDentroDeUnTab, onDataChange }) => {
    const toast = useRef(null);
    const [operario, setOperario] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setOperario(registro);
            } else if (clienteId) {
                // Si estamos creando uno nuevo y tenemos clienteId, lo asignamos
                setOperario({ ...emptyRegistro, clienteId: clienteId });
            }
        };
        fetchData();
    }, [idEditar, rowData, clienteId, emptyRegistro]);

    const validaciones = async () => {
        // Validaciones básicas
        const validaNombre = operario.nombre === undefined || operario.nombre === "";
        const validaClienteId = operario.clienteId === undefined || operario.clienteId === null;
        
        // Si existe algún campo vacío entonces no se puede guardar
        return (!validaNombre && !validaClienteId)
    }

    const guardarOperario = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre
            let objGuardar = { ...operario };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                delete objGuardar.clienteNombre;
                objGuardar['usuCreacion'] = usuarioActual;
                
                // Hacemos el insert del registro
                const nuevoRegistro = await postOperario(objGuardar);

                //Si se crea el registro mostramos el toast
                if (nuevoRegistro?.id) {
                    toast.current.show({ severity: 'success', summary: intl.formatMessage({ id: 'Éxito' }), detail: intl.formatMessage({ id: 'Operario creado correctamente' }), life: 3000 });
                    setRegistroResult(nuevoRegistro);
                    if (onDataChange) onDataChange();
                    setIdEditar(nuevoRegistro.id);
                    setOperario(nuevoRegistro);
                } else {
                    toast.current.show({ severity: 'error', summary: intl.formatMessage({ id: 'Error' }), detail: intl.formatMessage({ id: 'Error al crear operario' }), life: 3000 });
                }
            } else {
                // Elimino y añado los campos que no se necesitan para el update
                delete objGuardar.clienteNombre;
                delete objGuardar.fechaCreacion;
                delete objGuardar.fechaModificacion;
                delete objGuardar.usuCreacion;
                objGuardar['usuModificacion'] = usuarioActual;

                // Hacemos el update del registro
                const registroActualizado = await patchOperario(idEditar, objGuardar);

                //Si se crea el registro mostramos el toast
                if (registroActualizado?.id) {
                    toast.current.show({ severity: 'success', summary: intl.formatMessage({ id: 'Éxito' }), detail: intl.formatMessage({ id: 'Operario actualizado correctamente' }), life: 3000 });
                    setRegistroResult(registroActualizado);
                    if (onDataChange) onDataChange();
                } else {
                    toast.current.show({ severity: 'error', summary: intl.formatMessage({ id: 'Error' }), detail: intl.formatMessage({ id: 'Error al actualizar operario' }), life: 3000 });
                }
            }
        } else {
            toast.current.show({ severity: 'error', summary: intl.formatMessage({ id: 'Error' }), detail: intl.formatMessage({ id: 'Debe completar todos los campos obligatorios' }), life: 3000 });
        }
        setEstadoGuardandoBoton(false);
        setEstadoGuardando(false);
    };

    const cancelarEdicion = () => {
        setIdEditar(0);
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid operario">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Operario' })).toLowerCase()}</h2>
                        <EditarDatosOperario
                            operario={operario}
                            setOperario={setOperario}
                            estadoGuardando={estadoGuardando}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarOperario}
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

export default EditarOperario;