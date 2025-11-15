"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postEnvioPallet, patchEnvioPallet } from "@/app/api-endpoints/envio-pallet";
import { getEnvio } from "@/app/api-endpoints/envio";
import { getPallet } from "@/app/api-endpoints/pallet";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosEnvioPallet from "./EditarDatosEnvioPallet";
import { useIntl } from 'react-intl';
import { get } from "http";

const EditarEnvioPallet = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, estoyDentroDeUnTab, envioId }) => {
    const toast = useRef(null);
    const [envioPallet, setEnvioPallet] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [envios, setEnvios] = useState([]);
    const [pallets, setPallets] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            // Cargar envíos y pallets disponibles
            const dataEnvios = await getEnvio(JSON.stringify({
                                                    where: {
                                                        and: {
                                                            empresaId: getUsuarioSesion()?.empresaId
                                                        }
                                                    }
                                                }));
            const dataPallets = await getPallet(JSON.stringify({where: {empresaId: getUsuarioSesion()?.empresaId}}));
            setEnvios(dataEnvios || []);
            setPallets(dataPallets || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvioPallet(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        //
        // Si estamos dentro de un tab y tenemos un envioId, lo asignamos
        //
        if (estoyDentroDeUnTab && envioId) {
            envioPallet.envioId = envioId;
        }
        const validaEnvioId = envioPallet.envioId === undefined || envioPallet.envioId === "";
        const validaPalletId = envioPallet.palletId === undefined || envioPallet.palletId === "";
        const validaOrden = envioPallet.orden === undefined || envioPallet.orden === null || envioPallet.orden === "";
        return (!validaEnvioId && !validaPalletId && !validaOrden)
    }

    const guardarEnvioPallet = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            const usuarioActual = getUsuarioSesion()?.id;
            let objGuardar = { id: envioPallet.id, palletId: envioPallet.palletId, envioId: envioPallet.envioId };

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postEnvioPallet(objGuardar);

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
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEnvioPallet(objGuardar.id, objGuardar);
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
            <div className="grid envioPallet">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Envio Pallet' })).toLowerCase()}</h2>
                        <EditarDatosEnvioPallet
                            envioPallet={envioPallet}
                            setEnvioPallet={setEnvioPallet}
                            estadoGuardando={estadoGuardando}
                            envios={envios}
                            pallets={pallets}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvioPallet}
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

export default EditarEnvioPallet;