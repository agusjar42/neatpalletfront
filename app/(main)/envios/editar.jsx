"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { borrarFichero, postSubirImagen, postSubirFichero } from "@/app/api-endpoints/ficheros"
import { postArchivo, deleteArchivo } from "@/app/api-endpoints/archivo"
import { postEnvio, patchEnvio } from "@/app/api-endpoints/envio";
import EditarDatosEnvio from "./EditarDatosEnvio";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useIntl } from 'react-intl'

const EditarEnvio = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl()
    const toast = useRef(null);
    const [envio, setEnvio] = useState(emptyRegistro);
    const [listaTipoArchivosAntiguos, setListaTipoArchivosAntiguos] = useState([]);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);

    useEffect(() => {
        //
        //Lo marcamos aquÃ­ como saync ya que useEffect no permite ser async porque espera que la funciÃ³n que le pases devueva undefined o una funciÃ³n para limpiar el efecto. 
        //Una funciÃ³n async devuelve una promesa, lo cual no es compatible con el comportamiento esperado de useEffect.
        //
        const fetchData = async () => {
            
            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setEnvio(registro);
                
                //Guardamos los archivos para luego poder compararlos
                const _listaArchivosAntiguos = {}
                for (const tipoArchivo of listaTipoArchivos) {
                    _listaArchivosAntiguos[tipoArchivo['nombre']] = registro[(tipoArchivo.nombre).toLowerCase()]
                }
                setListaTipoArchivosAntiguos(_listaArchivosAntiguos)
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validacionesImagenes = () => {
        for (const tipoArchivo of listaTipoArchivos) {
            //Comprueba si el tipo de archivo es una imagen para validar su extension
            if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                //Comprueba que el input haya sido modificado
                if (envio[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                    //Comprueba que la imagen es del tipo valido
                    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff", "image/avif"];
                    if (!(allowedTypes.includes(envio[(tipoArchivo.nombre).toLowerCase()].type))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const validaciones = async () => {
        //Valida que los campos obligatorios no esten vacios
        const validaAnyo = envio.anyo === undefined || envio.anyo === "";
        const validaOrigen = envio.origen === undefined || envio.origen === "";
        const validaDestino = envio.destino === undefined || envio.destino === "";

        const validaImagenes = validacionesImagenes();

        if (validaAnyo || validaOrigen || validaDestino) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos obligatorios deben ser rellenados' }),
                life: 3000,
            });
        }
        if (validaImagenes) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Las imagenes deben de tener el formato correcto' }),
                life: 3000,
            });
        }

        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaAnyo && !validaOrigen && !validaDestino && !validaImagenes);
    }

    const guardarEnvio = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            
            let objGuardar = { ...envio };
            //
            // Función para convertir las fechas a string MySQL (YYYY-MM-DD HH:mm:ss)
            //
            const convierteFechaAMySQL = (fecha) => {
                if (!fecha) return null;
                let nuevaFecha = fecha;
                if (typeof fecha === 'string') {
                    //
                    // Si es string ISO, conviértelo a Date
                    //
                    nuevaFecha = new Date(fecha);
                    if (isNaN(nuevaFecha.getTime())) return fecha; // Si no es parseable, retorna el string original
                }
                const pad = (numero) => numero < 10 ? '0' + numero : numero;
                return `${pad(nuevaFecha.getDate())}/${pad(nuevaFecha.getMonth() + 1)}/${nuevaFecha.getFullYear()} ${pad(nuevaFecha.getHours())}:${pad(nuevaFecha.getMinutes())}:${pad(nuevaFecha.getSeconds())}`;
            };
            //
            // Revisamos la fechaSalida y fechaLlegada para convertirlas a formato MySQL
            //
            if (objGuardar.fechaSalida instanceof Date) {
                objGuardar.fechaSalida = convierteFechaAMySQL(objGuardar.fechaSalida);
            }
            if (objGuardar.fechaLlegada instanceof Date) {
                objGuardar.fechaLlegada = convierteFechaAMySQL(objGuardar.fechaLlegada);
            }
            const usuarioActual = getUsuarioSesion()?.id;
            //
            // Si estoy insertando uno nuevo
            //
            if (idEditar === 0) {
                //
                // Elimino y añado los campos que no se necesitan
                //
                delete objGuardar.id;
                objGuardar['usuarioCreacion'] = usuarioActual;
                objGuardar['empresaId'] = Number(localStorage.getItem('empresa'));

                // Hacemos el insert del registro
                const nuevoRegistro = await postEnvio(objGuardar);

                //Si se crea el registro mostramos el toast
                if (nuevoRegistro?.id) {
                    //Sube las imagenes al servidor
                    for (const tipoArchivo of listaTipoArchivos) {
                        //Comprueba que el input haya sido modificado
                        if (envio[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                            await insertarArchivo(envio, nuevoRegistro.id, tipoArchivo, seccion, usuarioActual)
                        }
                    }
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
                const envioAeditar = {
                    id: objGuardar.id,
                    empresaId: objGuardar.empresaId,
                    anyo: objGuardar.anyo,
                    origen: objGuardar.origen,
                    origenCoordenadasGps: objGuardar.origenCoordenadasGps,
                    destino: objGuardar.destino,
                    destinoCoordenadasGps: objGuardar.destinoCoordenadasGps,
                    fechaSalida: objGuardar.fechaSalida,
                    fechaLlegada: objGuardar.fechaLlegada,
                    paradasPrevistas: objGuardar.paradasPrevistas,
                    usuarioModificacion: usuarioActual,
                    fechaModificacion: new Date()
                };

                await patchEnvio(objGuardar.id, envioAeditar);
                await editarArchivos(envio, objGuardar.id, seccion, usuarioActual)
                setIdEditar(null)
                setRegistroResult("editado");
            }
        }
        setEstadoGuardandoBoton(false);
    };

    //Compara los archivos del registro antes de ser editado para actualizar los archivos
    const editarArchivos = async (registro, id, seccion, usuario) => {
        for (const tipoArchivo of listaTipoArchivos) {
            //Comprueba que si ha aÃ±adido una imagen
            if (registro[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                //Si ya existia antes una imagen, hay que eliminarla junto a su version redimensionada
                if (listaTipoArchivosAntiguos[tipoArchivo['nombre']] !== null) {
                    await borrarFichero(listaTipoArchivosAntiguos[tipoArchivo['nombre']]);
                    await deleteArchivo(registro[`${(tipoArchivo.nombre).toLowerCase()}Id`]);
                    //Tambien borra la version sin redimensionar
                    if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                        const url = (listaTipoArchivosAntiguos[tipoArchivo['nombre']]).replace(/(\/[^\/]+\/)1250x850_([^\/]+\.\w+)$/, '$1$2');
                        await borrarFichero(url);
                    }

                }
                //Se inserta la imagen modificada
                await insertarArchivo(registro, id, tipoArchivo, seccion, usuario)
            }
            else {
                //Si ya existia antes una imagen, hay que eliminarla junto a su version redimensionada
                if (listaTipoArchivosAntiguos[tipoArchivo['nombre']] !== null && registro[(tipoArchivo.nombre).toLowerCase()] === null) {
                    await borrarFichero(listaTipoArchivosAntiguos[tipoArchivo['nombre']]);
                    await deleteArchivo(registro[`${(tipoArchivo.nombre).toLowerCase()}Id`]);
                    //Tambien borra la version sin redimensionar
                    if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                        const url = (listaTipoArchivosAntiguos[tipoArchivo['nombre']]).replace(/(\/[^\/]+\/)1250x850_([^\/]+\.\w+)$/, '$1$2');
                        await borrarFichero(url);
                    }
                }
            }
        }
    };

    const insertarArchivo = async (registro, id, tipoArchivo, seccion, usuario) => {
        await postSubirImagen(seccion, registro[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
        //Comprueba que el input haya sido modificado
        if (registro[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
            //Comprueba si el tipo de archivo es una imagen para la subida
            let response = null;
            if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                response = await postSubirImagen(seccion, envio[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
            }
            else {
                response = await postSubirFichero(seccion, registro[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
            }
            //Hace el insert en la tabla de archivos
            const objArchivo = {}
            objArchivo['usuCreacion'] = usuario;
            objArchivo['empresaId'] = registro.empresaId;
            objArchivo['tipoArchivoId'] = tipoArchivo.id;
            objArchivo['url'] = response.originalUrl;
            objArchivo['idTabla'] = id;
            objArchivo['tabla'] = seccion.toLowerCase();
            await postArchivo(objArchivo);
        }
    }

    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid Envio">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Envío' })).toLowerCase()}</h2>
                        <EditarDatosEnvio
                            envio={envio}
                            setEnvio={setEnvio}                            
                            listaTipoArchivos={listaTipoArchivos}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEnvio}
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

export default EditarEnvio;