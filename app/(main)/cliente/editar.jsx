"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { postCliente, patchCliente } from "@/app/api-endpoints/cliente";
import { getOperario, getOperarioCount, deleteOperario } from "@/app/api-endpoints/cliente-operario";
import { getLugarParada, getLugarParadaCount, deleteLugarParada } from "@/app/api-endpoints/cliente-lugar-parada";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosCliente from "./EditarDatosCliente";
import EditarOperario from "../operario/editar";
import EditarLugarParada from "../lugar-parada/editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';

const EditarCliente = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, empresaId }) => {
    const toast = useRef(null);
    const [cliente, setCliente] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const intl = useIntl();

    const columnasOperarios = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Telefono' }), tipo: 'string' },
        { campo: 'email', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'activoSN', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' }
    ];

    const columnasLugaresParada = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'direccion', header: intl.formatMessage({ id: 'Direccion' }), tipo: 'string' },
        { campo: 'direccionGps', header: intl.formatMessage({ id: 'Direccion GPS' }), tipo: 'string' },
        { campo: 'activoSN', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                if (registro) {
                    setCliente(registro);
                }
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // Validaciones básicas
        const validaNombre = cliente.nombre === undefined || cliente.nombre === "";
        let validaEmail = false;
        
        if (cliente.mail && !regexEmail.test(cliente.mail)) {
            validaEmail = true;
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }
        // Si existe algún campo vacío entonces no se puede guardar
        return (!validaNombre && !validaEmail)
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
                objGuardar['empresaId'] = empresaId ?? getUsuarioSesion()?.empresaId;
                objGuardar['estado'] = objGuardar['estado'] || 'Activo';
                
                // Hacemos el insert del registro
                const nuevoRegistro = await postCliente(objGuardar);

                //Si se crea el registro mostramos el toast
                if (nuevoRegistro?.id) {
                    setCliente((prev) => ({
                        ...prev,
                        ...nuevoRegistro,
                    }));
                    setRegistroResult("insertado");
                    setIdEditar(nuevoRegistro.id);
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
                await patchCliente(idEditar, objGuardar);
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
            <div className="grid Cliente">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Punto de entrega' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Actualiza el codigo, nombre, direccion, horario, telefono, email y estado del punto de entrega.</p>
                        <EditarDatosCliente
                            cliente={cliente}
                            setCliente={setCliente}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="mt-4">
                            <TabView
                                activeIndex={activeIndex}
                                onTabChange={(e) => setActiveIndex(e.index)}
                            >
                                <TabPanel header={intl.formatMessage({ id: 'Operarios' })}>
                                    {cliente.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Operarios del Cliente' })}
                                            getRegistros={getOperario}
                                            getRegistrosCount={getOperarioCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                            controlador={"Operarios"}
                                            editarComponente={<EditarOperario />}
                                            columnas={columnasOperarios}
                                            filtradoBase={{ clienteId: cliente.id }}
                                            deleteRegistro={deleteOperario}
                                            mostrarEdicionEnModal={true}
                                            modalEdicionProps={{
                                                showHeader: false,
                                                className: "neat-crud-edit-dialog catalogo-edit-dialog",
                                                style: { width: "min(760px, 94vw)" },
                                            }}
                                            editarComponenteParametrosExtra={{
                                                clienteId: cliente.id,
                                                estoyDentroDeUnTab: true,
                                                ocultarClienteResumenHeader: true,
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                            <p className="text-gray-600">{intl.formatMessage({ id: 'Debe guardar el punto de entrega primero para poder gestionar operarios' })}</p>
                                        </div>
                                    )}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Lugares de Parada' })}>
                                    {cliente.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Lugares de Parada' })}
                                            getRegistros={getLugarParada}
                                            getRegistrosCount={getLugarParadaCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                            controlador={"Lugar Parada"}
                                            editarComponente={<EditarLugarParada />}
                                            columnas={columnasLugaresParada}
                                            filtradoBase={{ clienteId: cliente.id }}
                                            deleteRegistro={deleteLugarParada}
                                            mostrarEdicionEnModal={true}
                                            modalEdicionProps={{
                                                showHeader: false,
                                                className: "neat-crud-edit-dialog catalogo-edit-dialog",
                                                style: { width: "min(820px, 94vw)" },
                                            }}
                                            editarComponenteParametrosExtra={{
                                                clienteId: cliente.id,
                                                estoyDentroDeUnTab: true,
                                                ocultarClienteResumenHeader: true,
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                            <p className="text-gray-600">{intl.formatMessage({ id: 'Debe guardar el punto de entrega primero para poder gestionar lugares de parada' })}</p>
                                        </div>
                                    )}
                                </TabPanel>
                            </TabView>
                        </div>

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarCliente}
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

export default EditarCliente;
