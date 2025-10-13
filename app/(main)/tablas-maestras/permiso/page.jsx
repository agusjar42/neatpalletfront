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
import { bloquearPantalla } from "@/app/utility/Utils"
import { useIntl } from 'react-intl';
import Cookies from 'js-cookie';

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
            const listaPermisos = [
                // Empresas
                { header: intl.formatMessage({ id: 'Empresas' }), seccion: 'Empresas' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Empresas-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Empresas-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Empresas-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Empresas-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Empresas-Borrar' },

                // Idiomas
                { header: intl.formatMessage({ id: 'Idiomas' }), seccion: 'Idiomas' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Idiomas-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Idiomas-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Idiomas-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Idiomas-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Idiomas-Borrar' },

                // Logs de usuarios
                { header: intl.formatMessage({ id: 'Logs de usuarios' }), seccion: 'Logs de usuarios' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Logs de usuarios-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Logs de usuarios-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Logs de usuarios-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Logs de usuarios-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Logs de usuarios-Borrar' },

                // Logs incorrectos
                { header: intl.formatMessage({ id: 'Logs incorrectos' }), seccion: 'Logs incorrectos' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Logs incorrectos-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Logs incorrectos-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Logs incorrectos-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Logs incorrectos-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Logs incorrectos-Borrar' },

                // Paises
                { header: intl.formatMessage({ id: 'Paises' }), seccion: 'Paises' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Paises-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Paises-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Paises-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Paises-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Paises-Borrar' },

                // Plantillas de correo
                /*{ header: intl.formatMessage({ id: 'Plantillas de correo' }), seccion: 'Plantillas de correo' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Plantillas de correo-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Plantillas de correo-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Plantillas de correo-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Plantillas de correo-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Plantillas de correo-Borrar' },
                */

                // Traducciones
                { header: intl.formatMessage({ id: 'Traducciones' }), seccion: 'Traducciones' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Traducciones-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Traducciones-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Traducciones-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Traducciones-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Traducciones-Borrar' },

                // Roles
                { header: intl.formatMessage({ id: 'Roles' }), seccion: 'Roles' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Roles-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Roles-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Roles-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Roles-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Roles-Borrar' },

                // Permisos
                { header: intl.formatMessage({ id: 'Permisos' }), seccion: 'Permisos' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Permisos-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Permisos-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Permisos-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Permisos-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Permisos-Borrar' },

                // Usuarios
                { header: intl.formatMessage({ id: 'Usuarios' }), seccion: 'Usuarios' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Usuarios-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Usuarios-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Usuarios-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Usuarios-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Usuarios-Borrar' },
                { header: intl.formatMessage({ id: 'Seleccionar rol' }), seccion: 'Usuarios-SeleccionarRol' },
                { header: intl.formatMessage({ id: 'Seleccionar tipo' }), seccion: 'Usuarios-SeleccionarTipo' },
                { header: intl.formatMessage({ id: 'Cancelar' }), seccion: 'Usuarios-Cancelar' },
                { header: intl.formatMessage({ id: 'Ver perfil' }), seccion: 'Usuarios-VerPerfil' },

                // Envio Contenido
                { header: intl.formatMessage({ id: 'Envio Contenido' }), seccion: 'Envio Contenido' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Contenido-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Contenido-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Contenido-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Contenido-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Contenido-Borrar' },

                // Envío Configuracion Empresa
                { header: intl.formatMessage({ id: 'Envío Configuracion Empresa' }), seccion: 'Envío Configuracion Empresa' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envío Configuracion Empresa-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envío Configuracion Empresa-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envío Configuracion Empresa-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envío Configuracion Empresa-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envío Configuracion Empresa-Borrar' },

                // Envio Configuracion
                { header: intl.formatMessage({ id: 'Envio Configuracion' }), seccion: 'Envio Configuracion' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Configuracion-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Configuracion-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Configuracion-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Configuracion-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Configuracion-Borrar' },

                // Envio Movimiento
                { header: intl.formatMessage({ id: 'Envio Movimiento' }), seccion: 'Envio Movimiento' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Movimiento-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Movimiento-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Movimiento-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Movimiento-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Movimiento-Borrar' },

                // Envio Pallet
                { header: intl.formatMessage({ id: 'Envio Pallet' }), seccion: 'Envio Pallet' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Pallet-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Pallet-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Pallet-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Pallet-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Pallet-Borrar' },

                // Envio Parada
                { header: intl.formatMessage({ id: 'Envio Parada' }), seccion: 'Envio Parada' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Parada-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Parada-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Parada-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Parada-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Parada-Borrar' },

                // Envio Sensor
                { header: intl.formatMessage({ id: 'Envio Sensor' }), seccion: 'Envio Sensor' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Sensor-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Sensor-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Sensor-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Sensor-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Sensor-Borrar' },

                // Envio
                { header: intl.formatMessage({ id: 'Envio' }), seccion: 'Envio' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio-Borrar' },

                // Pallet Parametro
                { header: intl.formatMessage({ id: 'Pallet Parametro' }), seccion: 'Pallet Parametro' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Pallet Parametro-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Pallet Parametro-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Pallet Parametro-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Pallet Parametro-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Pallet Parametro-Borrar' },

                // Pallet
                { header: intl.formatMessage({ id: 'Pallet' }), seccion: 'Pallet' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Pallet-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Pallet-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Pallet-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Pallet-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Pallet-Borrar' },

                // Parametro
                { header: intl.formatMessage({ id: 'Parametro' }), seccion: 'Parametro' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Parametro-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Parametro-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Parametro-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Parametro-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Parametro-Borrar' },

                // Tipo Carroceria
                { header: intl.formatMessage({ id: 'Tipo Carroceria' }), seccion: 'Tipo Carroceria' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Carroceria-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Carroceria-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Carroceria-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Carroceria-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Carroceria-Borrar' },

                // Tipo Sensor
                { header: intl.formatMessage({ id: 'Tipo Sensor' }), seccion: 'Tipo Sensor' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Sensor-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Sensor-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Sensor-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Sensor-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Sensor-Borrar' },

                // Tipo Transporte
                { header: intl.formatMessage({ id: 'Tipo Transporte' }), seccion: 'Tipo Transporte' },
                { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Transporte-Acceder' },
                { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Transporte-Ver' },
                { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Transporte-Nuevo' },
                { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Transporte-Actualizar' },
                { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Transporte-Borrar' },
            ];

            // Obtenemos los roles
            const filtroRol = { where: { empresaId: getUsuarioSesion().empresaId } };
            const registrosRoles = await getRol(JSON.stringify(filtroRol));
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
            const filtroEmpresaRolPermiso = { where: { and: { empresaId: getUsuarioSesion().empresaId }}};
            const permisosMarcados = await getVistaEmpresaRolPermiso(JSON.stringify(filtroEmpresaRolPermiso));
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
            bloquearPantalla(true)
            document.body.style.cursor = 'wait';
            if (evento.checked) {
                //añadir a la BBDD y al set
                const partesPermiso = permiso.split('-');
                const rolId = await getNombreRol(partesPermiso[2], getUsuarioSesion().empresaId);
                emptyPermiso = {
                    rolId: rolId[0].id,
                    modulo: "Neatpallet",
                    controlador: partesPermiso[0],
                    accion: partesPermiso[1],
                    usuCreacion: getUsuarioSesion()?.id,
                };
                await postPermiso(emptyPermiso);
                newSet.add(permiso);
                // if (partesPermiso[1] === 'Ver') {
                //     window.location.reload();
                // } else {
                //     obtenerDatos();
                // }
                await obtenerDatos();
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
                        await deletePermiso(parseInt(listaSinId[permiso]));
                        newSet.delete(permiso + listaSinId[permiso]);
                        // if (partesPermiso[1] === 'Ver') {
                        //     window.location.reload();
                        // } else {
                        //     obtenerDatos();
                        // }
                        await obtenerDatos();
                    }
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar permisos del rol de Sistemas' });
                    await obtenerDatos();
                }
            }
            document.body.style.cursor = 'default';
            bloquearPantalla(false)
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
