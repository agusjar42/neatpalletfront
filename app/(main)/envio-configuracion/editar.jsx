"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioConfiguracion, patchEnvioConfiguracion } from "@/app/api-endpoints/envio-configuracion";
import { getEnvio } from "@/app/api-endpoints/envio";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioConfiguracion from "./EditarDatosEnvioConfiguracion";
import { useIntl } from 'react-intl';

const EditarEnvioConfiguracion = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab, envioId }) => {
    const toast = useRef(null);
    const [envioConfiguracion, setEnvioConfiguracion] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar envíos disponibles
            const dataEnvios = await getEnvio('{}');
            setEnvios(dataEnvios || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioConfiguracion(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        //
        // Si estamos dentro de un tab y tenemos un envioId, lo asignamos
        //
        if (estoyDentroDeUnTab && envioId) {
            envioConfiguracion.envioId = envioId;
        }
        const validaEnvioId = envioConfiguracion.envioId === undefined || envioConfiguracion.envioId === "";
        const validaNombre = envioConfiguracion.nombre === undefined || envioConfiguracion.nombre === "";
        const validaOrden = envioConfiguracion.orden === undefined || envioConfiguracion.orden === null || envioConfiguracion.orden === "";
        return (!validaEnvioId && !validaNombre && !validaOrden)
    }

    const guardarEnvioConfiguracion = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...envioConfiguracion };
            const usuarioActual = getUsuarioSesion()?.id;
            //
            //Borramos las columnas de la vista que no pertenecen a la tabla EnvioConfiguracion sino a su padre Envio
            //
            delete objGuardar['origenRuta'];
            delete objGuardar['fechaCreacion'];
            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postEnvioConfiguracion(objGuardar);

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
                await patchEnvioConfiguracion(objGuardar.id, objGuardar);
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
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Configuracion de Envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvioConfiguracion
                            envioConfiguracion={envioConfiguracion}
                            setEnvioConfiguracion={setEnvioConfiguracion}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioConfiguracion}
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

export default EditarEnvioConfiguracion;
