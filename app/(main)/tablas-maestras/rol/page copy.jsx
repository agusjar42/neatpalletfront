"use client";

import React, { useEffect, useRef, useState } from "react";

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Badge } from 'primereact/badge';
import { Toast } from "primereact/toast";
import { getRol, postRol, patchRol, deleteRol, buscaPermisosExistente, getEmpresas, getVistaEmpresaRol } from "@/app/api-endpoints/rol";
import { formatearFechaLocal_a_toISOString, getUsuarioSesion } from "@/app/utility/Utils";
import { AutoComplete } from "primereact/autocomplete";
// imports para Can
import { useAbility } from '@/app/utility/Can'
import { useIntl } from 'react-intl'

const Rol = () => {
    const intl = useIntl()
    let emptyRol = {
        id: "",
        empresaId: "",
        nombre: "",
        activoSn: "S",
    };
    const ability = useAbility() // Usar ability para mostrar u ocultar botones
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [filtradoEmpresas, setFiltradoEmpresas] = useState([]);
    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [listaRolesEmpresa, setListaRolesEmpresa] = useState([]);
    const [rol, setRol] = useState(emptyRol);
    const [rolDialog, setRolDialog] = useState(false);
    const [eliminarRolDialog, setEliminarRolDialog] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [accion, setAccion] = useState('');
    const [valorDeFiltroGlobal, setValorDeFiltroGlobal] = useState('');
    const [filtros, setFiltros] = useState(null);
    const [opcionesActivoSn] = useState(['S', 'N']);
    const toast = useRef(null);
    const referenciaDataTable = useRef(null);
    const [canCrear, setCanCrear] = useState(false);
    const [canEditar, setCanEditar] = useState(false);
    const [canBorrar, setCanBorrar] = useState(false);

    useEffect(() => {
        obtenerDatos();
        inicializarFiltros();
    }, []);

    const obtenerDatos = async () => {
        try {
            // Obtenemos los roles
            const registrosVista = await getVistaEmpresaRol();
            setListaRolesEmpresa(registrosVista);
            const registros = await getRol();
            setRoles(registros);
            // Obtenemos datos de EmpresaControllerApi y creamos un JSON con el código y el valor de las empresas usando map
            const registrosEmpresas = await getEmpresas();
            const jsonDeEmpresas = registrosEmpresas.map(empresa => ({
                nombre: empresa.nombre,
                id: empresa.id
            }));
            // Establecemos los valores del desplegable
            setListaEmpresas(jsonDeEmpresas);

            const checkAbility = async () => {
                const resultNuevo = await ability.can("Neatpallet", "Rol", "Nuevo");
                const resultEditar = await ability.can("Neatpallet", "Rol", "Actualizar");
                const resultBorrar = await ability.can("Neatpallet", "Rol", "Borrar");
                setCanCrear(resultNuevo);
                setCanEditar(resultEditar);
                setCanBorrar(resultBorrar);

            };
            console.log(checkAbility());
        } catch (err) {
            console.log(err.message);
        } finally {
            console.log('Carga completa');
        }
    };

    const crearNuevoRol = () => {
        setRol(emptyRol);
        setAccion('Crear');
        setEmpresaSeleccionada(''); //-> Limpiamos el campo de empresa
        setEnviado(false);
        setRolDialog(true);
    };

    const ocultarDialog = () => {
        setEnviado(false);
        setRolDialog(false);
    };

    const ocultarEliminarRolDialog = () => {
        setEliminarRolDialog(false);
    };

    const guardarRol = async () => {
        setEnviado(true);
        // let _roles = [...roles]; //-> Obtenemos todos los roles de la lista
        let objRol = { ...rol }; //-> Obtenemos el rol actual
        if (objRol.nombre && objRol && objRol.activoSn) {
            if (accion === 'Crear') {
                delete objRol.id;
                objRol.empresaId = empresaSeleccionada.id
                objRol['usuCreacion'] = getUsuarioSesion()?.id;

                const nuevoRol = await postRol(objRol);

                if (nuevoRol?.id) {
                    toast.current?.show({
                        severity: "success",
                        summary: "OK",
                        detail: "Registro creado correctamente.",
                        life: 3000,
                    });
                    obtenerDatos();
                } else {
                    toast.current?.show({
                        severity: "error",
                        summary: "ERROR",
                        detail: "Ha ocurrido un error creando el registro.",
                        life: 3000,
                    });
                }
            } else {

                const rolAeditar = {
                    id: objRol.id,
                    empresaId: objRol.empresaId,
                    nombre: objRol.nombre,
                    activoSn: objRol.activoSn,
                    usuInactivo: objRol.activoSn === 'N' ? getUsuarioSesion()?.id : null,
                    fechaInactivo: objRol.activoSn === 'N' ? formatearFechaLocal_a_toISOString(new Date()) : null,
                    usuModificacion: getUsuarioSesion()?.id,
                };
                const respuestaEdit = await patchRol(objRol.id, rolAeditar);
                if (respuestaEdit === '') {
                    toast.current?.show({
                        severity: "success",
                        summary: "OK",
                        detail: "Registro editado correctamente.",
                        life: 3000,
                    });
                    obtenerDatos();
                } else {
                    toast.current?.show({
                        severity: "error",
                        summary: "ERROR",
                        detail: "Ha ocurrido un error editando el registro.",
                        life: 3000,
                    });
                }
            }
            setRolDialog(false);
            setRol(emptyRol);
        }
    };

    const editarRol = (rol) => {
        setRol({ ...rol });
        const empresa = listaEmpresas.find(emp => emp.nombre === rol.nombreEmpresa);
        if (empresa) {
            setEmpresaSeleccionada(empresa);
        }
        setAccion('Editar');
        setRolDialog(true);
    };

    const confirmarEliminarRol = (rol) => {
        setRol({ ...rol });
        setEliminarRolDialog(true);
    };  

    const eliminaRol = async () => {
        const datosPermisos = await buscaPermisosExistente(rol.id);
        // Si encontramos alguna coincidencia mostramos un mensaje de que esa rol está en uso y no se puede borrar.
        if (datosPermisos.length > 0) {
            toast.current?.show({
                severity: "error",
                summary: "ERROR",
                detail: `No ha sido posible eliminar el registro, porque una empresa la está utilizando.`,
                life: 3000,
            });
            obtenerDatos();
        } else {
            // Si no se encuentra ningún registro en la tabla empresas que utilice está rol se puede borrar.
            const respuestaDelete = await deleteRol(rol.id);
            if (respuestaDelete === '') {
                toast.current?.show({
                    severity: "success",
                    summary: "OK",
                    detail: "Registro eliminado correctamente.",
                    life: 3000,
                });
                obtenerDatos();
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "ERROR",
                    detail: "Ha ocurrido un error eliminando el registro.",
                    life: 3000,
                });
            }
            setRol(emptyRol);
        }
        setEliminarRolDialog(false);
    };

    const obtenerSeverity = (opcion) => {
        switch (opcion) {
            case 'S':
                return 'success';

            case 'N':

                return 'secondary';
        }
    };

    {/* M A N E J A R - C A M B I O S - E N - L O S - I N P U T S */ }
    const manejarCambioInput = (e, nombreInput) => {
        const valor = (e.target && e.target.value) || "";
        let _rol = { ...rol };
        _rol[`${nombreInput}`] = valor;

        setRol(_rol);
    };

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _rol = { ...rol };
        const esTrue = valor === true ? 'S' : 'N';
        _rol[`${nombreInputSwitch}`] = esTrue;

        setRol(_rol);
    };

    {/* C O L U M N A S */ }

    const busquedaEmpresas = (event) => {
        let _listaEmpresasFiltradas;
        if (!event.query.trim().length) {
            _listaEmpresasFiltradas = [...listaEmpresas];
        } else {
            _listaEmpresasFiltradas = listaEmpresas.filter(item =>
                item.nombre.toLowerCase().includes(event.query.toLowerCase())
            );
        }
        setFiltradoEmpresas(_listaEmpresasFiltradas);
    };

    const nombreTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">{intl.formatMessage({ id: 'Nombre' })}</span>
                {rowData.nombre}
            </>
        );
    };

    const activoSNTemplate = (rowData) => {
        const activo = rowData.activoSn === "S" ? "SI" : "NO";
        return (
            <>
                <span className="p-column-title" >ActivoSN</span>
                {rowData.activoSn === "S" && <Badge value={activo} severity="success"></Badge>}
                {rowData.activoSn === "N" && <Badge value={activo} severity="secondary"></Badge>}
            </>
        );
    };

    const botonesDeAccionTemplate = (rowData) => {
        return (
            <>
                {canEditar ? (
                    <Button
                        icon="pi pi-pencil"
                        className="mr-2"
                        rounded
                        severity="success"
                        onClick={() => editarRol(rowData)}
                    />
                ) : null}
                {canBorrar ? (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        severity="warning"
                        onClick={() => confirmarEliminarRol(rowData)}
                    />
                ) : null}
            </>
        );
    };

    {/* F I L T R O S */ }
    const limpiarFiltros = () => {
        inicializarFiltros();
    };

    const inicializarFiltros = () => {
        setFiltros({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            nombreEmpresa: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activoSn: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setValorDeFiltroGlobal('');
    };

    const manejarCambioFiltroGlobal = (e) => {
        const valor = e.target.value;
        let _filtros = { ...filtros };

        _filtros['global'].value = valor;

        setFiltros(_filtros);
        setValorDeFiltroGlobal(valor);
    };

    const filtroDropDownTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                onChange={(e) => {
                    setEmpresaSeleccionada(e.value);
                    options.filterCallback(e.value, options.index); // Usar filterCallback con los nuevos valores
                }}
                options={listaEmpresas.map(empresa => empresa.nombre)}
                className="p-column-filter"
                showClear
                placeholder={intl.formatMessage({ id: 'Selecciona una empresa' })}
            />
        );
    };

    const filtroActivoSnTemplate = (options) => {
        return <Dropdown value={options.value} options={opcionesActivoSn} onChange={(e) => {
            options.filterCallback(e.value, options.index);
        }} itemTemplate={opcionesActivoSnTemplate} placeholder="Opciones" className="p-column-filter" showClear />;
    };

    const opcionesActivoSnTemplate = (option) => {
        return <Badge value={option} severity={obtenerSeverity(option)} />;
    };

    {/* E N C A B E Z A D O - T A B L A */ }
    const header = (
        <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-2 md:mb-0 md:mr-auto md:align-items-center">
                <h5 className="m-0 mr-2">Rol</h5>
                {canCrear ? (
                    <Button
                        label="Nuevo"
                        icon="pi pi-plus"
                        severity="success"
                        onClick={crearNuevoRol}
                    />
                ) : null}
            </div>
            <div className="flex items-center md:ml-auto">
                <Button className="m-0 mr-2" type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined onClick={limpiarFiltros} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={valorDeFiltroGlobal} onChange={manejarCambioFiltroGlobal} placeholder="Buscar por palabra clave" />
                </span>
            </div>
        </div>
    );

    {/* B O T O N E S - D E - L A S - M O D A L E S */ }
    const rolDialogFooter = (
        <>
            <Button
                label="CANCELAR"
                icon="pi pi-times"
                text
                onClick={ocultarDialog}
            />
            <Button
                label="GUARDAR"
                icon="pi pi-check"
                text
                onClick={guardarRol}
            />
        </>
    );

    const eliminarRolDialogFooter = (
        <>
            <Button
                label="NO"
                icon="pi pi-times"
                text
                onClick={ocultarEliminarRolDialog}
            />
            <Button
                label="SI"
                icon="pi pi-check"
                text
                onClick={eliminaRol}
            />
        </>
    );

    return (
        <div className="grid Rol">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} position="center" />
                    {/* ENCABEZADO PRINCIPAL */}
                    {/* <Toolbar className="mb-4" left={barraDeHerramientasIzquierda}></Toolbar> */}

                    {/* TABLA DE REGISTROS */}
                    <DataTable
                        className="datatable-responsive"
                        ref={referenciaDataTable}
                        header={header}
                        dataKey="id"
                        value={listaRolesEmpresa}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles"
                        removableSort
                        filters={filtros}
                        globalFilterFields={['nombre', 'nombreEmpresa', 'activoSn']}
                        emptyMessage="No se encontraron roles."
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="nombre"
                            header="Nombre"
                            sortable
                            filter
                            filterPlaceholder="Buscar por nombre"
                            body={nombreTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column>
                        <Column
                            field="nombreEmpresa"
                            header="Empresa"
                            sortable
                            filter
                            filterPlaceholder="Buscar por nombre de empresa"
                            body={listaEmpresas.nombre}
                            headerStyle={{ minWidth: "15rem" }}
                            filterElement={filtroDropDownTemplate}
                        ></Column>
                        <Column
                            field="activoSn"
                            header="Activo"
                            sortable
                            body={activoSNTemplate}
                            filterMenuStyle={{ width: '14rem' }}
                            headerStyle={{ minWidth: "15rem" }}
                            filter
                            filterElement={filtroActivoSnTemplate}
                        ></Column>
                        <Column
                            body={botonesDeAccionTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                    </DataTable>

                    {/* MODAL DE (CREAR/EDITAR) REGISTRO */}
                    <Dialog
                        visible={rolDialog}
                        style={{ width: "450px" }}
                        header={accion === 'Crear' ? "Crear nuevo rol" : "Editar rol"}
                        modal
                        className="p-fluid"
                        footer={rolDialogFooter}
                        onHide={ocultarDialog}
                    >
                        <div className="field">
                            <label htmlFor="nombre" className="font-bold block">{intl.formatMessage({ id: 'Nombre' })}</label>
                            <InputText
                                id="nombre"
                                value={rol.nombre}
                                onChange={(e) => manejarCambioInput(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": enviado && !rol.nombre,
                                })}
                            />
                            {enviado && !rol.nombre && (
                                <small className="p-invalid">
                                    El nombre es requerido.
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreEmpresa" className="font-bold block">{intl.formatMessage({ id: 'Empresa' })}</label>
                            <AutoComplete
                                value={empresaSeleccionada}
                                suggestions={filtradoEmpresas}
                                dropdown
                                placeholder="Selecciona un registro"
                                field="nombre"
                                completeMethod={busquedaEmpresas}
                                onChange={(e) => setEmpresaSeleccionada(e.value)}
                                className={classNames({
                                    "p-invalid": enviado && !empresaSeleccionada,
                                })}
                            />
                            {enviado && !empresaSeleccionada && (
                                <small className="p-invalid">
                                    Escoge una opción.
                                </small>
                            )}
                        </div>

                        <div className="field-checkbox">
                            <InputSwitch
                                checked={rol.activoSn === 'S'}
                                onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                            />
                            <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                        </div>
                    </Dialog>

                    {/* MODAL DE (ELIMINAR) REGISTRO */}
                    <Dialog
                        visible={eliminarRolDialog}
                        style={{ width: "450px" }}
                        header="¿Eliminar rol?"
                        modal
                        footer={eliminarRolDialogFooter}
                        onHide={ocultarEliminarRolDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            />
                            {rol && (
                                <span>
                                    ¿Está seguro de que desea eliminar el siguiente registro: {" "}
                                    <b>{rol.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default Rol;
