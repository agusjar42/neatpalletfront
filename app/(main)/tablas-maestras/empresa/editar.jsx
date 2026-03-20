"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { postEmpresa, patchEmpresa } from "@/app/api-endpoints/empresa";
import { getVistaUsuarios, getVistaUsuariosCount, deleteUsuario } from "@/app/api-endpoints/usuario";
import { getCliente, getClienteCount, deleteCliente } from "@/app/api-endpoints/cliente";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import { getEnvioSensorEmpresa, getEnvioSensorEmpresaCount, deleteEnvioSensorEmpresa } from "@/app/api-endpoints/envio-sensor-empresa";
import { getPallet, getPalletCount, deletePallet } from "@/app/api-endpoints/pallet";
import { getTipoCarroceria, getTipoCarroceriaCount, deleteTipoCarroceria } from "@/app/api-endpoints/tipo-carroceria";
import { getTipoTransporte, getTipoTransporteCount, deleteTipoTransporte } from "@/app/api-endpoints/tipo-transporte";
import { getEventoConfiguracion, getEventoConfiguracionCount } from "@/app/api-endpoints/evento-configuracion";
import EditarDatosEmpresa from "./EditarDatosEmpresa";
import EditarUsuario from "../../usuarios/editar";
import EditarCliente from "../../cliente/editar";
import EditarEnvio from "../../envio/editar";
import EditarEnvioSensorEmpresa from "../../envio-sensor-empresa/editar";
import EditarPallet from "../../pallet/editar";
import EditarTipoCarroceria from "../../tipo-carroceria/editar";
import EditarTipoTransporte from "../../tipo-transporte/editar";
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

    const columnasPalletAsignado = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'codigo', header: intl.formatMessage({ id: 'Código' }), tipo: 'string' },
        { campo: 'alias', header: intl.formatMessage({ id: 'Alias' }), tipo: 'string' },
        { campo: 'modelo', header: intl.formatMessage({ id: 'Modelo' }), tipo: 'string' },
        { campo: 'medidas', header: intl.formatMessage({ id: 'Medidas' }), tipo: 'string' },
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
                                        <Crud
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
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar sensores' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Pallets asignados a empresa' })}>
                                    {empresa.id ? (
                                        <Crud
                                            headerCrud={intl.formatMessage({ id: 'Pallets asignados a empresa' })}
                                            getRegistros={getPallet}
                                            getRegistrosCount={getPalletCount}
                                            botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV', 'importarCSVPallets']}
                                            controlador={"Pallet"}
                                            editarComponente={<EditarPallet />}
                                            columnas={columnasPalletAsignado}
                                            filtradoBase={{ empresaId: empresa.id }}
                                            deleteRegistro={deletePallet}
                                            editarComponenteParametrosExtra={{ empresaId: empresa.id, estoyDentroDeUnTab: true }}
                                        />
                                    ) : renderTabNoDisponible(intl.formatMessage({ id: 'Debe guardar la empresa primero para poder gestionar pallets asignados' }))}
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Tipos de carrocería' })}>
                                    <Crud
                                        headerCrud={intl.formatMessage({ id: 'Tipos de Carrocería' })}
                                        getRegistros={getTipoCarroceria}
                                        getRegistrosCount={getTipoCarroceriaCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Tipos de Carrocería"}
                                        editarComponente={<EditarTipoCarroceria />}
                                        columnas={columnasCatalogosGlobales}
                                        deleteRegistro={deleteTipoCarroceria}
                                        editarComponenteParametrosExtra={{ estoyDentroDeUnTab: true }}
                                    />
                                </TabPanel>

                                <TabPanel header={intl.formatMessage({ id: 'Tipo de transporte' })}>
                                    <Crud
                                        headerCrud={intl.formatMessage({ id: 'Tipos de Transporte' })}
                                        getRegistros={getTipoTransporte}
                                        getRegistrosCount={getTipoTransporteCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Tipo Transporte"}
                                        editarComponente={<EditarTipoTransporte />}
                                        columnas={columnasCatalogosGlobales}
                                        deleteRegistro={deleteTipoTransporte}
                                        editarComponenteParametrosExtra={{ estoyDentroDeUnTab: true }}
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
