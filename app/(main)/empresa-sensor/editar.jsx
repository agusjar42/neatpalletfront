"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEmpresaSensor, patchEmpresaSensor, getEmpresaSensor } from "@/app/api-endpoints/empresa-sensor";
import { getTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEmpresaSensor from "./EditarDatosEmpresaSensor";
import { useIntl } from 'react-intl';

const EditarEmpresaSensor = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, empresaId }) => {
    const toast = useRef(null);
    const [empresaSensor, setEmpresaSensor] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            //
            //Obtenemos todos los tipos de sensor del catalogo global
            //
            const dataTiposSensor = await getTipoSensor(JSON.stringify({}));
            //
            //Obtenemos todos los sensores ya introducidos para la empresa
            //
            const sensoresRegistrados = await getEmpresaSensor(JSON.stringify({
                where: {
                    and: {
                        empresaId: empresaId ?? getUsuarioSesion()?.empresaId
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
                setEmpresaSensor(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        let validaTipoSensor = empresaSensor.tipoSensorId === undefined || empresaSensor.tipoSensorId === null || empresaSensor.tipoSensorId === "";
        let validaOrden = empresaSensor.orden === undefined || empresaSensor.orden === null || empresaSensor.orden === "";
        let mensajeDevuelto = (validaTipoSensor || validaOrden) ? 'Todos los campos deben de ser rellenados' : '';

        if (mensajeDevuelto === '') {
            // Si estamos creando un nuevo registro (idEditar === 0), verificar si el tipo de sensor ya existe
            if (idEditar === 0) {
                const sensorExistente = await verificarSensorDuplicado(empresaSensor.tipoSensorId);
                if (sensorExistente) {
                    mensajeDevuelto = 'Este tipo de sensor ya está registrado para la empresa';
                }
            }
        }

        return (mensajeDevuelto)
    }

    const verificarSensorDuplicado = async (tipoSensorId) => {
        try {
            const registros = await getEmpresaSensor(JSON.stringify({
                where: {
                    and: {
                        empresaId: empresaId ?? getUsuarioSesion()?.empresaId,
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

    const guardarEmpresaSensor = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        let mensajeValidacion = await validaciones()
        if (mensajeValidacion === '') {
            let objGuardar = { ...empresaSensor };
            delete objGuardar['nombre'];
            delete objGuardar['nombreSensor'];
            delete objGuardar['unidad'];
            const usuarioActual = getUsuarioSesion()?.id;

            //
            //Normalizamos los nuevos campos de empresa_sensor antes de guardar
            //
            objGuardar["valorMinimo"] = objGuardar["valorMinimo"] == null || objGuardar["valorMinimo"] === "" ? null : objGuardar["valorMinimo"].toString();
            objGuardar["valorMaximo"] = objGuardar["valorMaximo"] == null || objGuardar["valorMaximo"] === "" ? null : objGuardar["valorMaximo"].toString();
            objGuardar["activoSn"] = objGuardar["activoSn"] || "S";

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = empresaId ?? getUsuarioSesion()?.empresaId;

                const nuevoRegistro = await postEmpresaSensor(objGuardar);

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
                await patchEmpresaSensor(objGuardar.id, objGuardar);
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
                        <p className="catalogo-edit-description">Asocia a un sensor los valores mínimos y máximos en los que debe trabajar.</p>
                        <EditarDatosEmpresaSensor
                            empresaSensor={empresaSensor}
                            setEmpresaSensor={setEmpresaSensor}
                            estadoGuardando={estadoGuardando}
                            tiposSensor={tiposSensor}
                            idEditar={idEditar}
                            editable={editable}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEmpresaSensor}
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

export default EditarEmpresaSensor;
