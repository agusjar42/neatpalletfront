"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postPallet, patchPallet } from "@/app/api-endpoints/pallet";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import EditarDatosPallet from "./EditarDatosPallet";
import { useIntl } from 'react-intl';
import EditarPalletParametros from "../pallet-parametro/editar";
import Crud from "../../components/shared/crud";
import { getPalletParametro, getPalletParametroCount, deletePalletParametro } from "@/app/api-endpoints/pallet-parametro";

const EditarPallet = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [pallet, setPallet] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setPallet(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaOrden = pallet.orden === undefined || pallet.orden === null || pallet.orden === "";
        const validaCodigo = pallet.codigo === undefined || pallet.codigo === "";
        
        if (validaOrden || validaCodigo) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        
        return (!validaOrden && !validaCodigo);
    }

    const guardarPallet = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...pallet };
            const usuarioActual = getUsuarioSesion()?.id;
            delete objGuardar['fechaImpresionEspanol'];

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                objGuardar['periodoEnvioMail'] = objGuardar['periodoEnvioMail'] ? objGuardar['periodoEnvioMail'] : 0;
                
                const nuevoRegistro = await postPallet(objGuardar);

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
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchPallet(objGuardar.id, objGuardar);
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
    //
    //Muestra la tabla de parámetros solo si el pallet ya está creado
    //
    const columnas = [
        { campo: 'parametro', header: intl.formatMessage({ id: 'Parámetro' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'textoLibre', header: intl.formatMessage({ id: 'Valor Libre' }), tipo: 'string' },
    ]

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Pallet' })).toLowerCase()}</h2>
                        <EditarDatosPallet
                            pallet={pallet}
                            setPallet={setPallet}
                            estadoGuardando={estadoGuardando}
                        />
                        {//
                        //Si el pallet ya está creado, mostramos la tabla de parámetros. Ojo en el parámetro editarComponenteParametrosExtra le pasamos el palletId para que al crear un nuevo parámetro ya venga relleno
                        //
                        pallet.id && <div>
                            <Crud
                                headerCrud={intl.formatMessage({ id: 'Parámetros' })}
                                getRegistros={getPalletParametro}
                                getRegistrosCount={getPalletParametroCount}
                                botones={['nuevo','ver', 'editar', 'eliminar']}
                                controlador={"Pallet Parametro"}
                                editarComponente={<EditarPalletParametros />}
                                columnas={columnas}
                                filtradoBase={{palletId: pallet.id}}
                                deleteRegistro={deletePalletParametro}
                                cargarDatosInicialmente={true}
                                editarComponenteParametrosExtra={{
                                    palletId: pallet.id
                                }}
                            />
                        </div>
                        }
                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarPallet}
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

export default EditarPallet;