"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useIntl } from "react-intl";
import "primeicons/primeicons.css";
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import { postTipoVehiculo, patchTipoVehiculo } from "@/app/api-endpoints/tipo-vehiculo";
import EditarDatosTipoVehiculo from "./EditarDatosTipoVehiculo";

const EditarTipoVehiculo = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, editable }) => {
    const toast = useRef(null);
    const [tipoVehiculo, setTipoVehiculo] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        //
        //Cuando se edita cargamos el registro seleccionado en el formulario
        //
        if (idEditar !== 0) {
            const registro = rowData.find((element) => element.id === idEditar);
            setTipoVehiculo(registro);
        }
    }, [idEditar, rowData]);

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        const esTrue = valor === true ? "S" : "N";
        setTipoVehiculo({ ...tipoVehiculo, [nombreInputSwitch]: esTrue });
    };

    const validaciones = async () => {
        const validaNombre = tipoVehiculo.nombre === undefined || tipoVehiculo.nombre === "";
        const validaOrden = tipoVehiculo.orden === undefined || tipoVehiculo.orden === null || tipoVehiculo.orden === "";
        return !validaNombre && !validaOrden;
    };

    const guardarTipoVehiculo = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);

        if (await validaciones()) {
            let objGuardar = { ...tipoVehiculo };
            const usuarioActual = getUsuarioSesion()?.id;

            //
            //Si es un alta preparamos los campos de creacion
            //
            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar.usuCreacion = usuarioActual;
                objGuardar.activoSn = objGuardar.activoSn || "S";

                const nuevoRegistro = await postTipoVehiculo(objGuardar);

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
                //
                //Si es una edicion actualizamos el registro existente
                //
                objGuardar.usuModificacion = usuarioActual;
                delete objGuardar.fechaModificacion;
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchTipoVehiculo(objGuardar.id, objGuardar);
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

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: "Editar" }) : intl.formatMessage({ id: "Ver" })) : intl.formatMessage({ id: "Nuevo" });

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: "Tipo Vehiculo" })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Configura el orden, nombre y estado del tipo de vehiculo.</p>
                        <EditarDatosTipoVehiculo
                            tipoVehiculo={tipoVehiculo}
                            setTipoVehiculo={setTipoVehiculo}
                            estadoGuardando={estadoGuardando}
                            manejarCambioInputSwitch={manejarCambioInputSwitch}
                        />
                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: "Cancelar" })} onClick={() => setIdEditar(null)} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: "Guardando" })}...` : "Guardar cambios"}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarTipoVehiculo}
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

export default EditarTipoVehiculo;
