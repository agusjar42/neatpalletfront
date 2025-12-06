import React, { useState, useEffect, useRef } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { useIntl } from 'react-intl';
import Crud from "../../components/shared/crud";
import { getOperario, getOperarioCount, deleteOperario } from "@/app/api-endpoints/operario";
import { getLugarParada, getLugarParadaCount, deleteLugarParada } from "@/app/api-endpoints/lugar-parada";
import { getProducto, getProductoCount, deleteProducto } from "@/app/api-endpoints/producto";
import EditarOperarios from "../operario/editar";
import EditarLugarParadas from "../lugar-parada/editar";
import EditarProductos from "../producto/editar";
import { InputNumber } from "primereact/inputnumber";

const EditarDatosCliente = ({ cliente, setCliente, estadoGuardando }) => {
    const intl = useIntl();
    const [activeIndex, setActiveIndex] = useState(0);

    // Estados para los contadores de cada tab
    const [conteoOperarios, setConteoOperarios] = useState(0);
    const [conteoLugares, setConteoLugares] = useState(0);
    const [conteoProductos, setConteoProductos] = useState(0);
    const [refreshConteos, setRefreshConteos] = useState(0);

    // Columnas para las diferentes tablas
    const columnasOperario = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'email', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
    ];

    const columnasLugarParada = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'direccion', header: intl.formatMessage({ id: 'Dirección' }), tipo: 'string' },
        { campo: 'direccionGps', header: intl.formatMessage({ id: 'Dirección GPS' }), tipo: 'string' },
    ];

    const columnasProducto = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
    ];

    // Efecto para actualizar conteos cuando se carga el cliente
    useEffect(() => {
        const actualizarConteos = async () => {
            if (cliente.id) {
                try {
                    const whereFiltro = { and: { clienteId: cliente.id } };
                    const [conteoOp, conteoLug, conteoProd] = await Promise.all([
                        getOperarioCount(JSON.stringify(whereFiltro)),
                        getLugarParadaCount(JSON.stringify(whereFiltro)),
                        getProductoCount(JSON.stringify(whereFiltro))
                    ]);
                    
                    setConteoOperarios(conteoOp?.count || 0);
                    setConteoLugares(conteoLug?.count || 0);
                    setConteoProductos(conteoProd?.count || 0);
                } catch (error) {
                    console.error('Error al obtener conteos:', error);
                }
            }
        };

        actualizarConteos();
    }, [cliente.id, refreshConteos]);

    return (
        <div>
            {/* Información general del cliente */}
            <Fieldset legend={intl.formatMessage({ id: 'Datos del cliente' })}>
                <div className="formgrid grid">
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                        <InputText 
                            value={cliente.nombre || ""}
                            placeholder={intl.formatMessage({ id: 'Nombre del cliente' })}
                            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                            className={`${(estadoGuardando && (cliente.nombre === "" || cliente.nombre === undefined)) ? "p-invalid" : ""}`}
                            maxLength={50} 
                        />
                    </div>
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="telefono">{intl.formatMessage({ id: 'Teléfono' })}</label>
                        <InputText 
                            value={cliente.telefono || ""}
                            placeholder={intl.formatMessage({ id: 'Teléfono del cliente' })}
                            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                            maxLength={50} 
                            style={{ textAlign: 'right' }}
                        />
                    </div>
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="mail">{intl.formatMessage({ id: 'Email' })}</label>
                        <InputText 
                            value={cliente.mail || ""}
                            placeholder={intl.formatMessage({ id: 'Email del cliente' })}
                            onChange={(e) => setCliente({ ...cliente, mail: e.target.value })}
                            maxLength={50} 
                        />
                    </div>
                </div>
            </Fieldset>

            {/* Pestañas para bloques adicionales */}
            <div className="mt-4">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header={`${intl.formatMessage({ id: 'Operarios' })} (${conteoOperarios})`}>
                        <div>
                            {/* Solo mostrar la tabla de operarios si el cliente ya está creado */}
                            {cliente.id ? (
                                <>
                                    {/* Bocadillo de información */}
                                    <div className="p-mt-3 mb-3">
                                        <div className="flex align-items-center bg-green-100 border-round p-3 w-full">
                                            <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                            <span>
                                                {intl.formatMessage({ id: 'Gestión de operarios asociados al cliente.' })}
                                            </span>
                                        </div>
                                    </div>
                                    {<Crud
                                        key={`operario-${refreshConteos}`}
                                        headerCrud={intl.formatMessage({ id: 'Operarios del Cliente' })}
                                        getRegistros={getOperario}
                                        getRegistrosCount={getOperarioCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Operarios"}
                                        editarComponente={<EditarOperarios />}
                                        columnas={columnasOperario}
                                        filtradoBase={{clienteId: cliente.id}}
                                        deleteRegistro={deleteOperario}
                                        cargarDatosInicialmente={true}
                                        editarComponenteParametrosExtra={{
                                            clienteId: cliente.id,
                                            estoyDentroDeUnTab: true,
                                            onDataChange: () => setRefreshConteos(prev => prev + 1)
                                        }}
                                    />}
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                    <p className="text-gray-600">
                                        {intl.formatMessage({ id: 'Debe guardar el cliente primero para poder gestionar operarios' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel header={`${intl.formatMessage({ id: 'Lugares de Parada' })} (${conteoLugares})`}>
                        <div>
                            {/* Solo mostrar la tabla de lugares si el cliente ya está creado */}
                            {cliente.id ? (
                                <>
                                    {/* Bocadillo de información */}
                                    <div className="p-mt-3 mb-3">
                                        <div className="flex align-items-center bg-green-100 border-round p-3 w-full">
                                            <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                            <span>
                                                {intl.formatMessage({ id: 'Gestión de lugares de parada asociados al cliente.' })}
                                            </span>
                                        </div>
                                    </div>
                                    {<Crud
                                        key={`lugar-parada-${refreshConteos}`}
                                        headerCrud={intl.formatMessage({ id: 'Lugares de Parada del Cliente' })}
                                        getRegistros={getLugarParada}
                                        getRegistrosCount={getLugarParadaCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Lugar Parada"}
                                        editarComponente={<EditarLugarParadas />}
                                        columnas={columnasLugarParada}
                                        filtradoBase={{clienteId: cliente.id}}
                                        deleteRegistro={deleteLugarParada}
                                        cargarDatosInicialmente={true}
                                        editarComponenteParametrosExtra={{
                                            clienteId: cliente.id,
                                            estoyDentroDeUnTab: true,
                                            onDataChange: () => setRefreshConteos(prev => prev + 1)
                                        }}
                                    />}
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                    <p className="text-gray-600">
                                        {intl.formatMessage({ id: 'Debe guardar el cliente primero para poder gestionar lugares de parada' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel header={`${intl.formatMessage({ id: 'Productos' })} (${conteoProductos})`}>
                        <div>
                            {/* Solo mostrar la tabla de productos si el cliente ya está creado */}
                            {cliente.id ? (
                                <>
                                    {/* Bocadillo de información */}
                                    <div className="p-mt-3 mb-3">
                                        <div className="flex align-items-center bg-green-100 border-round p-3 w-full">
                                            <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                                            <span>
                                                {intl.formatMessage({ id: 'Gestión de productos asociados al cliente.' })}
                                            </span>
                                        </div>
                                    </div>
                                    {<Crud
                                        key={`producto-${refreshConteos}`}
                                        headerCrud={intl.formatMessage({ id: 'Productos del Cliente' })}
                                        getRegistros={getProducto}
                                        getRegistrosCount={getProductoCount}
                                        botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                                        controlador={"Productos"}
                                        editarComponente={<EditarProductos />}
                                        columnas={columnasProducto}
                                        filtradoBase={{clienteId: cliente.id}}
                                        deleteRegistro={deleteProducto}
                                        cargarDatosInicialmente={true}
                                        editarComponenteParametrosExtra={{
                                            clienteId: cliente.id,
                                            estoyDentroDeUnTab: true,
                                            onDataChange: () => setRefreshConteos(prev => prev + 1)
                                        }}
                                    />}
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
                                    <p className="text-gray-600">
                                        {intl.formatMessage({ id: 'Debe guardar el cliente primero para poder gestionar productos' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default EditarDatosCliente;