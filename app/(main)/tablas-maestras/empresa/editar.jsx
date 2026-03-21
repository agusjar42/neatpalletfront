"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { postEmpresa, patchEmpresa } from "@/app/api-endpoints/empresa";
import { getVistaUsuarios, getVistaUsuariosCount, deleteUsuario } from "@/app/api-endpoints/usuario";
import { getCliente, getClienteCount, deleteCliente } from "@/app/api-endpoints/cliente";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import { getEnvioSensorEmpresa, getEnvioSensorEmpresaCount, deleteEnvioSensorEmpresa, crearEnvioSensorEmpresaDesdetipoSensor } from "@/app/api-endpoints/envio-sensor-empresa";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/tipo-carroceria";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import { getEventoConfiguracion, getEventoConfiguracionCount } from "@/app/api-endpoints/evento-configuracion";
import EditarDatosEmpresa from "./EditarDatosEmpresa";
import EditarUsuario from "../../usuarios/editar";
import EditarCliente from "../../cliente/editar";
import EditarEnvio from "../../envio/editar";
import EditarEnvioSensorEmpresa from "../../envio-sensor-empresa/editar";
import EditarTipoCarroceria from "../../tipo-carroceria/editar";
import EditarTipoTransporte from "../../tipo-transporte/editar";
import PalletsAsignadosEmpresa from "./PalletsAsignadosEmpresa";
import 'primeicons/primeicons.css';
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import { useIntl } from 'react-intl';
import Crud from "../../../components/shared/crud";

