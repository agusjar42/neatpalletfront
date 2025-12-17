import React, { useState, useEffect, useRef } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useIntl } from 'react-intl';
import Crud from "../../components/shared/crud";
import { crearEnvioConfiguracionDesdeEmpresa, crearEnvioSensorDesdeEmpresa } from "@/app/api-endpoints/envio";
import { getEnvioConfiguracion, getEnvioConfiguracionCount, deleteEnvioConfiguracion } from "@/app/api-endpoints/envio-configuracion";
import { getEnvioSensor, getEnvioSensorCount, deleteEnvioSensor } from "@/app/api-endpoints/envio-sensor";
import { getEnvioContenido, getEnvioContenidoCount, deleteEnvioContenido } from "@/app/api-endpoints/envio-contenido";
import { getEnvioMovimiento, getEnvioMovimientoCount, deleteEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import { getEnvioPallet, getEnvioPalletCount, deleteEnvioPallet } from "@/app/api-endpoints/envio-pallet";
import { getEnvioParada, getEnvioParadaCount, deleteEnvioParada } from "@/app/api-endpoints/envio-parada";
import { getCliente } from "@/app/api-endpoints/cliente";
import EditarEnvioConfiguracion from "../envio-configuracion/editar";
import EditarEnvioContenido from "../envio-contenido/editar";
import EditarEnvioMovimiento from "../envio-movimiento/editar";
import EditarEnvioPallet from "../envio-pallet/editar";
import EditarEnvioParada from "../envio-parada/editar";
import EditarEnvioSensors from "../envio-sensor/editar";
import { getUsuarioSesion } from "@/app/utility/Utils";


const EditarDatosEnvio = ({ envio, setEnvio, estadoGuardando }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [cargandoConfiguracion, setCargandoConfiguracion] = useState(false);
    const [refreshConfiguracion, setRefreshConfiguracion] = useState(0);
    const [cargandoSensores, setCargandoSensores] = useState(false);
    const [refreshSensores, setRefreshSensores] = useState(0);
    const [clientes, setClientes] = useState([]);

    // Estados para los contadores de cada tab (solo para Movimientos, Pallets y Paradas)
    const [conteoMovimiento, setConteoMovimiento] = useState(0);
    const [conteoPallet, setConteoPallet] = useState(0);
    const [conteoParada, setConteoParada] = useState(0);
    const [refreshConteos, setRefreshConteos] = useState(0);

    // Columnas para las diferentes tablas
    const columnasConfiguracion = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
    ];

    const columnasContenido = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombreProducto', header: intl.formatMessage({ id: 'Producto' }), tipo: 'string' },
        { campo: 'codigoPallet', header: intl.formatMessage({ id: 'Código Pallet' }), tipo: 'string' },
        { campo: 'referencia', header: intl.formatMessage({ id: 'Referencia' }), tipo: 'string' },
        { campo: 'pesoKgs', header: intl.formatMessage({ id: 'Peso (Kg)' }), tipo: 'number' },
        { campo: 'cantidad', header: intl.formatMessage({ id: 'Cantidad' }), tipo: 'number' },
        { campo: 'pesoTotal', header: intl.formatMessage({ id: 'Peso Total (Kg)' }), tipo: 'number' },
        { campo: 'medidas', header: intl.formatMessage({ id: 'Medidas' }), tipo: 'string' },
    ];

    const columnasMovimiento = [
        { campo: 'fechaEspanol', header: intl.formatMessage({ id: 'Fecha' }), tipo: 'date' },
        { campo: 'nombreSensor', header: intl.formatMessage({ id: 'Sensor' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'gps', header: intl.formatMessage({ id: 'GPS' }), tipo: 'string' },
    ];

    const columnasPallet = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombreProducto', header: intl.formatMessage({ id: 'Producto' }), tipo: 'string' },
        { campo: 'referencia', header: intl.formatMessage({ id: 'Referencia' }), tipo: 'string' },
        { campo: 'codigo', header: intl.formatMessage({ id: 'Código Pallet' }), tipo: 'string' },
        { campo: 'alias', header: intl.formatMessage({ id: 'Alias' }), tipo: 'string' },
        { campo: 'modelo', header: intl.formatMessage({ id: 'Modelo' }), tipo: 'string' },
    ];

    const columnasParada = [
        { campo: 'fechaEspanol', header: intl.formatMessage({ id: 'Fecha' }), tipo: 'date' },
        { campo: 'lugarParada', header: intl.formatMessage({ id: 'Lugar' }), tipo: 'string' },
        { campo: 'direccion', header: intl.formatMessage({ id: 'Dirección' }), tipo: 'string' },
        { campo: 'nombreOperario', header: intl.formatMessage({ id: 'Operario' }), tipo: 'string' },
    ];

    const columnasSensorEmpresa = [
        { campo: 'nombreSensor', header: intl.formatMessage({ id: 'Tipo de Sensor' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ];

    // Cargar clientes al inicializar el componente
    useEffect(() => {
        const cargarClientes = async () => {
            try {
                const empresaId = getUsuarioSesion()?.empresaId;
                const filtroClientes = JSON.stringify({ where: { and: { empresaId: empresaId } } });
                const dataClientes = await getCliente(filtroClientes);
                setClientes(dataClientes || []);
            } catch (error) {
                console.error('Error cargando clientes:', error);
            }
        };
        cargarClientes();
    }, []);

    // Cargar los conteos de Movimientos, Pallets y Paradas
    useEffect(() => {
        const cargarConteos = async () => {
            if (envio.id) {
                try {
                    const whereFiltro = { and: { envioId: envio.id } };

                    const [movimientoCount, palletCount, paradaCount] = await Promise.all([
                        getEnvioMovimientoCount(JSON.stringify(whereFiltro)),
                        getEnvioPalletCount(JSON.stringify(whereFiltro)),
                        getEnvioParadaCount(JSON.stringify(whereFiltro))
                    ]);

                    setConteoMovimiento(movimientoCount[0]?.count || 0);
                    setConteoPallet(palletCount[0]?.count || 0);
                    setConteoParada(paradaCount[0]?.count || 0);
                } catch (error) {
                    console.error('Error cargando conteos:', error);
                }
            }
        };

        cargarConteos();
    }, [envio.id, refreshConteos, activeIndex]);

    const handleCrearConfiguracionDesdeEmpresa = () => {
        if (!envio.id) {
            toast.current?.show({
                severity: 'warn',
                summary: intl.formatMessage({ id: 'Advertencia' }),
                detail: intl.formatMessage({ id: 'Debe guardar el envío primero' }),
                life: 3000,
            });
            return;
        }

        confirmDialog({
            message: intl.formatMessage({ id: '¿Está seguro que desea crear la configuración desde la empresa? Esto sobrescribirá la configuración actual del envío.' }),
            header: intl.formatMessage({ id: 'Confirmación' }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: intl.formatMessage({ id: 'Sí' }),
            rejectLabel: intl.formatMessage({ id: 'No' }),
            accept: async () => {
                setCargandoConfiguracion(true);
                try {
                    const datosEnvio = {envioId: envio.id, empresaId: envio.empresaId, clienteId: envio.clienteId, usuarioCreacion: getUsuarioSesion()?.id};
                    await crearEnvioConfiguracionDesdeEmpresa(datosEnvio);
                    toast.current?.show({
                        severity: 'success',
                        summary: intl.formatMessage({ id: 'Éxito' }),
                        detail: intl.formatMessage({ id: 'Configuración creada desde empresa correctamente' }),
                        life: 3000,
                    });
                    // Refrescar el CRUD de configuración
                    setRefreshConfiguracion(prev => prev + 1);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: intl.formatMessage({ id: 'Error' }),
                        detail: intl.formatMessage({ id: 'Error al crear la configuración desde empresa' }),
                        life: 3000,
                    });
                } finally {
                    setCargandoConfiguracion(false);
                }
            }
        });
    };

    const handleCrearSensoresDesdeEmpresa = () => {
        if (!envio.id) {
            toast.current?.show({
                severity: 'warn',
                summary: intl.formatMessage({ id: 'Advertencia' }),
                detail: intl.formatMessage({ id: 'Debe guardar el envío primero' }),
                life: 3000,
            });
            return;
        }

        confirmDialog({
            message: intl.formatMessage({ id: '¿Está seguro que desea crear los sensores desde la empresa? Esto sobrescribirá los sensores actuales del envío.' }),
            header: intl.formatMessage({ id: 'Confirmación' }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: intl.formatMessage({ id: 'Sí' }),
            rejectLabel: intl.formatMessage({ id: 'No' }),
            accept: async () => {
                setCargandoSensores(true);
                try {
                    const datosEnvio = {envioId: envio.id, empresaId: envio.empresaId, clienteId: envio.clienteId, usuarioCreacion: getUsuarioSesion()?.id};
                    await crearEnvioSensorDesdeEmpresa(datosEnvio);
                    toast.current?.show({
                        severity: 'success',
                        summary: intl.formatMessage({ id: 'Éxito' }),
                        detail: intl.formatMessage({ id: 'Sensores creados desde empresa correctamente' }),
                        life: 3000,
                    });
                    // Refrescar el CRUD de sensores
                    setRefreshSensores(prev => prev + 1);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: intl.formatMessage({ id: 'Error' }),
                        detail: intl.formatMessage({ id: 'Error al crear los sensores desde empresa' }),
                        life: 3000,
                    });
                } finally {
                    setCargandoSensores(false);
                }
            }
        });
    };

    return (
        <>
            <Toast ref={toast} position="top-right" />
            <Fieldset legend={intl.formatMessage({ id: 'Datos del envío' })}>
                <div className="formgrid grid">
                {/* Campo Orden */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={envio.orden}
                        placeholder={intl.formatMessage({ id: 'Orden del envío' })}
                        onChange={(e) => setEnvio({ ...envio, orden: e.value })}
                        className={`${(estadoGuardando && (envio.orden === "" || envio.orden === null || envio.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999} 
                        inputStyle={{ textAlign: 'right' }}/>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="clienteId"><b>{intl.formatMessage({ id: 'Cliente' })}*</b></label>
                    <Dropdown 
                        value={envio.clienteId}
                        options={clientes}
                        onChange={(e) => setEnvio({ ...envio, clienteId: e.value })}
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder={intl.formatMessage({ id: 'Seleccione un cliente' })}
                        className={`${(estadoGuardando && (envio.clienteId === "" || envio.clienteId === null || envio.clienteId === undefined)) ? "p-invalid" : ""}`}
                        filter
                        showClear
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="numero"><b>{intl.formatMessage({ id: 'Numero' })}*</b></label>
                    <InputText 
                        value={envio.numero || ""}
                        placeholder={intl.formatMessage({ id: 'Ingrese el numero' })}
                        onChange={(e) => setEnvio({ ...envio, numero: e.target.value })}
                        className={`${(estadoGuardando && (envio.numero === "" || envio.numero === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="origenRuta"><b>{intl.formatMessage({ id: 'Origen de la ruta' })}*</b></label>
                    <InputText 
                        value={envio.origenRuta || ""}
                        placeholder={intl.formatMessage({ id: 'Ingrese el origen' })}
                        onChange={(e) => setEnvio({ ...envio, origenRuta: e.target.value })}
                        className={`${(estadoGuardando && (envio.origenRuta === "" || envio.origenRuta === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="destinoRuta"><b>{intl.formatMessage({ id: 'Destino de la ruta' })}*</b></label>
                    <InputText 
                        value={envio.destinoRuta || ""}
                        placeholder={intl.formatMessage({ id: 'Ingrese el destino' })}
                        onChange={(e) => setEnvio({ ...envio, destinoRuta: e.target.value })}
                        className={`${(estadoGuardando && (envio.destinoRuta === "" || envio.destinoRuta === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                {/* Segunda fila */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="gpsRutaOrigen"><b>{intl.formatMessage({ id: 'GPS Ruta Origen' })}*</b></label>
                    <InputText 
                        value={envio.gpsRutaOrigen || ""}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS origen (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, gpsRutaOrigen: e.target.value })}
                        className={`${(estadoGuardando && (envio.gpsRutaOrigen === "" || envio.gpsRutaOrigen === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="gpsRutaDestino"><b>{intl.formatMessage({ id: 'GPS Ruta Destino' })}*</b></label>
                    <InputText 
                        value={envio.gpsRutaDestino || ""}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS destino (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, gpsRutaDestino: e.target.value })}
                        className={`${(estadoGuardando && (envio.gpsRutaDestino === "" || envio.gpsRutaDestino === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                {/* Tercera fila */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="fechaSalida"><b>{intl.formatMessage({ id: 'Fecha de salida' })}*</b></label>
                    <InputText type="datetime-local"
                        value={envio.fechaSalida}
                        placeholder={intl.formatMessage({ id: 'Seleccione fecha y hora de salida' })}
                        onChange={(e) => setEnvio({ ...envio, fechaSalida: e.target.value })}
                        className={`${(estadoGuardando && (envio.fechaSalida === "" || envio.fechaSalida === undefined)) ? "p-invalid" : ""}`}
                        maxLength={20}
                        style={{ textAlign: 'right' }}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="fechaLlegada"><b>{intl.formatMessage({ id: 'Fecha de llegada' })}*</b></label>
                    <InputText type="datetime-local"
                        value={envio.fechaLlegada}
                        placeholder={intl.formatMessage({ id: 'Seleccione fecha y hora de llegada' })}
                        onChange={(e) => setEnvio({ ...envio, fechaLlegada: e.target.value })}
                        className={`${(estadoGuardando && (envio.fechaLlegada === "" || envio.fechaLlegada === undefined)) ? "p-invalid" : ""}`}
                        maxLength={20}
                        style={{ textAlign: 'right' }}
                    />
                </div>

                {false && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                        <label htmlFor="paradasPrevistas">{intl.formatMessage({ id: 'Paradas previstas' })}</label>
                        <InputNumber
                            value={envio.paradasPrevistas || 0}
                            onValueChange={(e) => setEnvio({ ...envio, paradasPrevistas: e.value })}
                            placeholder={intl.formatMessage({ id: 'Número de paradas' })}
                            min={0}
                            max={999}
                            showButtons
                            buttonLayout="horizontal"
                            step={1}
                            inputStyle={{ textAlign: 'right' }}
                        />
                    </div>
                )}
                </div>
            </Fieldset>

        {/* Pestañas para bloques adicionales */}
        <div className="mt-4">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header={intl.formatMessage({ id: 'Configuración' })}>
                    <div>
                        {/* Solo mostrar la tabla de configuración si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                <div className="flex justify-content-end mb-3">
                                    <Button
                                        label={cargandoConfiguracion ? intl.formatMessage({ id: 'Creando configuración...' }) : intl.formatMessage({ id: 'Clonar configuración desde empresa' })}
                                        icon={cargandoConfiguracion ? "pi pi-spin pi-spinner" : "pi pi-copy"}
                                        onClick={handleCrearConfiguracionDesdeEmpresa}
                                        disabled={cargandoConfiguracion}
                                        className="p-button-help"
                                        tooltip={intl.formatMessage({ id: 'Copia la configuración predeterminada de la empresa a este envío' })}
                                        tooltipOptions={{ position: 'left' }}
                                    />
                                </div>
                                <Crud
                                    key={`configuracion-${refreshConfiguracion}`}
                                    headerCrud={intl.formatMessage({ id: 'Configuración del Envío' })}
                                    getRegistros={getEnvioConfiguracion}
                                    getRegistrosCount={getEnvioConfiguracionCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                    controlador={"Envio Configuracion"}
                                    editarComponente={<EditarEnvioConfiguracion />}
                                    columnas={columnasConfiguracion}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioConfiguracion}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        estoyDentroDeUnTab: true
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir configuración' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header={intl.formatMessage({ id: 'Contenido' })}>
                    <div>
                        {/* Bocadillo de información */}
                        <div className="p-mt-3">
                            <div
                                className="flex align-items-center bg-green-100 border-round p-3 w-full"
                            >
                                <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                <span>
                                    {intl.formatMessage({ id: 'Se muestra la suma de los productos a enviar en un envío.' })}
                                </span>
                            </div>
                        </div>
                        {/* Solo mostrar la tabla de contenido si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {!envio.clienteId && (
                                    <div className="p-mt-3">
                                        <div className="flex align-items-center bg-orange-100 border-round p-3 w-full">
                                            <span className="pi pi-exclamation-triangle text-orange-600 mr-2" style={{ fontSize: "1.5em" }} />
                                            <span className="text-orange-700">
                                                {intl.formatMessage({ id: 'Debe seleccionar un cliente para el envío antes de poder añadir contenido' })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <Crud
                                    headerCrud={intl.formatMessage({ id: 'Contenido del Envío' })}
                                    getRegistros={getEnvioContenido}
                                    getRegistrosCount={getEnvioContenidoCount}
                                    botones={envio.clienteId ? ['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV'] : ['ver', 'editar', 'eliminar', 'descargarCSV']}
                                    controlador={"Envio Contenido"}
                                    editarComponente={<EditarEnvioContenido />}
                                    columnas={columnasContenido}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioContenido}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        clienteId: envio.clienteId,
                                        estoyDentroDeUnTab: true
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir contenido' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>                
                
                <TabPanel header={`${intl.formatMessage({ id: 'Movimientos' })} (${conteoMovimiento})`}>
                    <div>
                        {/* Solo mostrar la tabla de movimientos si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-green-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: 'Se muestran los movimientos del envío a partir de los valores mínimos definidos en los sensores. Ejemplo: Si el valor de la temperatura es 23 y existe un registro cuyo valor es 22 no aparecerá en esta tabla ni en los informes.' })}
                                        </span>
                                    </div>
                                </div>
                                 <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-red-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: 'No veo para que sirve la imagen aquí. Igual que en otros sitios mencionados, es un valor manual que debe poner el usuario en cada movimiento y no lo veo claro.' })}
                                        </span>
                                    </div>
                                </div>
                                <Crud
                                    key={`movimiento-${refreshConteos}`}
                                    headerCrud={intl.formatMessage({ id: 'Movimientos del Envío' })}
                                    getRegistros={getEnvioMovimiento}
                                    getRegistrosCount={getEnvioMovimientoCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV', 'generarGrafico']}
                                    controlador={"Envio Movimiento"}
                                    editarComponente={<EditarEnvioMovimiento />}
                                    columnas={columnasMovimiento}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioMovimiento}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        estoyDentroDeUnTab: true,
                                        onDataChange: () => setRefreshConteos(prev => prev + 1)
                                    }}
                                />
                                </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir movimientos' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header={`${intl.formatMessage({ id: 'Pallets' })} (${conteoPallet})`} style={{display:"none"}}> 
                    <div>
                        {/* Solo mostrar la tabla de pallets si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-green-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: 'Visualización de los pallets enviados y el producto que contiene cada uno de ellos.' })}
                                        </span>
                                    </div>
                                </div>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-red-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: '¿Que pasa si lleno un pallet con diferente producto?.' })}
                                        </span>
                                    </div>
                                </div>
                                <Crud
                                    key={`pallet-${refreshConteos}`}
                                    headerCrud={intl.formatMessage({ id: 'Pallets del Envío' })}
                                    getRegistros={getEnvioPallet}
                                    getRegistrosCount={getEnvioPalletCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                    controlador={"Envio Pallet"}
                                    editarComponente={<EditarEnvioPallet />}
                                    columnas={columnasPallet}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioPallet}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        estoyDentroDeUnTab: true,
                                        onDataChange: () => setRefreshConteos(prev => prev + 1)
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir pallets' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header={`${intl.formatMessage({ id: 'Paradas' })} (${conteoParada})`}>
                    <div>
                        {/* Solo mostrar la tabla de paradas si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-red-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: '¿Como se van a gestionar las paradas?. Veo esto un proceso muy manual que no se si van a querer configurarlo, de momento lo dejo parado.' })}
                                        </span>
                                    </div>
                                </div>
                                <Crud
                                    key={`parada-${refreshConteos}`}
                                    headerCrud={intl.formatMessage({ id: 'Paradas del Envío' })}
                                    getRegistros={getEnvioParada}
                                    getRegistrosCount={getEnvioParadaCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                    controlador={"Envio Parada"}
                                    editarComponente={<EditarEnvioParada />}
                                    columnas={columnasParada}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioParada}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        estoyDentroDeUnTab: true,
                                        onDataChange: () => setRefreshConteos(prev => prev + 1)
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir paradas' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header={intl.formatMessage({ id: 'Sensores' })}>
                    <div>
                        {/* Solo mostrar la tabla de sensores si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-green-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: 'Al crear un nuevo envío se asocian automáticamente los sensores de la empresa. Estos pueden cambiarse, eliminarse o añadirse nuevos siempre que desde la pantalla Sensores estén activos.' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-content-end mb-3">
                                    <Button
                                        label={cargandoSensores ? intl.formatMessage({ id: 'Creando sensores...' }) : intl.formatMessage({ id: 'Clonar sensores desde empresa' })}
                                        icon={cargandoSensores ? "pi pi-spin pi-spinner" : "pi pi-copy"}
                                        onClick={handleCrearSensoresDesdeEmpresa}
                                        disabled={cargandoSensores}
                                        className="p-button-help"
                                        tooltip={intl.formatMessage({ id: 'Copia la configuración predeterminada de la empresa a este envío' })}
                                        tooltipOptions={{ position: 'left' }}
                                    />
                                </div>
                                <Crud
                                    key={`sensor-empresa-${refreshSensores}`}
                                    headerCrud={intl.formatMessage({ id: 'Sensores del Envío' })}
                                    getRegistros={getEnvioSensor}
                                    getRegistrosCount={getEnvioSensorCount}
                                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                    controlador={"Envio Sensor Empresa"}
                                    editarComponente={<EditarEnvioSensors />}
                                    columnas={columnasSensorEmpresa}
                                    filtradoBase={{envioId: envio.id}}
                                    deleteRegistro={deleteEnvioSensor}
                                    cargarDatosInicialmente={true}
                                    editarComponenteParametrosExtra={{
                                        envioId: envio.id,
                                        estoyDentroDeUnTab: true
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder añadir sensores' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header={intl.formatMessage({ id: 'Resumen Envío' })}>
                    <div>
                        {/* Solo mostrar la tabla de resumen si el envío ya está creado */}
                        {envio.id ? (
                            <>
                                {/* Bocadillo de información */}
                                <div className="p-mt-3">
                                    <div
                                        className="flex align-items-center bg-green-100 border-round p-3 w-full"
                                    >
                                        <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                        <span>
                                            {intl.formatMessage({ id: 'Resumen general del envío mostrando eventos guardados, eventos enviados, total de alarmas y batería actual.' })}
                                        </span>
                                    </div>
                                </div>
                                <Crud
                                    headerCrud={intl.formatMessage({ id: 'Resumen del Envío' })}
                                    getRegistros={(filtro) => import("@/app/api-endpoints/envio").then(m => m.getResumenEnvio(envio.id))}
                                    getRegistrosCount={(filtro) => import("@/app/api-endpoints/envio").then(m => m.getResumenEnvioCount(envio.id))}
                                    botones={['ver', 'descargarCSV']}
                                    controlador={"Resumen Envio"}
                                    editarComponente={null}
                                    columnas={[
                                        { campo: 'eventosGuardados', header: intl.formatMessage({ id: 'Eventos Guardados' }), tipo: 'number' },
                                        { campo: 'eventosEnviados', header: intl.formatMessage({ id: 'Eventos Enviados' }), tipo: 'number' },
                                        { campo: 'totalAlarmas', header: intl.formatMessage({ id: 'Total Alarmas' }), tipo: 'number' },
                                        { campo: 'bateriaActual', header: intl.formatMessage({ id: 'Batería Actual' }), tipo: 'number' }
                                    ]}
                                    filtradoBase={{envioId: envio.id}}
                                    cargarDatosInicialmente={true}
                                    soloLectura={true}
                                />
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                <p className="text-gray-600">
                                    {intl.formatMessage({ id: 'Debe guardar el envío primero para poder ver el resumen' })}
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
            </TabView>
        </div>
        </>
    );
};

export default EditarDatosEnvio;