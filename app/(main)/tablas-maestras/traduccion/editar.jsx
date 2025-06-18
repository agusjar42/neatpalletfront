"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import { postTraduccion, patchTraduccion } from "@/app/api-endpoints/traduccion";
import EditarDatosTraduccion from "./EditarDatosTraduccion";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useIntl } from 'react-intl';
const EditarTraduccion = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [traduccion, setTraduccion] = useState(emptyRegistro);
    const [listaIdiomas, setListaIdiomas] = useState([]);
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState(null);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);


    useEffect(() => {
        //
        //Lo marcamos aquí como saync ya que useEffect no permite ser async porque espera que la función que le pases devueva undefined o una función para limpiar el efecto. 
        //Una función async devuelve una promesa, lo cual no es compatible con el comportamiento esperado de useEffect.
        //
        const fetchData = async () => {
            // Obtenemos todas las idiomas
            try {
                const idiomasData = await getIdiomas();
                // Ordenar idiomas alfabéticamente
                const idiomasOrdenados = idiomasData.sort((a, b) => a.nombre.localeCompare(b.nombre));
                setListaIdiomas(idiomasOrdenados);
            } catch (error) {
                console.error('Error al cargar los idiomas:', error);
            }

            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setTraduccion(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        //const validaIdioma = idiomaSeleccionado == null || idiomaSeleccionado.id === "";
        const validaClave = traduccion.clave === undefined || traduccion.clave === "";
        //const validaValor = traduccion.valor === undefined || traduccion.valor === "";

        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return !validaClave // (!validaClave && !validaValor && !validaIdioma)
    }

    const guardarCodigoPostal = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...traduccion };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                try {
                    for (const idioma of listaIdiomas) {
                        const objTraduccion = {
                            usuCreacion: usuarioActual,
                            idiomaId: idioma.id,
                            clave: objGuardar.clave,
                            valor: objGuardar[idioma.nombre.toLowerCase()],
                        }
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
                        //Si la traduccion ya existe, hacemos el patch
                        if (objGuardar[idioma.nombre.toLowerCase() + 'Id']) {
                            const objTraduccion = {
                                usuModificacion: usuarioActual,
                                clave: objGuardar.clave,
                                valor: objGuardar[idioma.nombre.toLowerCase()],
                            }
                            await patchTraduccion(objGuardar[idioma.nombre.toLowerCase() + 'Id'], objTraduccion);
                        }
                        //Si la traduccion no existe, hacemos el post
                        else if (objGuardar[idioma.nombre.toLowerCase()]) {
                            const objTraduccion = {
                                usuCreacion: usuarioActual,
                                idiomaId: idioma.id,
                                clave: objGuardar.clave,
                                valor: objGuardar[idioma.nombre.toLowerCase()],
                            }
                            await postTraduccion(objTraduccion);
                        }
                    }

                    setIdEditar(null)
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
        //setAccion("consulta");
        //setIdEditar(null);
    };

    const cancelarEdicion = () => {
        setIdEditar(null)
        //setAccion("consulta");
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nueva' });

    return (
        <div>
            <div className="grid idioma">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Traducción' })).toLowerCase()}</h2>
                        <EditarDatosTraduccion
                            traduccion={traduccion}
                            setTraduccion={setTraduccion}
                            idiomas={listaIdiomas}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarCodigoPostal}
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

export default EditarTraduccion;