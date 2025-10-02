"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioMovimiento, patchEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import { getEnvio } from "@/app/api-endpoints/envio";
import { getTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioMovimiento from "./EditarDatosEnvioMovimiento";
import { useIntl } from 'react-intl';

const EditarEnvioMovimiento = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab }) => {
    const toast = useRef(null);
    const [envioMovimiento, setEnvioMovimiento] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar envíos y tipos de sensor disponibles
            const dataEnvios = await getEnvio('{}');
            const dataTiposSensor = await getTipoSensor(JSON.stringify({where: {empresaId: getUsuarioSesion()?.empresaId}}));
            setEnvios(dataEnvios || []);
            setTiposSensor(dataTiposSensor || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioMovimiento(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaEnvioId = envioMovimiento.envioId === undefined || envioMovimiento.envioId === "";
        const validaTipoSensorId = envioMovimiento.tipoSensorId === undefined || envioMovimiento.tipoSensorId === "";
        return (!validaEnvioId && !validaTipoSensorId)
    }

    const guardarEnvioMovimiento = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...envioMovimiento };
            const usuarioActual = getUsuarioSesion()?.id;
            //
            //Borramos las columnas de la vista que no pertenecen a la tabla EnvioMovimiento sino a su padre Envio
            //
            delete objGuardar['origenRuta'];
            delete objGuardar['nombreSensor'];
            delete objGuardar['fechaEspanol'];

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postEnvioMovimiento(objGuardar);

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
                // Si no se ha cambiado la foto del pallet, no enviamos el campo
                //
                if (objGuardar.fotoPalletBase64 === undefined) {
                    delete objGuardar['fotoPallet'];
                }
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvioMovimiento(objGuardar.id, objGuardar);
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
            <div className="grid envioMovimiento">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Movimiento de Envio' })).toLowerCase()}</h2>
                        <EditarDatosEnvioMovimiento
                            envioMovimiento={envioMovimiento}
                            setEnvioMovimiento={setEnvioMovimiento}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            tiposSensor={tiposSensor}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioMovimiento}
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

export default EditarEnvioMovimiento;