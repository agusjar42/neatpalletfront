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
import { getPermiso, postPermiso, patchPermiso, deletePermiso, getVistaEmpresaRolPermiso, getListaPermisos } from "@/app/api-endpoints/permisos";
import { getRol, getNombreRol } from "@/app/api-endpoints/rol";
import { formatearFechaLocal_a_toISOString, getUsuarioSesion } from "@/app/utility/Utils";
import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { useIntl } from 'react-intl';
const Permiso = () => {
    const intl = useIntl();
    const [permisos, setPermisos] = useState([]);
    const [columnasRoles, setColumnasRoles] = useState([]);
    const [columnaPrincipal, setColumnaPrincipal] = useState([]);
    const [filtros, setFiltros] = useState(null);
    const toast = useRef(null);
    const referenciaDataTable = useRef(null);
    const [marcado, setMarcado] = useState(false);
    const [listaPermisosMarcados, setListaPermisosMarcados] = useState(new Set());
    const [datosUsuario, setDatosUsuario] = useState(null);


    useEffect(() => {
        obtenerDatos();
    }, []);

    let emptyPermiso = {
        rol_id: "",
        modulo: "Neatpallet",
        controlador: "",
        accion: "",
    };

    //Lista donde se iran añadiendo los nuevos permisos



    const obtenerDatos = async () => {
        try {
            //Obtenemos las tablas maestras
            const registrosTablas = await getListaPermisos();
            // const listaPermisos = [
            //     { header: intl.formatMessage({ id: 'Roles' }), seccion: 'Roles' },
            //     { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Rol-Acceder' },
            //     { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Rol-Ver' },
            //     { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Rol-Nuevo' },
            //     { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Rol-Actualizar' },
            //     { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Rol-Borrar' },
            // ];

            const listaPermisos = [];
            for (let tabla of registrosTablas) {
                listaPermisos.push({ header: intl.formatMessage({ id: tabla.header }), seccion: tabla.header });
                listaPermisos.push({ header: intl.formatMessage({ id: 'Acceder' }), seccion: `${tabla.header}-Acceder` });
                listaPermisos.push({ header: intl.formatMessage({ id: 'Ver' }), seccion: `${tabla.header}-Ver` });
                listaPermisos.push({ header: intl.formatMessage({ id: 'Nuevo' }), seccion: `${tabla.header}-Nuevo` });
                listaPermisos.push({ header: intl.formatMessage({ id: 'Actualizar' }), seccion: `${tabla.header}-Actualizar` });
                listaPermisos.push({ header: intl.formatMessage({ id: 'Borrar' }), seccion: `${tabla.header}-Borrar` });
            };

            // Obtenemos los roles
            const registrosRoles = await getRol();
            const nombresColumnas = Array.from(new Set(registrosRoles.map(registro => registro.nombre)));
            // Crear un objeto para almacenar las acciones por controlador
            setColumnaPrincipal(listaPermisos);
            setColumnasRoles(nombresColumnas);
            const registros = await getPermiso();
            setPermisos(registros);

            //Obtener los datos del usuario
            const storedData = localStorage.getItem('userDataNeatpallet');
            const parsedData = JSON.parse(storedData);
            setDatosUsuario(parsedData);


            //Marcar los que esten dentro de la vista.
            const permisosMarcados = await getVistaEmpresaRolPermiso(parsedData.rolId);
            // Crear un nuevo conjunto con el formato especificado
            const permisosSet = new Set(permisosMarcados.map(permisoMarcado =>
                `${permisoMarcado.permiso_controlador}-${permisoMarcado.permiso_accion}-${permisoMarcado.rol_nombre}-${permisoMarcado.permiso_id}`
            ));
            //setListaPermisosMarcados(new Set([ ...permisosSet]));
            setListaPermisosMarcados(permisosSet);
        } catch (err) {
            console.log(err.message);
        } finally {
            console.log('Carga completa');
        }
    };

    {/* C O L U M N A S */ }

    const nombrePermisos = (rowData) => {
        const seCambiaEstilo = rowData.seccion.includes('-');
        const style = seCambiaEstilo ? {} : { color: 'black', fontSize: '1.5em' };
        const mostrarValor = rowData.header

        return (
            <div style={style}>
                {mostrarValor}
            </div>
        );
    };

    //Si existe en la listaPermisosMarcados, se marca el checkbox
    const estaMarcado = (rowData, listaPermisosMarcados) => {
        const listaPermisosSinId = new Set(
            Array.from(listaPermisosMarcados).map(permiso => {
                const partes = permiso.split('-');
                partes.pop(); // Eliminar la última parte (id)
                return partes.join('-'); // Unir las partes restantes
            })
        );
        return listaPermisosSinId.has(rowData);
    };

    //Evento para marcar o desmarcar los checkbox aparte de añadirlo a la BBDD
    const handlePermisoMarcado = (permiso, evento) => {
        setListaPermisosMarcados(async (prevSet) => {
            const newSet = new Set(prevSet);
            if (evento.checked) {
                //añadir a la BBDD y al set
                const partesPermiso = permiso.split('-');
                const rolId = await getNombreRol(partesPermiso[2]);
                emptyPermiso = {
                    rolId: rolId[0].id,
                    modulo: "Neatpallet",
                    controlador: partesPermiso[0],
                    accion: partesPermiso[1],
                };
                postPermiso(emptyPermiso);
                newSet.add(permiso);
                // if (partesPermiso[1] === 'Ver') {
                //     window.location.reload();
                // } else {
                //     obtenerDatos();
                // }
                obtenerDatos();
            } else {
                const partesPermiso = permiso.split('-');
                if (partesPermiso[2] !== 'Sistemas') {
                    // Eliminar de la BBDD y del set
                    const listadoPermisos = Array.from(newSet);
                    // Eliminar el sufijo '-id' de los roles y crear un mapa de roles a sus IDs
                    const listaSinId = listadoPermisos.reduce((map, permisos) => {
                        const [key, id] = permisos.split(/-(?=[^-]+$)/); // Divide en el último '-'
                        map[key] = id;
                        return map;
                    }, {});
                    // Buscar coincidencias y extraer sus IDs
                    if (listaSinId.hasOwnProperty(permiso)) {
                        deletePermiso(parseInt(listaSinId[permiso]));
                        newSet.delete(permiso + listaSinId[permiso]);
                        // if (partesPermiso[1] === 'Ver') {
                        //     window.location.reload();
                        // } else {
                        //     obtenerDatos();
                        // }
                        obtenerDatos();
                    }
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar permisos del rol de Sistemas' });
                    obtenerDatos();
                }
            }
            return newSet;
        });
    };

    //LLamada al componente que generar checkbox
    const generarCheckbox = (rowData, columna) => {
        return (
            <CustomCheckbox
                rowData={rowData}
                columna={columna}
                listaPermisosMarcados={listaPermisosMarcados}
                setListaPermisosMarcados={setListaPermisosMarcados}
            />
        );
    };

    //El checkbox personalizado que se añade a la tabla
    const CustomCheckbox = React.memo(({ rowData, columna, listaPermisosMarcados, setListaPermisosMarcados }) => {
        const verCheckBox = rowData.seccion.includes('-');

        if (!verCheckBox) return null;

        return (
            <Checkbox
                key={`checkbox-${rowData.seccion}`} // Agregar key único
                name={`checkbox-${rowData.seccion}`} // Nombre único
                id={`checkbox-${rowData.seccion}-${columna}`} // Id único
                checked={estaMarcado(`${rowData.seccion}-${columna}`, listaPermisosMarcados)} // Verificar si está en listaPermisosMarcados
                onChange={(evento) =>
                    handlePermisoMarcado(`${rowData.seccion}-${columna}`, evento, setListaPermisosMarcados)
                }
                className="mr-2"
            />
        );
    });

    {/* E N C A B E Z A D O - T A B L A */ }
    const header = (
        <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-2 md:mb-0 md:mr-auto md:align-items-center">
                <h5 className="m-0 mr-2">{intl.formatMessage({ id: 'Permisos' })}</h5>
            </div>
        </div>
    );

    const rowClass = (data) => {
        const seCambiaEstilo = !data.seccion.includes('-');
        return {
            'bg-gray-50': seCambiaEstilo
        };
    };

    return (
        <div className="grid Permiso">
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
                        value={columnaPrincipal}
                        responsiveLayout="scroll"
                        rowClassName={rowClass}
                    >
                        <Column
                            field='controlador'
                            header={intl.formatMessage({ id: 'Controlador' })}
                            headerStyle={{ minWidth: "15rem" }}
                            body={nombrePermisos}
                        />
                        {columnasRoles.map((columna, index) => (
                            <Column
                                key={index}
                                field={columna}
                                header={columna}
                                headerStyle={{ minWidth: "15rem" }}
                                body={(rowData) => generarCheckbox(rowData, columna)} // Usa la función personalizada
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
export default Permiso;
