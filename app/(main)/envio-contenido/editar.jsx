"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioContenido, patchEnvioContenido } from "@/app/api-endpoints/envio-contenido";
import { getEnvio } from "@/app/api-endpoints/envio";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioContenido from "./EditarDatosEnvioContenido";
import { useIntl } from 'react-intl';

const EditarEnvioContenido = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab }) => {
    const toast = useRef(null);
    const [envioContenido, setEnvioContenido] = useState(emptyRegistro);
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
                setEnvioContenido(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaEnvioId = envioContenido.envioId === undefined || envioContenido.envioId === "";
        
        // Convertimos a número los campos numéricos para evitar problemas
        envioContenido.pesoKgs = Number(envioContenido.pesoKgs) || 0;
        envioContenido.pesoTotal = Number(envioContenido.pesoTotal) || 0;
        
        // Borramos las columnas de la vista que no pertenecen a la tabla EnvioContenido
        delete envioContenido.origenRuta;
        
        // NO borramos los campos Base64 aquí, se procesan en el backend
        
        return (!validaEnvioId);
    }

    const guardarEnvioContenido = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        
        if (await validaciones()) {
            let objGuardar = { ...envioContenido };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar['id'];
                objGuardar['usuarioCreacion'] = usuarioActual;                
                const nuevoRegistro = await postEnvioContenido(objGuardar);

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
                //
                // Si no se ha cambiado la foto del producto, no enviamos el campo
                //
                if (objGuardar.fotoProductoBase64 === undefined) {
                    delete objGuardar['fotoProducto'];
                }
                //
                // Si no se ha cambiado la foto del pallet, no enviamos el campo
                //
                if (objGuardar.fotoPalletBase64 === undefined) {
                    delete objGuardar['fotoPallet'];
                }
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvioContenido(objGuardar.id, objGuardar);
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
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid envioContenido">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Contenido' })).toLowerCase()}</h2>
                        <EditarDatosEnvioContenido
                            envioContenido={envioContenido}
                            setEnvioContenido={setEnvioContenido}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioContenido}
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

export default EditarEnvioContenido;