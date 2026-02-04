"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioParada, patchEnvioParada } from "@/app/api-endpoints/envio-parada";
import { getEnvio } from "@/app/api-endpoints/envio";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioParada from "./EditarDatosEnvioParada";
import { useIntl } from 'react-intl';

const EditarEnvioParada = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab, envioId }) => {
    const toast = useRef(null);
    const [envioParada, setEnvioParada] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar envíos disponibles
            const dataEnvios = await getEnvio(JSON.stringify({
                                                    where: {
                                                        and: {
                                                            empresaId: getUsuarioSesion()?.empresaId
                                                        }
                                                    }
                                                }));
            setEnvios(dataEnvios || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioParada(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        //
        // Si estamos dentro de un tab y tenemos un envioId, lo asignamos
        //
        if (estoyDentroDeUnTab && envioId) {
            envioParada.envioId = envioId;
        }
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const validaEnvioId = envioParada.envioId === undefined || envioParada.envioId === "";
        const validaOrden = envioParada.orden === undefined || envioParada.orden === null || envioParada.orden === "";
        
        const validalugarParadaId = envioParada.lugarParadaId === undefined || envioParada.lugarParadaId === null || envioParada.lugarParadaId === "";
        const validalugarParadaGps = envioParada.lugarParadaGps === undefined || envioParada.lugarParadaGps === null || envioParada.lugarParadaGps === "";
        const validadireccion = envioParada.direccion === undefined || envioParada.direccion === null || envioParada.direccion === "";
        const validaoperarioId = envioParada.operarioId === undefined || envioParada.operarioId === null || envioParada.operarioId === "";
        const validatelefonoOperario = envioParada.telefonoOperario === undefined || envioParada.telefonoOperario === null || envioParada.telefonoOperario === "";
        const validaemailOperario = envioParada.emailOperario === undefined || envioParada.emailOperario === null || envioParada.emailOperario === "";

        if ((envioParada.emailOperario?.length == undefined) || (envioParada.emailOperario.length > 0 && !regexEmail.test(envioParada.emailOperario))) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }
        return (!validaEnvioId && !validaOrden && !validadireccion && !validaemailOperario && 
                !validalugarParadaId && !validalugarParadaGps && !validadireccion && !validaoperarioId && 
                !validatelefonoOperario && !(envioParada.emailOperario.length > 0 && !regexEmail.test(envioParada.emailOperario)));
    }

    const guardarEnvioParada = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...envioParada };
            const usuarioActual = getUsuarioSesion()?.id;
            //
            //Borramos las columnas de la vista que no pertenecen a la tabla EnvioParada sino a su padre Envio
            //
            delete objGuardar['origenRuta'];
            delete objGuardar['fechaEspanol'];
            delete objGuardar['lugarParadaNombre'];
            delete objGuardar['operarioNombre'];

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postEnvioParada(objGuardar);

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
                await patchEnvioParada(objGuardar.id, objGuardar);
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
            <div className="grid envioParada">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Parada de Envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvioParada
                            envioParada={envioParada}
                            setEnvioParada={setEnvioParada}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                            envioId={envioId}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioParada}
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

export default EditarEnvioParada;