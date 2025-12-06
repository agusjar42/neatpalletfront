"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { postLugarParada, patchLugarParada } from "@/app/api-endpoints/lugar-parada/index.js";
import { getCliente } from "@/app/api-endpoints/cliente/index.js";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosLugarParada from "./EditarDatosLugarParada";
import { useIntl } from 'react-intl';

const EditarLugarParada = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, clienteId, estoyDentroDeUnTab, onDataChange }) => {
    const toast = useRef(null);
    const [lugarParada, setLugarParada] = useState(emptyRegistro);
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
                setLugarParada(registro);
            } else if (clienteId) {
                // Si estamos creando uno nuevo y tenemos clienteId, lo asignamos
                setLugarParada({ ...emptyRegistro, clienteId: clienteId });
            }
        };
        fetchData();
    }, [idEditar, rowData, clienteId, emptyRegistro]);

    const validaciones = async () => {
        //
        // Si estamos dentro de un tab y tenemos un clienteId, lo asignamos
        //
        if (estoyDentroDeUnTab && clienteId) {
            lugarParada.clienteId = clienteId;
        }
        // Validaciones básicas
        const validaNombre = lugarParada.nombre === undefined || lugarParada.nombre === "";
        const validaClienteId = lugarParada.clienteId === undefined || lugarParada.clienteId === null;
        
        // Si existe algún campo vacío entonces no se puede guardar
        return (!validaNombre && !validaClienteId)
    }

    const guardarLugarParada = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre
            let objGuardar = { ...lugarParada };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                delete objGuardar.clienteNombre;
                objGuardar['usuCreacion'] = usuarioActual;
                
                // Hacemos el insert del registro
                const nuevoRegistro = await postLugarParada(objGuardar);

                //Si se crea el registro mostramos el toast
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
                // Elimino y añado los campos que no se necesitan para el update
                delete objGuardar.clienteNombre;
                delete objGuardar.fechaCreacion;
                delete objGuardar.fechaModificacion;
                delete objGuardar.usuCreacion;
                objGuardar['usuModificacion'] = usuarioActual;

                // Hacemos el update del registro
                await patchLugarParada(idEditar, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
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
            <div className="grid lugarParada">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Lugar de Parada' })).toLowerCase()}</h2>
                        <EditarDatosLugarParada
                            lugarParada={lugarParada}
                            setLugarParada={setLugarParada}
                            estadoGuardando={estadoGuardando}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                            clientes={clientes}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarLugarParada}
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

export default EditarLugarParada;