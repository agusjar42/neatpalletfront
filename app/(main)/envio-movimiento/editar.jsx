"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioMovimiento, patchEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import { getEnvioContenido } from "@/app/api-endpoints/envio-contenido";
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
    const [palletsConMovimiento, setPalletsConMovimiento] = useState([]);
    const [pallets, setPallets] = useState([]);
    const [tiposSensor, setTiposSensor] = useState([]);
    const intl = useIntl();

    //
    //Resolvemos el envioId real para el movimiento
    //
    const obtenerEnvioId = (registroMovimiento) => {
        const palletSeleccionado = palletsConMovimiento.find(
            (item) => Number(item?.palletId) === Number(registroMovimiento?.palletId)
        );

        if (palletSeleccionado?.envioId !== undefined && palletSeleccionado?.envioId !== null) {
            return palletSeleccionado.envioId;
        }

        if (registroMovimiento?.envioId !== undefined && registroMovimiento?.envioId !== null && registroMovimiento?.envioId !== "") {
            return registroMovimiento.envioId;
        }

        if (envioId !== undefined && envioId !== null && envioId !== "") {
            return envioId;
        }

        return null;
    };

    //
    //Guardamos tambien envioPalletId en envio_movimiento usando el pallet seleccionado
    //
    const obtenerEnvioPalletId = (registroMovimiento) => {
        if (registroMovimiento?.envioPalletId !== undefined && registroMovimiento?.envioPalletId !== null && registroMovimiento?.envioPalletId !== "") {
            return registroMovimiento.envioPalletId;
        }

        if (registroMovimiento?.palletId !== undefined && registroMovimiento?.palletId !== null && registroMovimiento?.palletId !== "") {
            return registroMovimiento.palletId;
        }

        if (envioPalletId !== undefined && envioPalletId !== null && envioPalletId !== "") {
            return envioPalletId;
        }

        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            //
            //Cargamos los pallets registrados en envio_contenido para el envio actual
            //
            const dataEnvioContenido = await getEnvioContenido(
                JSON.stringify(envioId ? { where: { envioId: envioId } } : {})
            );
            const mapaPallets = new Map();
            (dataEnvioContenido || []).forEach((registro) => {
                const palletId = registro?.palletId;
                if (palletId === undefined || palletId === null || mapaPallets.has(String(palletId))) {
                    return;
                }

                mapaPallets.set(String(palletId), {
                    id: palletId,
                    envioId: registro?.envioId,
                    palletId: palletId,
                    codigo: registro?.codigoPallet || `Pallet ${palletId}`,
                    alias: registro?.aliasPallet || "",
                    label: registro?.codigoPallet
                        ? `${registro.codigoPallet}${registro?.aliasPallet ? ` - ${registro.aliasPallet}` : ""}`
                        : `Pallet ${palletId}`,
                });
            });
            const palletsContenido = Array.from(mapaPallets.values());
            setPallets(palletsContenido);
            setPalletsConMovimiento(palletsContenido);

            //
            //Cargamos los tipos de sensor para el desplegable
            //
            const dataTiposSensor = await getTipoSensor(JSON.stringify({}));
            setTiposSensor(dataTiposSensor || []);

            //
            //Preparamos el registro en edicion y resolvemos su pallet asociado
            //
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                if (registro) {
                    const palletRegistro = palletsContenido.find(
                        (item) =>
                            Number(item?.palletId) === Number(registro?.palletId) ||
                            Number(item?.palletId) === Number(registro?.envioPalletId)
                    );

                    setEnvioMovimiento({
                        ...registro,
                        palletId: registro?.palletId ?? palletRegistro?.palletId ?? registro?.envioPalletId ?? "",
                    });
                }
            } else {
                setEnvioMovimiento({
                    ...emptyRegistro,
                    envioId: envioId ?? emptyRegistro?.envioId ?? "",
                    palletId: emptyRegistro?.palletId ?? "",
                });
            }
        };
        fetchData();
    }, [idEditar, rowData, envioId, emptyRegistro]);

    const validaciones = async () => {
        //
        //Resolvemos el envioId a partir del pallet seleccionado
        //
        const envioIdFinal = obtenerEnvioId(envioMovimiento);
        const validaPalletId = envioMovimiento.palletId === undefined || envioMovimiento.palletId === null || envioMovimiento.palletId === "";
        const validaEnvioId = envioIdFinal === undefined || envioIdFinal === null || envioIdFinal === "";
        const validaEnvioPalletId = obtenerEnvioPalletId(envioMovimiento) === undefined || obtenerEnvioPalletId(envioMovimiento) === null || obtenerEnvioPalletId(envioMovimiento) === "";
        const validaTipoSensorId = envioMovimiento.tipoSensorId === undefined || envioMovimiento.tipoSensorId === "";
        const validaOrden =
            envioMovimiento.orden === undefined || envioMovimiento.orden === null || envioMovimiento.orden === "";
        return !validaPalletId && !validaEnvioId && !validaEnvioPalletId && !validaTipoSensorId && !validaOrden;
    };

    const guardarEnvioMovimiento = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);

        if (await validaciones()) {
            let objGuardar = { ...envioMovimiento };

            //
            //Guardamos siempre el envioId real del movimiento
            //
            objGuardar.envioId = obtenerEnvioId(objGuardar);
            objGuardar.envioPalletId = obtenerEnvioPalletId(objGuardar);

            const usuarioActual = getUsuarioSesion()?.id;

            delete objGuardar.origenRuta;
            delete objGuardar.codigo;
            delete objGuardar.alias;
            delete objGuardar.codigoPallet;
            delete objGuardar.aliasPallet;
            delete objGuardar.palletId;
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
            const envioIdFinal = obtenerEnvioId(envioMovimiento);
            const envioPalletIdFinal = obtenerEnvioPalletId(envioMovimiento);
            const faltaPalletAsignado = (!envioIdFinal || !envioPalletIdFinal) && envioMovimiento?.palletId;
            toast.current?.show({
                severity: "error",
                summary: "ERROR",
                detail: faltaPalletAsignado
                    ? intl.formatMessage({ id: "El pallet seleccionado no esta asignado a este envio" })
                    : intl.formatMessage({ id: "Todos los campos deben de ser rellenados" }),
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
                        <p className="catalogo-edit-description">Configura el pallet, sensor, fecha, ubicacion e imagen del movimiento.</p>
                        <EditarDatosEnvioMovimiento
                            envioMovimiento={envioMovimiento}
                            setEnvioMovimiento={setEnvioMovimiento}
                            estadoGuardando={estadoGuardando}
                            pallets={pallets}
                            tiposSensor={tiposSensor}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button
                                label={intl.formatMessage({ id: "Cancelar" })}
                                onClick={cancelarEdicion}
                                className="p-button-secondary"
                            />
                            {editable && (
                                <Button
                                    label={
                                        estadoGuardandoBoton
                                            ? `${intl.formatMessage({ id: "Guardando" })}...`
                                            : "Guardar cambios"
                                    }
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioMovimiento}
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

export default EditarEnvioMovimiento;
