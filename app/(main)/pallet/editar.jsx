"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postPallet, patchPallet, getPallet } from "@/app/api-endpoints/pallet";
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
    const [mostrarParametrosTrasAlta, setMostrarParametrosTrasAlta] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar === 0) {
                setPallet(emptyRegistro);
                setMostrarParametrosTrasAlta(false);
                return;
            }

            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                if (registro) {
                    setPallet(registro);
                }
                setMostrarParametrosTrasAlta(false);
            }
        };
        fetchData();
    }, [emptyRegistro, idEditar, rowData]);

    const validaciones = async () => {
        let existeCodigo = false;
        //
        // Comprobamos que el código no exista en el sistema, ya que ahora es único global
        //
        const filtro = JSON.stringify({ where: { and: { codigo: pallet.codigo } } });

        const palletsConCodigoIgual = await getPallet(filtro);
        palletsConCodigoIgual.map(p => {
            //
            // Si el pallet encontrado es el mismo que estamos editando, lo ignoramos. Sino mostramos error y no guardamos
            //
            if (p.id !== pallet.id) {
                existeCodigo = true;
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'Ha introducido el código de un palet ya existente, cámbielo para continuar.' }),
                    life: 3000,
                });
            }
        });

        const validaOrden = pallet.orden === undefined || pallet.orden === null || pallet.orden === "";
        const validaCodigo = pallet.codigo === undefined || pallet.codigo === "";
        const validaAlias = pallet.alias === undefined || pallet.alias === "";

        if (validaOrden || validaCodigo || validaAlias) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }

        return (!validaOrden && !validaCodigo && !validaAlias && !existeCodigo);
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
                objGuardar['periodoEnvioMail'] = objGuardar['periodoEnvioMail'] ? objGuardar['periodoEnvioMail'] : 0;

                const nuevoRegistro = await postPallet(objGuardar);

                if (nuevoRegistro?.id) {
                    //
                    //Tras crear el pallet, mantenemos la ficha abierta para
                    //poder trabajar inmediatamente con el bloque inferior
                    //
                    setPallet((prevState) => ({
                        ...prevState,
                        ...nuevoRegistro,
                    }));
                    setMostrarParametrosTrasAlta(true);
                    setRegistroResult("insertado");
                    setIdEditar(nuevoRegistro.id);
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
                await patchPallet(objGuardar.id, objGuardar);
                setIdEditar(null)
                setRegistroResult("editado");
            }
        }
        setEstadoGuardandoBoton(false);
    };

    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });
    //
    // Muestra la tabla de parámetros solo si el pallet ya está creado
    //
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
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
                        <p className="catalogo-edit-description">Configura el orden, codigo, alias, adquisicion y datos operativos del pallet.</p>
                        <EditarDatosPallet
                            pallet={pallet}
                            setPallet={setPallet}
                            estadoGuardando={estadoGuardando}
                        />
                        {//
                            // Si el pallet ya está creado, mostramos la tabla de parámetros.
                            // Ojo: en editarComponenteParametrosExtra le pasamos palletId para que al crear un nuevo parámetro ya venga relleno.
                            //
                            mostrarParametrosTrasAlta && pallet.id && <div><br></br>
                                <Crud
                                    headerCrud={intl.formatMessage({ id: 'Parámetros' })}
                                    getRegistros={getPalletParametro}
                                    getRegistrosCount={getPalletParametroCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar']}
                                    controlador={"Pallet Parametro"}
                                    editarComponente={<EditarPalletParametros />}
                                    columnas={columnas}
                                    filtradoBase={{ palletId: pallet.id }}
                                    deleteRegistro={deletePalletParametro}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        palletId: pallet.id
                                    }}
                                />
                            </div>
                        }
                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarPallet}
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

export default EditarPallet;
