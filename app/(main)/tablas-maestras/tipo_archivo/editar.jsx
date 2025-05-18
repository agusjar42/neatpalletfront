"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { getEmpresas } from "@/app/api-endpoints/empresa";
import { getSecciones } from "@/app/api-endpoints/seccion";
import { postTipoArchivo, patchTipoArchivo } from "@/app/api-endpoints/tipo_archivo";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosTipoArchivo from "./EditarDatosTipoArchivo";
import { useIntl } from 'react-intl';
const EditarTipoArchivo = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [tipoArchivo, setTipoArchivo] = useState(emptyRegistro);
    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [listaSecciones, setListaSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const tiposArchivos = [
        
        {nombre: intl.formatMessage({ id: 'Fichero' }), value: "Fichero"},
        {nombre: intl.formatMessage({ id: 'Imagen' }), value: "Imagen"},
    ];
    useEffect(() => {
        //
        //Lo marcamos aquí como saync ya que useEffect no permite ser async porque espera que la función que le pases devueva undefined o una función para limpiar el efecto. 
        //Una función async devuelve una promesa, lo cual no es compatible con el comportamiento esperado de useEffect.
        //
        const fetchData = async () => {
            // Obtenemos todas las empresas
            const registrosEmpresas = await getEmpresas();
            const jsonEmpresas = registrosEmpresas.map(empresa => ({
                nombre: empresa.nombre,
                id: empresa.id
            }));
            setListaEmpresas(jsonEmpresas);

            // Obtenemos todas las secciones
            const registrosSecciones = await getSecciones();
            const jsonSecciones = registrosSecciones.map(seccion => ({
                nombre: seccion.nombre,
                id: seccion.id
            }));
            setListaSecciones(jsonSecciones);


            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                setTipoArchivo(registro)
                // Obtenemos el nombre de la empresa
                const registroEmpresa = registrosEmpresas.find((element) => element.id === registro.empresaId).nombre;
                setEmpresaSeleccionada(registroEmpresa);

                // Obtenemos el nombre de la seccion
                const registrosSeccion = registrosSecciones.find((element) => element.id === registro.seccionId).nombre;
                setSeccionSeleccionada(registrosSeccion);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {

        //Valida el bloque de nivel idioma
        const validaNombre = tipoArchivo.nombre === undefined || tipoArchivo.nombre === "";
        const validaOrden = tipoArchivo.orden === undefined || tipoArchivo.orden === "";
        const validaEmpresa = empresaSeleccionada == null || empresaSeleccionada.id === "";
        const validaTipo = tipoArchivo.tipo === null || tipoArchivo.tipo === "";
        const validaSeccion = seccionSeleccionada == null || seccionSeleccionada.id === "";
        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaEmpresa && !validaNombre && !validaSeccion && !validaOrden && !validaTipo)
    }

    const guardarTipoArchivo = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...tipoArchivo };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                delete objGuardar.nombreEmpresa;
                delete objGuardar.nombreSeccion;
                objGuardar['usuCreacion'] = usuarioActual;
                objGuardar['empresaId'] = listaEmpresas.find(empresa => empresa.nombre === empresaSeleccionada).id;
                objGuardar['seccionId'] = listaSecciones.find(seccion => seccion.nombre === seccionSeleccionada).id;

                if (objGuardar.activoSn === '') {
                    objGuardar.activoSn = 'N';
                }

                // Hacemos el insert del registro
                const nuevoRegistro = await postTipoArchivo(objGuardar);

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
                delete objGuardar.nombreEmpresa;
                delete objGuardar.nombreSeccion;
                if (objGuardar.activoSn === '') {
                    objGuardar.activoSn = 'N';
                }
                objGuardar['usuModificacion'] = usuarioActual;
                objGuardar['empresaId'] = listaEmpresas.find(empresa => empresa.nombre === empresaSeleccionada).id;
                objGuardar['seccionId'] = listaSecciones.find(seccion => seccion.nombre === seccionSeleccionada).id;
                await patchTipoArchivo(objGuardar.id, objGuardar);
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

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Tipo de archivo' })).toLowerCase()}</h2>
                        <EditarDatosTipoArchivo
                            tipoArchivo={tipoArchivo}
                            setTipoArchivo={setTipoArchivo}
                            listaEmpresas={listaEmpresas}
                            listaTipoArchivos={tiposArchivos}
                            empresaSeleccionada={empresaSeleccionada}
                            setEmpresaSeleccionada={setEmpresaSeleccionada}
                            listaSecciones={listaSecciones}
                            seccionSeleccionada={seccionSeleccionada}
                            setSeccionSeleccionada={setSeccionSeleccionada}
                            estadoGuardando={estadoGuardando}
                        />
                        
                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })} 
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                onClick={guardarTipoArchivo}
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

export default EditarTipoArchivo;