"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { postCliente, patchCliente } from "@/app/api-endpoints/cliente";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosCliente from "./EditarDatosCliente";
import { useIntl } from 'react-intl';

const EditarCliente = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [cliente, setCliente] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setCliente(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        // Validaciones básicas
        const validaNombre = cliente.nombre === undefined || cliente.nombre === "";
        
        // Si existe algún campo vacío entonces no se puede guardar
        return (!validaNombre)
    }

    const guardarCliente = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre
            let objGuardar = { ...cliente };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                delete objGuardar.empresaNombre;
                objGuardar['usuCreacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                
                // Hacemos el insert del registro
                const nuevoRegistro = await postCliente(objGuardar);

                //Si se crea el registro mostramos el toast
                if (nuevoRegistro?.id) {
                    toast.current.show({ severity: 'success', summary: intl.formatMessage({ id: 'Éxito' }), detail: intl.formatMessage({ id: 'Cliente creado correctamente' }), life: 3000 });
                    setRegistroResult(nuevoRegistro);
                    setIdEditar(nuevoRegistro.id);
                    setCliente(nuevoRegistro);
                } else {
                    toast.current.show({ severity: 'error', summary: intl.formatMessage({ id: 'Error' }), detail: intl.formatMessage({ id: 'Error al crear cliente' }), life: 3000 });
                }
            } else {
                // Elimino y añado los campos que no se necesitan para el update
                delete objGuardar.empresaNombre;
                delete objGuardar.fechaCreacion;
                delete objGuardar.fechaModificacion;
                delete objGuardar.usuCreacion;
                objGuardar['usuModificacion'] = usuarioActual;

                // Hacemos el update del registro
                const registroActualizado = await patchCliente(idEditar, objGuardar);

                //Si se crea el registro mostramos el toast
                if (registroActualizado?.id) {
                    toast.current.show({ severity: 'success', summary: intl.formatMessage({ id: 'Éxito' }), detail: intl.formatMessage({ id: 'Cliente actualizado correctamente' }), life: 3000 });
                    setRegistroResult(registroActualizado);
                } else {
                    toast.current.show({ severity: 'error', summary: intl.formatMessage({ id: 'Error' }), detail: intl.formatMessage({ id: 'Error al actualizar cliente' }), life: 3000 });
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
            <div className="grid Cliente">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Cliente' })).toLowerCase()}</h2>
                        <EditarDatosCliente
                            cliente={cliente}
                            setCliente={setCliente}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarCliente}
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

export default EditarCliente;