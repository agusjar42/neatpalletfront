"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { postIdioma, patchIdioma } from "@/app/api-endpoints/idioma";
import EditarDatosIdioma from "./EditarDatosIdioma";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useIntl } from 'react-intl';
const EditarIdioma = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [idioma, setIdioma] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [isoSeleccionado, setIsoSeleccionado] = useState(null);

    //Array de los isos validos que pueden tener los idiomas para que Traducciones.js los procese
    const isoIdiomas = [
        { idioma: `${intl.formatMessage({ id: 'Abjasio' })} (ab)`, iso: "ab" },
        { idioma: `${intl.formatMessage({ id: 'Afar' })} (aa)`, iso: "aa" },
        { idioma: `${intl.formatMessage({ id: 'Afrikaans' })} (af)`, iso: "af" },
        { idioma: `${intl.formatMessage({ id: 'Aimara' })} (ay)`, iso: "ay" },
        { idioma: `${intl.formatMessage({ id: 'Albanez' })} (sq)`, iso: "sq" },
        { idioma: `${intl.formatMessage({ id: 'Aleman' })} (de)`, iso: "de" },
        { idioma: `${intl.formatMessage({ id: 'Amarico' })} (am)`, iso: "am" },
        { idioma: `${intl.formatMessage({ id: 'Arabe' })} (ar)`, iso: "ar" },
        { idioma: `${intl.formatMessage({ id: 'Aragones' })} (an)`, iso: "an" },
        { idioma: `${intl.formatMessage({ id: 'Armenio' })} (hy)`, iso: "hy" },
        { idioma: `${intl.formatMessage({ id: 'Asames' })} (as)`, iso: "as" },
        { idioma: `${intl.formatMessage({ id: 'Azeri' })} (az)`, iso: "az" },
        { idioma: `${intl.formatMessage({ id: 'Bengali' })} (bn)`, iso: "bn" },
        { idioma: `${intl.formatMessage({ id: 'Bielorruso' })} (be)`, iso: "be" },
        { idioma: `${intl.formatMessage({ id: 'Bulgaro' })} (bg)`, iso: "bg" },
        { idioma: `${intl.formatMessage({ id: 'Catalan' })} (ca)`, iso: "ca" },
        { idioma: `${intl.formatMessage({ id: 'Checo' })} (cs)`, iso: "cs" },
        { idioma: `${intl.formatMessage({ id: 'Chino' })} (zh)`, iso: "zh" },
        { idioma: `${intl.formatMessage({ id: 'Coreano' })} (ko)`, iso: "ko" },
        { idioma: `${intl.formatMessage({ id: 'Croata' })} (hr)`, iso: "hr" },
        { idioma: `${intl.formatMessage({ id: 'Danes' })} (da)`, iso: "da" },
        { idioma: `${intl.formatMessage({ id: 'Eslovaco' })} (sk)`, iso: "sk" },
        { idioma: `${intl.formatMessage({ id: 'Esloveno' })} (sl)`, iso: "sl" },
        { idioma: `${intl.formatMessage({ id: 'Español' })} (es)`, iso: "es" },
        { idioma: `${intl.formatMessage({ id: 'Estonio' })} (et)`, iso: "et" },
        { idioma: `${intl.formatMessage({ id: 'Euskera' })} (eu)`, iso: "eu" },
        { idioma: `${intl.formatMessage({ id: 'Fines' })} (fi)`, iso: "fi" },
        { idioma: `${intl.formatMessage({ id: 'Frances' })} (fr)`, iso: "fr" },
        { idioma: `${intl.formatMessage({ id: 'Gallego' })} (gl)`, iso: "gl" },
        { idioma: `${intl.formatMessage({ id: 'Griego' })} (el)`, iso: "el" },
        { idioma: `${intl.formatMessage({ id: 'Hebreo' })} (he)`, iso: "he" },
        { idioma: `${intl.formatMessage({ id: 'Hindi' })} (hi)`, iso: "hi" },
        { idioma: `${intl.formatMessage({ id: 'Hungaro' })} (hu)`, iso: "hu" },
        { idioma: `${intl.formatMessage({ id: 'Indonesio' })} (id)`, iso: "id" },
        { idioma: `${intl.formatMessage({ id: 'Ingles' })} (en)`, iso: "en" },
        { idioma: `${intl.formatMessage({ id: 'Italiano' })} (it)`, iso: "it" },
        { idioma: `${intl.formatMessage({ id: 'Japones' })} (ja)`, iso: "ja" },
        { idioma: `${intl.formatMessage({ id: 'Kazajo' })} (kk)`, iso: "kk" },
        { idioma: `${intl.formatMessage({ id: 'Leton' })} (lv)`, iso: "lv" },
        { idioma: `${intl.formatMessage({ id: 'Lituano' })} (lt)`, iso: "lt" },
        { idioma: `${intl.formatMessage({ id: 'Macedonio' })} (mk)`, iso: "mk" },
        { idioma: `${intl.formatMessage({ id: 'Malayo' })} (ms)`, iso: "ms" },
        { idioma: `${intl.formatMessage({ id: 'Maltes' })} (mt)`, iso: "mt" },
        { idioma: `${intl.formatMessage({ id: 'Noruego' })} (no)`, iso: "no" },
        { idioma: `${intl.formatMessage({ id: 'Polaco' })} (pl)`, iso: "pl" },
        { idioma: `${intl.formatMessage({ id: 'Portugues' })} (pt)`, iso: "pt" },
        { idioma: `${intl.formatMessage({ id: 'Rumano' })} (ro)`, iso: "ro" },
        { idioma: `${intl.formatMessage({ id: 'Ruso' })} (ru)`, iso: "ru" },
        { idioma: `${intl.formatMessage({ id: 'Serbio' })} (sr)`, iso: "sr" },
        { idioma: `${intl.formatMessage({ id: 'Sueco' })} (sv)`, iso: "sv" },
        { idioma: `${intl.formatMessage({ id: 'Tailandes' })} (th)`, iso: "th" },
        { idioma: `${intl.formatMessage({ id: 'Turco' })} (tr)`, iso: "tr" },
        { idioma: `${intl.formatMessage({ id: 'Ucraniano' })} (uk)`, iso: "uk" },
        { idioma: `${intl.formatMessage({ id: 'Urdu' })} (ur)`, iso: "ur" },
        { idioma: `${intl.formatMessage({ id: 'Vietnamita' })} (vi)`, iso: "vi" },
        { idioma: `${intl.formatMessage({ id: 'Yoruba' })} (yo)`, iso: "yo" },
        { idioma: `${intl.formatMessage({ id: 'Zulu' })} (zu)`, iso: "zu" }
      ];
      

    useEffect(() => {
        //
        //Lo marcamos aquí como saync ya que useEffect no permite ser async porque espera que la función que le pases devueva undefined o una función para limpiar el efecto. 
        //Una función async devuelve una promesa, lo cual no es compatible con el comportamiento esperado de useEffect.
        //
        const fetchData = async () => {
            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                //Añadimos el iso seleccionado
                setIsoSeleccionado(isoIdiomas.find((element) => element.iso === registro.iso));

                setIdioma(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {

        //Valida que los campos no esten vacios
        const validaNombre = idioma.nombre === undefined || idioma.nombre === "";
        const validaOrden = idioma.orden === undefined || idioma.orden === null || idioma.orden === "";
        //const validaIso = isoSeleccionado == null || isoSeleccionado === "";
        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (/*!validaIso && */!validaNombre && !validaOrden)
    }

    const guardarEmpresaTransporte = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...idioma };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                objGuardar['usuCreacion'] = usuarioActual;
                if(isoSeleccionado){
                    objGuardar['iso'] = isoSeleccionado.iso;
                }
                
                if (objGuardar.activoSn === '') {
                    objGuardar.activoSn = 'N';
                }
                // Hacemos el insert del registro
                const nuevoRegistro = await postIdioma(objGuardar);

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
                objGuardar['usuModificacion'] = usuarioActual;
                if(isoSeleccionado){
                    objGuardar['iso'] = isoSeleccionado.iso;
                }
                else{
                    objGuardar['iso'] = null;
                }
                if (objGuardar.activoSn === '') {
                    objGuardar.activoSn = 'N';
                }
                await patchIdioma(objGuardar.id, objGuardar);
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
                        <h2>{header} {(intl.formatMessage({ id: 'Idioma' })).toLowerCase()}</h2>
                        <EditarDatosIdioma
                            idioma={idioma}
                            setIdioma={setIdioma}
                            estadoGuardando={estadoGuardando}
                            isoIdiomas={isoIdiomas}
                            setIsoSeleccionado={setIsoSeleccionado}
                            isoSeleccionado={isoSeleccionado}
                        />
                        
                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })} 
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                onClick={guardarEmpresaTransporte}
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

export default EditarIdioma;