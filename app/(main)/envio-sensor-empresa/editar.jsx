"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioSensorEmpresa, patchEnvioSensorEmpresa, getEnvioSensorEmpresa } from "@/app/api-endpoints/envio-sensor-empresa";
import { getTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioSensorEmpresa from "./EditarDatosEnvioSensorEmpresa";
import { useIntl } from 'react-intl';

const EditarEnvioSensorEmpresa = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [envioSensorEmpresa, setEnvioSensorEmpresa] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            //
            //Obtenemos todos los tipos de sensor disponibles para la empresa
            //
            const dataTiposSensor = await getTipoSensor(JSON.stringify({
                where: {
                    and: {
                        empresa_Id: getUsuarioSesion()?.empresaId
                    }
                }
            }));
            //
            //Obtenemos todos los sensores ya introducidos para la empresa
            //
            const sensoresRegistrados = await getEnvioSensorEmpresa(JSON.stringify({
                where: {
                    and: {
                        empresaId: getUsuarioSesion()?.empresaId
                    }
                }
            }));
            //
            //Arreglamos el desplegable de sensores para que no aparezcan los ya usados
            //
            const tiposSensorFiltrados = dataTiposSensor.filter(tipo => {
                // Si estamos editando, permitir que el tipo de sensor con el que estamos trabajando aparezca en la lista
                if (idEditar !== 0) {
                    const registroActual = rowData.find((element) => element.id === idEditar);
                    if (registroActual && registroActual.tipoSensorId === tipo.id) {
                        return true;
                    }
                }
                //
                //Quitamos los tipos de sensores que ya están usándose de la lista de dispnibles
                //
                const yaRegistrado = sensoresRegistrados.some(sensor => sensor.tipoSensorId === tipo.id);
                return !yaRegistrado;
            });

            setTiposSensor(tiposSensorFiltrados || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioSensorEmpresa(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        let validaTipoSensor = envioSensorEmpresa.tipoSensorId === undefined || envioSensorEmpresa.tipoSensorId === null || envioSensorEmpresa.tipoSensorId === "";
        let mensajeDevuelto = validaTipoSensor ? 'Todos los campos deben de ser rellenados' : '';

        if (mensajeDevuelto === '') {
            // Si estamos creando un nuevo registro (idEditar === 0), verificar si el tipo de sensor ya existe
            if (idEditar === 0) {
                const sensorExistente = await verificarSensorDuplicado(envioSensorEmpresa.tipoSensorId);
                if (sensorExistente) {
                    mensajeDevuelto = 'Este tipo de sensor ya está registrado para la empresa';
                }
            }
        }

        return (mensajeDevuelto)
    }

    const verificarSensorDuplicado = async (tipoSensorId) => {
        try {
            const registros = await getEnvioSensorEmpresa(JSON.stringify({
                where: {
                    and: {
                        empresaId: getUsuarioSesion()?.empresaId,
                        tipoSensorId: tipoSensorId
                    }
                }
            }));
            return registros && registros.length > 0;
        } catch (error) {
            console.error('Error verificando sensor duplicado:', error);
            return false;
        }
    }

    const guardarEnvioSensorEmpresa = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        let mensajeValidacion = await validaciones()
        if (mensajeValidacion === '') {
            let objGuardar = { ...envioSensorEmpresa };
            delete objGuardar['nombre'];
            delete objGuardar['nombreSensor'];
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;

                const nuevoRegistro = await postEnvioSensorEmpresa(objGuardar);

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
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                delete objGuardar['fechaModificacion'];
                delete objGuardar['activoSn'];
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvioSensorEmpresa(objGuardar.id, objGuardar);
                setIdEditar(null)
                setRegistroResult("editado");
            }
        }
        else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: mensajeValidacion}),
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
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Sensor de Empresa' })).toLowerCase()}</h2>
                        <EditarDatosEnvioSensorEmpresa
                            envioSensorEmpresa={envioSensorEmpresa}
                            setEnvioSensorEmpresa={setEnvioSensorEmpresa}
                            estadoGuardando={estadoGuardando}
                            tiposSensor={tiposSensor}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioSensorEmpresa}
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

export default EditarEnvioSensorEmpresa;