const EditarEmpresa = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, editable }) => {
    const intl = useIntl()
    const toast = useRef(null);
    const [empresa, setEmpresa] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [cargandoSensores, setCargandoSensores] = useState(false);
    const [refreshSensores, setRefreshSensores] = useState(0);

    const columnasUsuariosEmpresa = [
        { campo: 'nombreRol', header: intl.formatMessage({ id: 'Rol' }), tipo: 'string' },
        { campo: 'avatar', header: intl.formatMessage({ id: 'Avatar' }), tipo: 'imagen' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ];

    const columnasPuntosEntrega = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
    ];

    const columnasEnvio = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'numero', header: intl.formatMessage({ id: 'Numero' }), tipo: 'string' },
        { campo: 'clienteNombre', header: intl.formatMessage({ id: 'Cliente' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destinoRuta', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'fechaSalidaEspanol', header: intl.formatMessage({ id: 'Fecha salida' }), tipo: 'string' },
        { campo: 'fechaLlegadaEspanol', header: intl.formatMessage({ id: 'Fecha llegada' }), tipo: 'string' }
    ];

    const columnasSensorEmpresa = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Tipo de Sensor' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ];

    const columnasCatalogosGlobales = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ];

    const columnasEventoConfiguracion = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setEmpresa(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailEmpresa = (empresa.email ?? "").trim();
        const descripcionEmpresa = (empresa.descripcion ?? "").trim();
        const validaOrden = empresa.orden === undefined || empresa.orden === null || empresa.orden === "";
        const validaCodigo = empresa.codigo === undefined || empresa.codigo === "";
        const validaNombre = empresa.nombre === undefined || empresa.nombre === "";
        const validaDescripcionLongitud = descripcionEmpresa.length > 500;

        if (validaNombre || validaCodigo || validaOrden) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }

        if ((empresa.email?.length == undefined) || (emailEmpresa.length > 0 && !regexEmail.test(emailEmpresa))) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }

        if (validaDescripcionLongitud) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'La descripcion no puede superar los 500 caracteres' }),
                life: 3000,
            });
        }

        /*if (emailEmpresa.length > 0 && regexEmail.test(emailEmpresa)) {
            try {
                const filtroUsuarios = JSON.stringify({ and: { mail: emailEmpresa } });
                const usuariosCountResponse = await getVistaUsuariosCount(filtroUsuarios);
                const usuariosCount = usuariosCountResponse?.count ?? usuariosCountResponse ?? 0;
                if (usuariosCount > 0) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'El email de la empresa no puede coincidir con el email de un usuario' }),
                        life: 3000,
                    });
                    return false;
                }
            } catch (error) {
                console.error("Error comprobando email de empresa contra usuarios", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'No se ha podido validar el email contra usuarios. Inténtelo de nuevo.' }),
                    life: 3000,
                });
                return false;
            }
        }*/

        return (
            !validaNombre &&
            !validaCodigo &&
            !validaOrden &&
            !(emailEmpresa.length > 0 && !regexEmail.test(emailEmpresa)) &&
            !validaDescripcionLongitud
        );
    }

    const guardarEmpresa = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...empresa };
            if ((objGuardar.tiempoInactividad || "").length === 0) {
                objGuardar.tiempoInactividad = 60;
            }

            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                objGuardar['usuCreacion'] = usuarioActual;
                const nuevoRegistro = await postEmpresa(objGuardar);
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
                objGuardar['usuModificacion'] = usuarioActual;
                delete objGuardar['fechaModificacion'];
                delete objGuardar['fechaCreacion'];
                if (objGuardar.imagenBase64 === undefined) {
                    delete objGuardar['imagen'];
                }
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

    const handleCrearSensoresDesdetipoSensor = () => {
        if (!empresa.id) {
            toast.current?.show({
                severity: 'warn',
                summary: intl.formatMessage({ id: 'Advertencia' }),
                detail: intl.formatMessage({ id: 'Debe guardar la empresa primero' }),
                life: 3000,
            });
            return;
        }
        confirmDialog({
            message: intl.formatMessage({ id: '¿Está seguro que desea crear los sensores desde los tipos de sensor? Esto sobrescribirá los sensores actuales de la empresa.' }),
            header: intl.formatMessage({ id: 'Confirmación' }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: intl.formatMessage({ id: 'Sí' }),
            rejectLabel: intl.formatMessage({ id: 'No' }),
            accept: async () => {
                setCargandoSensores(true);
                try {
                    await crearEnvioSensorEmpresaDesdetipoSensor(empresa.id, getUsuarioSesion()?.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: intl.formatMessage({ id: 'Éxito' }),
                        detail: intl.formatMessage({ id: 'Sensores creados desde tipos de sensor correctamente' }),
                        life: 3000,
                    });
                    setRefreshSensores(prev => prev + 1);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: intl.formatMessage({ id: 'Error' }),
                        detail: intl.formatMessage({ id: 'Error al crear los sensores desde tipos de sensor' }),
                        life: 3000,
                    });
                } finally {
                    setCargandoSensores(false);
                }
            }
        });
    };

    const renderTabNoDisponible = (mensaje) => (
        <div className="text-center p-4">
            <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
            <p className="text-gray-600">{mensaje}</p>
        </div>
    );

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

                        <div className="mt-4">
                            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                <TabPanel header={intl.formatMessage({ id: 'Usuarios de empresa' })}>
                                    {empresa.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Usuarios de empresa' })}
                                            getRegistros={getVistaUsuarios}
                                            getRegistrosCount={getVistaUsuariosCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                            controlador={"Usuarios"}
                                            editarComponente={<EditarUsuario />}
                                            columnas={columnasUsuariosEmpresa}
                                            filtradoBase={{ empresaId: empresa.id }}
                                            deleteRegistro={deleteUsuario}
                                            editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                        />
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar usuarios' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Puntos de entrega' })}>
                                    {empresa.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Puntos de entrega' })}
                                            getRegistros={getCliente}
                                            getRegistrosCount={getClienteCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                            controlador={"Clientes"}
                                            editarComponente={<EditarCliente />}
                                            columnas={columnasPuntosEntrega}
                                            filtradoBase={{ empresaId: empresa.id }}
                                            deleteRegistro={deleteCliente}
                                            editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                        />
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar puntos de entrega' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Envíos' })}>
                                    {empresa.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Envíos' })}
                                            getRegistros={getEnvio}
                                            getRegistrosCount={getEnvioCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                            controlador={"Envíos"}
                                            editarComponente={<EditarEnvio />}
                                            columnas={columnasEnvio}
                                            filtradoBase={{ empresaId: empresa.id }}
                                            deleteRegistro={deleteEnvio}
                                            editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                        />
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar envíos' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Envío sensores' })}>
                                    {empresa.id ? (
                                        <>
                                            <ConfirmDialog />
                                            <div className="flex justify-content-end mb-3">
                                                <Button
                                                    label={cargandoSensores ? intl.formatMessage({ id: 'Creando sensores...' }) : intl.formatMessage({ id: 'Crear sensores desde tipos de sensor' })}
                                                    icon={cargandoSensores ? "pi pi-spin pi-spinner" : "pi pi-copy"}
                                                    onClick={handleCrearSensoresDesdetipoSensor}
                                                    disabled={cargandoSensores}
                                                    className="p-button-help"
                                                    tooltip={intl.formatMessage({ id: 'Crea los sensores de empresa a partir de los tipos de sensor definidos' })}
                                                    tooltipOptions={{ position: 'left' }}
                                                />
                                            </div>
                                            <Crud
                                                key={`sensores-empresa-${refreshSensores}`}
                                                headerCrud={intl.formatMessage({ id: 'Sensores de empresa' })}
                                                getRegistros={getEnvioSensorEmpresa}
                                                getRegistrosCount={getEnvioSensorEmpresaCount}
                                                botones={['nuevo', 'ver', 'editar', 'eliminar']}
                                                controlador={"Envio Sensor Empresa"}
                                                editarComponente={<EditarEnvioSensorEmpresa />}
                                                columnas={columnasSensorEmpresa}
                                                filtradoBase={{ empresaId: empresa.id }}
                                                deleteRegistro={deleteEnvioSensorEmpresa}
                                                editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                            />
                                        </>
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar sensores' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Pallets asignados a empresa' })}>
                                    {empresa.id ? (
                                        <PalletsAsignadosEmpresa empresaId={empresa.id} />
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar pallets asignados' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Tipos de carrocería' })}>
                                    <Crud
                                        headerCrud={intl.formatMessage({ id: 'Tipos de Carrocería' })}
                                        getRegistros={getTipoCarroceria}
                                        getRegistrosCount={getTipoCarroceriaCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Tipos de Carrocería"}
                                        filtradoBase={{ empresaId: empresa.id }}
                                        editarComponente={<EditarTipoCarroceria />}
                                        columnas={columnasCatalogosGlobales}
                                        deleteRegistro={deleteTipoCarroceria}
                                        editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                    />
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Tipo de transporte' })}>
                                    <Crud
                                        headerCrud={intl.formatMessage({ id: 'Tipos de Transporte' })}
                                        getRegistros={getTipoTransporte}
                                        getRegistrosCount={getTipoTransporteCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Tipo Transporte"}
                                        filtradoBase={{ empresaId: empresa.id }}
                                        editarComponente={<EditarTipoTransporte />}
                                        columnas={columnasCatalogosGlobales}
                                        deleteRegistro={deleteTipoTransporte}
                                        editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                    />
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Configuración de eventos' })}>
                                    <Crud
                                        headerCrud={intl.formatMessage({ id: 'Configuración de eventos (solo lectura)' })}
                                        getRegistros={getEventoConfiguracion}
                                        getRegistrosCount={getEventoConfiguracionCount}
                                        botones={[]}
                                        controlador={"Eventos Configuracion"}
                                        editarComponente={<div />}
                                        columnas={columnasEventoConfiguracion}
                                        deleteRegistro={() => { }}
                                        editarComponenteParametrosExtra={{ estoyDentroDeUnTab: true }}
                                    />
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
