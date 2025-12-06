"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { postOperario, patchOperario } from "@/app/api-endpoints/operario/index.js";
import { getCliente } from "@/app/api-endpoints/cliente/index.js";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosOperario from "./EditarDatosOperario";
import { useIntl } from 'react-intl';

const EditarOperario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, clienteId, estoyDentroDeUnTab, onDataChange }) => {
    const toast = useRef(null);
    const [operario, setOperario] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [clientes, setClientes] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar clientes disponibles
            const dataClientes = await getCliente(JSON.stringify({
                                        where: {
                                            and: {
                                                empresaId: getUsuarioSesion()?.empresaId
                                            }
                                        }
                                    }));
            setClientes(dataClientes || []);

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
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //
        // Si estamos dentro de un tab y tenemos un clienteId, lo asignamos
        //
        if (estoyDentroDeUnTab && clienteId) {
            operario.clienteId = clienteId;
        }
        // Validaciones básicas
        const validaNombre = operario.nombre === undefined || operario.nombre === "";
        const validaClienteId = operario.clienteId === undefined || operario.clienteId === null;
        let validaEmail = false;
        
        if (operario.email && !regexEmail.test(operario.email)) {
            validaEmail = true;
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }

        // Si existe algún campo vacío entonces no se puede guardar
        return (!validaNombre && !validaClienteId && !validaEmail)
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
                    setRegistroResult("insertado");
                    setIdEditar(null);
                    // Llamar al callback para actualizar conteos
                    if (onDataChange) {
                        onDataChange();
                    }
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }
            } else {
                // Elimino y añado los campos que no se necesitan para el update
                delete objGuardar.clienteNombre;
                delete objGuardar.fechaCreacion;
                delete objGuardar.fechaModificacion;
                delete objGuardar.usuCreacion;
                objGuardar['usuModificacion'] = usuarioActual;

                // Hacemos el update del registro
                await patchOperario(idEditar, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
                // Llamar al callback para actualizar conteos
                if (onDataChange) {
                    onDataChange();
                }
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
                            clientes={clientes}
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