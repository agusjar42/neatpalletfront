"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postPalletParametro, patchPalletParametro } from "@/app/api-endpoints/pallet-parametro";
import { getPallet, getPalletById } from "@/app/api-endpoints/pallet";
import { getParametro } from "@/app/api-endpoints/parametro";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosPalletParametro from "./EditarDatosPalletParametro";
import { useIntl } from 'react-intl';

const EditarPalletParametro = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, palletId }) => {
    const toast = useRef(null);
    const [palletParametro, setPalletParametro] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [pallets, setPallets] = useState([]);
    const [parametros, setParametros] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            //
            //Si existe palletId significa que estamos dentro de un pallet y solo traemos ese
            //
            let dataPallets = [];
            if (palletId) {
                dataPallets[0] = await getPalletById(palletId);
            } else {
                dataPallets = await getPallet(JSON.stringify({
                    where: { empresaId: getUsuarioSesion()?.empresaId }
                }));
            }
            let dataParametros = await getParametro('{}');
            setPallets(dataPallets || []);
            setParametros(dataParametros || []);

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setPalletParametro(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaPalletId = palletParametro.palletId === undefined || palletParametro.palletId === "";
        const validaParametroId = palletParametro.parametroId === undefined || palletParametro.parametroId === "";
        return (!validaPalletId && !validaParametroId)
    }

    const guardarPalletParametro = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...palletParametro };
            const usuarioActual = getUsuarioSesion()?.id;
            //
            //Borramos las columnas de la vista que no pertenecen a la tabla PalletParametro sino a su padre Pallet
            //
            delete objGuardar['pallet'];
            delete objGuardar['parametro'];
            delete objGuardar['idPadre'];

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                
                const nuevoRegistro = await postPalletParametro(objGuardar);

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
                await patchPalletParametro(objGuardar.id, objGuardar);
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
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Pallet Parametro' })).toLowerCase()}</h2>
                        <EditarDatosPalletParametro
                            palletParametro={palletParametro}
                            setPalletParametro={setPalletParametro}
                            estadoGuardando={estadoGuardando}
                            pallets={pallets}
                            parametros={parametros}
                            {//
                             //Si viene palletId es que estamos dentro de un pallet y se lo pasamos para que lo precargue y lo oculte
                             //
                             ...(palletId ? { palletId } : {})}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarPalletParametro}
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

export default EditarPalletParametro;