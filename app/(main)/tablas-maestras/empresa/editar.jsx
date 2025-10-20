"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { postEmpresa, patchEmpresa } from "@/app/api-endpoints/empresa";
import EditarDatosEmpresa from "./EditarDatosEmpresa";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import { useIntl } from 'react-intl';
import Crud from "../../../components/shared/crud";
import { getEnvioConfiguracionEmpresa, getEnvioConfiguracionEmpresaCount, deleteEnvioConfiguracionEmpresa } from "@/app/api-endpoints/envio-configuracion-empresa";
import EditarEnvioConfiguracionEmpresas from "../../envio-configuracion-empresa/editar";
import { getEnvioSensorEmpresa, getEnvioSensorEmpresaCount, deleteEnvioSensorEmpresa } from "@/app/api-endpoints/envio-sensor-empresa";
import EditarEnvioSensorEmpresas from "../../envio-sensor-empresa/editar";

const EditarEmpresa = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl()
    const toast = useRef(null);
    const [empresa, setEmpresa] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Columnas para la tabla de envío configuración empresa
    const columnasConfiguracionEmpresa = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
    ];

    // Columnas para la tabla de envío sensor empresa
    const columnasSensorEmpresa = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Tipo de Sensor' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
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
                setEmpresa(registro);                
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //Valida que los campos no esten vacios
        const validaCodigo = empresa.codigo === undefined || empresa.codigo === "";
        const validaNombre = empresa.nombre === undefined || empresa.nombre === "";

        if (validaNombre || validaCodigo /*|| validaDescripcion || validaEmail || validaPassword || validaServicio */) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        
        if ((empresa.email?.length == undefined) || (empresa.email.length > 0 && !regexEmail.test(empresa.email))) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }

        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaNombre && !(empresa.email.length > 0 && !regexEmail.test(empresa.email))
        );
    }

    const guardarEmpresa = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el registro actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...empresa };
            const usuarioActual = getUsuarioSesion()?.id;

            // Si estoy insertando uno nuevo
            if (idEditar === 0) {
                // Elimino y añado los campos que no se necesitan
                delete objGuardar.id;
                objGuardar['usuCreacion'] = usuarioActual;
                // Hacemos el insert del registro
                const nuevoRegistro = await postEmpresa(objGuardar);

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
                objGuardar['usuModificacion'] = usuarioActual;
                delete objGuardar['fechaModificacion'];
                //
                // Si no se ha cambiado la foto del producto, no enviamos el campo
                //
                if (objGuardar.imagenBase64 === undefined) {
                    delete objGuardar['imagen'];
                }
                //
                // Si no se ha cambiado la foto del pallet, no enviamos el campo
                //
                if (objGuardar.logoBase64 === undefined) {
                    delete objGuardar['logo'];
                }
                objGuardar = reemplazarNullPorVacio(objGuardar);
                await patchEmpresa(objGuardar.id, objGuardar);                
                setIdEditar(null)
                setRegistroResult("editado");
            }
        }
        setEstadoGuardandoBoton(false);
    };
    
    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nueva' });

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Empresa' })).toLowerCase()}</h2>
                        <EditarDatosEmpresa
                            empresa={empresa}
                            setEmpresa={setEmpresa}
                            estadoGuardando={estadoGuardando}
                        />

                        {/* Pestañas */}
                        <div className="mt-4">
                            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                <TabPanel header={intl.formatMessage({ id: 'Envío Configuración' })}>
                                    <div>
                                        {/* Solo mostrar la tabla si la empresa ya está creada */}
                                        {empresa.id ? (
                                            <Crud
                                                headerCrud={intl.formatMessage({ id: 'Configuraciones de Empresa' })}
                                                getRegistros={getEnvioConfiguracionEmpresa}
                                                getRegistrosCount={getEnvioConfiguracionEmpresaCount}
                                                botones={['nuevo', 'ver', 'editar', 'eliminar']}
                                                controlador={"Envio Configuracion Empresa"}
                                                editarComponente={<EditarEnvioConfiguracionEmpresas />}
                                                columnas={columnasConfiguracionEmpresa}
                                                filtradoBase={{empresa_Id: empresa.id}}
                                                deleteRegistro={deleteEnvioConfiguracionEmpresa}
                                                cargarDatosInicialmente={true}
                                                editarComponenteParametrosExtra={{
                                                    empresaId: empresa.id,
                                                    estoyDentroDeUnTab: true
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                                <p className="text-gray-600">
                                                    {intl.formatMessage({ id: 'Debe guardar la empresa primero para poder añadir configuraciones' })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>
                                <TabPanel header={intl.formatMessage({ id: 'Envío Sensores' })}>
                                    <div>
                                        {/* Solo mostrar la tabla si la empresa ya está creada */}
                                        {empresa.id ? (
                                            <Crud
                                                headerCrud={intl.formatMessage({ id: 'Sensores de Empresa' })}
                                                getRegistros={getEnvioSensorEmpresa}
                                                getRegistrosCount={getEnvioSensorEmpresaCount}
                                                botones={['nuevo', 'ver', 'editar', 'eliminar']}
                                                controlador={"Envio Sensor Empresa"}
                                                editarComponente={<EditarEnvioSensorEmpresas />}
                                                columnas={columnasSensorEmpresa}
                                                filtradoBase={{empresaId: empresa.id}}
                                                deleteRegistro={deleteEnvioSensorEmpresa}
                                                cargarDatosInicialmente={true}
                                                editarComponenteParametrosExtra={{
                                                    empresaId: empresa.id,
                                                    estoyDentroDeUnTab: true
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                                <p className="text-gray-600">
                                                    {intl.formatMessage({ id: 'Debe guardar la empresa primero para poder añadir sensores' })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>

                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarEmpresa}
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

export default EditarEmpresa;