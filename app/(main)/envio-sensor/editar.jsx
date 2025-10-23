"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioSensor, patchEnvioSensor } from "@/app/api-endpoints/envio-sensor";
import { getEnvio } from "@/app/api-endpoints/envio";
import { getTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioSensor from "./EditarDatosEnvioSensor";
import { useIntl } from 'react-intl';

const EditarEnvioSensor = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab, envioId }) => {
    const toast = useRef(null);
    const [envioSensor, setEnvioSensor] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar envíos disponibles
            const dataEnvios = await getEnvio(JSON.stringify({
                            where: {
                                and: {
                                    empresa_Id: getUsuarioSesion()?.empresaId
                                }
                            }
                        }));
            setEnvios(dataEnvios || []);

            // Cargar tipos de sensor disponibles
            const dataTiposSensor = await getTipoSensor(JSON.stringify({
                            where: {
                                and: {
                                    empresa_Id: getUsuarioSesion()?.empresaId
                                }
                            }
                        }));
            setTiposSensor(dataTiposSensor || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioSensor(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        //
        // Si estamos dentro de un tab y tenemos un envioId, lo asignamos
        //
        if (estoyDentroDeUnTab && envioId) {
            envioSensor.envioId = envioId;
        }
        const validaEnvioId = envioSensor.envioId === undefined || envioSensor.envioId === "";
        const validaTipoSensorId = envioSensor.tipoSensorId === undefined || envioSensor.tipoSensorId === "";
        const validaValor = envioSensor.valor === undefined || envioSensor.valor === "";
        
        return (!validaEnvioId && !validaTipoSensorId && !validaValor);
    }

    const guardarEnvioSensor = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        
        if (await validaciones()) {
            let objGuardar = { ...envioSensor };
            const usuarioActual = getUsuarioSesion()?.id;

            // Borramos las columnas de la vista que no pertenecen a la tabla envio_sensor sino a tablas relacionadas
            delete objGuardar['nombreSensor'];
            delete objGuardar['origenRuta'];

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postEnvioSensor(objGuardar);

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
                await patchEnvioSensor(objGuardar.id, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
            }
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos obligatorios deben ser rellenados' }),
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
            <div className="grid EnvioSensor">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Sensor de Envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvioSensor
                            envioSensor={envioSensor}
                            setEnvioSensor={setEnvioSensor}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            tiposSensor={tiposSensor}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioSensor}
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

export default EditarEnvioSensor;