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
            const registrosIdiomas = await getIdiomas();
            const jsonIdiomas = registrosIdiomas.map(idioma => ({
                nombre: idioma.nombre,
                id: idioma.id
            }));
            setListaIdiomas(jsonIdiomas);

            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setTraduccion(registro);
                // Obtenemos el nombre del idioma seleccionado
                const registroIdioma = registrosIdiomas.find((element) => element.id === registro.idiomaId).nombre;
                setIdiomaSeleccionado(registroIdioma);

            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaIdioma = idiomaSeleccionado == null || idiomaSeleccionado.id === "";
        const validaClave = traduccion.clave === undefined || traduccion.clave === "";
        const validaValor = traduccion.valor === undefined || traduccion.valor === "";

        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaClave && !validaValor && !validaIdioma)
    }

    const guardarTraduccion = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...traduccion };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                delete objGuardar.nombreIdioma;
                objGuardar['usuCreacion'] = usuarioActual;
                objGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado).id;

                // Hacemos el insert del registro
                const nuevoRegistro = await postTraduccion(objGuardar);

                //Si se crea el registro mostramos el toast
                if (nuevoRegistro?.id) {

                    //Usamos una variable que luego se cargara en el useEffect de la pagina principal para mostrar el toast
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
                //Si se edita un registro existente Hacemos el patch del registro
                objGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado).id;
                objGuardar['usuModificacion'] = getUsuarioSesion()?.id
                delete objGuardar.nombreIdioma;
                delete objGuardar.iso;

                await patchTraduccion(objGuardar.id, objGuardar);
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
                        <h2>{header} {(intl.formatMessage({ id: 'Traduccion' })).toLowerCase()}</h2>
                        <EditarDatosTraduccion
                            traduccion={traduccion}
                            setTraduccion={setTraduccion}
                            listaIdiomas={listaIdiomas}
                            idiomaSeleccionado={idiomaSeleccionado}
                            setIdiomaSeleccionado={setIdiomaSeleccionado}
                            estadoGuardando={estadoGuardando}
                        />
                        
                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })} 
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                onClick={guardarTraduccion}
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