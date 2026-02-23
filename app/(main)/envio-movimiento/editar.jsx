"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioMovimiento, patchEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import { getEnvioPallet } from "@/app/api-endpoints/envio-pallet";
import { getTipoSensor } from "@/app/api-endpoints/tipo-sensor";
import "primeicons/primeicons.css";
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioMovimiento from "./EditarDatosEnvioMovimiento";
import { useIntl } from "react-intl";

const EditarEnvioMovimiento = ({
    idEditar,
    setIdEditar,
    rowData,
    emptyRegistro,
    setRegistroResult,
    listaTipoArchivos,
    seccion,
    editable,
    estoyDentroDeUnTab,
    envioId,
    envioPalletId,
}) => {
    const toast = useRef(null);
    const [envioMovimiento, setEnvioMovimiento] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            const dataEnviosPallet = await getEnvioPallet(
                JSON.stringify(envioId ? { where: { envioId: envioId } } : {})
            );
            const dataTiposSensor = await getTipoSensor(
                JSON.stringify({ where: { empresaId: getUsuarioSesion()?.empresaId } })
            );
            setEnvios(dataEnviosPallet || []);
            setTiposSensor(dataTiposSensor || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioMovimiento(registro);
            } else {
                setEnvioMovimiento(emptyRegistro);
            }
        };
        fetchData();
    }, [idEditar, rowData, envioId, emptyRegistro]);

    const validaciones = async () => {
        const envioPalletIdFinal = estoyDentroDeUnTab && envioPalletId ? envioPalletId : envioMovimiento.envioPalletId;
        const validaEnvioPalletId = envioPalletIdFinal === undefined || envioPalletIdFinal === "";
        const validaTipoSensorId = envioMovimiento.tipoSensorId === undefined || envioMovimiento.tipoSensorId === "";
        const validaOrden =
            envioMovimiento.orden === undefined || envioMovimiento.orden === null || envioMovimiento.orden === "";
        return !validaEnvioPalletId && !validaTipoSensorId && !validaOrden;
    };

    const guardarEnvioMovimiento = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);

        if (await validaciones()) {
            let objGuardar = { ...envioMovimiento };
            if (estoyDentroDeUnTab && envioPalletId) {
                objGuardar.envioPalletId = envioPalletId;
            }

            const usuarioActual = getUsuarioSesion()?.id;

            delete objGuardar.origenRuta;
            delete objGuardar.codigo;
            delete objGuardar.alias;
            delete objGuardar.nombreSensor;
            delete objGuardar.fechaEspanol;
            delete objGuardar.nombreTipoSensor;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar.usuarioCreacion = usuarioActual;

                const nuevoRegistro = await postEnvioMovimiento(objGuardar);

                if (nuevoRegistro?.id) {
                    setRegistroResult("insertado");
                    setIdEditar(null);
                } else {
                    toast.current?.show({
                        severity: "error",
                        summary: "ERROR",
                        detail: intl.formatMessage({ id: "Ha ocurrido un error creando el registro" }),
                        life: 3000,
                    });
                }
            } else {
                objGuardar.usuarioModificacion = usuarioActual;
                delete objGuardar.fechaModificacion;

                if (
                    objGuardar.imagenBase64 === undefined ||
                    objGuardar.imagenBase64 === null ||
                    objGuardar.imagenBase64 === ""
                ) {
                    delete objGuardar.imagenBase64;
                    delete objGuardar.imagenNombre;
                    delete objGuardar.imagenTipo;
                }

                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvioMovimiento(objGuardar.id, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
            }
        } else {
            toast.current?.show({
                severity: "error",
                summary: "ERROR",
                detail: intl.formatMessage({ id: "Todos los campos deben de ser rellenados" }),
                life: 3000,
            });
        }

        setEstadoGuardandoBoton(false);
    };

    const cancelarEdicion = () => {
        setIdEditar(null);
    };

    const header =
        idEditar > 0
            ? editable
                ? intl.formatMessage({ id: "Editar" })
                : intl.formatMessage({ id: "Ver" })
            : intl.formatMessage({ id: "Nuevo" });

    return (
        <div>
            <div className="grid envioMovimiento">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>
                            {header} {(intl.formatMessage({ id: "Movimiento de Envio" })).toLowerCase()}
                        </h2>
                        <EditarDatosEnvioMovimiento
                            envioMovimiento={envioMovimiento}
                            setEnvioMovimiento={setEnvioMovimiento}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            tiposSensor={tiposSensor}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                            envioPalletId={envioPalletId}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={
                                        estadoGuardandoBoton
                                            ? `${intl.formatMessage({ id: "Guardando" })}...`
                                            : intl.formatMessage({ id: "Guardar" })
                                    }
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioMovimiento}
                                    className="mr-2"
                                    disabled={estadoGuardandoBoton}
                                />
                            )}
                            <Button
                                label={intl.formatMessage({ id: "Cancelar" })}
                                onClick={cancelarEdicion}
                                className="p-button-secondary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarEnvioMovimiento;
