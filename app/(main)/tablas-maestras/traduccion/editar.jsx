"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postTraduccion, patchTraduccion } from "@/app/api-endpoints/traduccion";
import EditarDatosTraduccion from "./EditarDatosTraduccion";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useIntl } from 'react-intl';

const EditarTraduccion = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, listaIdiomasInicial = [] }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [traduccion, setTraduccion] = useState(emptyRegistro);
    const [listaIdiomas, setListaIdiomas] = useState(listaIdiomasInicial);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);

    useEffect(() => {
        //
        //Reutilizamos la lista de idiomas ya cargada en la pagina
        //
        setListaIdiomas(listaIdiomasInicial);
    }, [listaIdiomasInicial]);

    useEffect(() => {
        //
        //Cargamos el registro cuando abrimos editar o ver
        //
        if (idEditar !== 0) {
            const registro = rowData.find((element) => element.id === idEditar);
            setTraduccion(registro);
        }
        else {
            setTraduccion(emptyRegistro);
        }
    }, [emptyRegistro, idEditar, rowData]);

    const validaciones = async () => {
        const validaClave = traduccion.clave === undefined || traduccion.clave === "";
        return !validaClave;
    };

    const guardarCodigoPostal = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...traduccion };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                try {
                    for (const idioma of listaIdiomas) {
                        const objTraduccion = {
                            usuCreacion: usuarioActual,
                            idiomaId: idioma.id,
                            clave: objGuardar.clave,
                            valor: objGuardar[idioma.nombre.toLowerCase()],
                        };
                        await postTraduccion(objTraduccion);
                    }
                    setRegistroResult("insertado");
                    setIdEditar(null);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }

            } else {
                try {
                    for (const idioma of listaIdiomas) {
                        if (objGuardar[idioma.nombre.toLowerCase() + 'Id']) {
                            const objTraduccion = {
                                usuModificacion: usuarioActual,
                                clave: objGuardar.clave,
                                valor: objGuardar[idioma.nombre.toLowerCase()],
                            };
                            await patchTraduccion(objGuardar[idioma.nombre.toLowerCase() + 'Id'], objTraduccion);
                        }
                        else if (objGuardar[idioma.nombre.toLowerCase()]) {
                            const objTraduccion = {
                                usuCreacion: usuarioActual,
                                idiomaId: idioma.id,
                                clave: objGuardar.clave,
                                valor: objGuardar[idioma.nombre.toLowerCase()],
                            };
                            await postTraduccion(objTraduccion);
                        }
                    }

                    setIdEditar(null);
                    setRegistroResult("editado");
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }
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
        setIdEditar(null);
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nueva' });

    return (
        <div>
            <div className="grid idioma">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Traduccion' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Configura la clave y sus valores por idioma activo.</p>
                        <EditarDatosTraduccion
                            traduccion={traduccion}
                            setTraduccion={setTraduccion}
                            idiomas={listaIdiomas}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarCodigoPostal}
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

export default EditarTraduccion;
