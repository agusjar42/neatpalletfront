"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { postPermiso, deletePermiso, getVistaEmpresaRolPermiso, actualizarMatrizPermisos } from "@/app/api-endpoints/permisos";
import { getRol, getNombreRol } from "@/app/api-endpoints/rol";
import { getUsuarioSesion, bloquearPantalla } from "@/app/utility/Utils";
import { useIntl } from "react-intl";
import PermisoIntro from "./PermisoIntro";
import { useAuth } from "@/app/auth/AuthContext";

const Permiso = () => {
    const intl = useIntl();
    const { refrescarMenuLateral } = useAuth();
    const toast = useRef(null);
    const referenciaDataTable = useRef(null);
    const permisosEnProceso = useRef(new Set());
    const [rolesDisponibles, setRolesDisponibles] = useState([]);
    const [columnaPrincipal, setColumnaPrincipal] = useState([]);
    const [listaPermisosMarcados, setListaPermisosMarcados] = useState(new Set());
    const [listaPermisosMarcadosSinId, setListaPermisosMarcadosSinId] = useState(new Set());
    const [textoBusqueda, setTextoBusqueda] = useState("");

    useEffect(() => {
        obtenerDatos();
    }, []);

    //
    //Definimos la matriz fija de secciones y acciones que se mezcla con los roles de base de datos
    //
    const obtenerListaPermisos = () => ([
        { header: intl.formatMessage({ id: 'Empresas' }), seccion: 'Empresas' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Empresas-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Empresas-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Empresas-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Empresas-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Empresas-Borrar' },

        { header: intl.formatMessage({ id: 'Idiomas' }), seccion: 'Idiomas' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Idiomas-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Idiomas-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Idiomas-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Idiomas-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Idiomas-Borrar' },

        { header: intl.formatMessage({ id: 'Logs de usuarios' }), seccion: 'Logs de usuarios' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Logs de usuarios-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Logs de usuarios-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Logs de usuarios-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Logs de usuarios-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Logs de usuarios-Borrar' },

        { header: intl.formatMessage({ id: 'Logs incorrectos' }), seccion: 'Logs incorrectos' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Logs incorrectos-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Logs incorrectos-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Logs incorrectos-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Logs incorrectos-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Logs incorrectos-Borrar' },

        { header: intl.formatMessage({ id: 'Paises' }), seccion: 'Paises' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Paises-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Paises-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Paises-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Paises-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Paises-Borrar' },

        { header: intl.formatMessage({ id: 'Eventos Configuración' }), seccion: 'Eventos Configuración' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Eventos Configuración-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Eventos Configuración-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Eventos Configuración-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Eventos Configuración-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Eventos Configuración-Borrar' },

        { header: intl.formatMessage({ id: 'Traducciones' }), seccion: 'Traducciones' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Traducciones-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Traducciones-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Traducciones-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Traducciones-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Traducciones-Borrar' },

        { header: intl.formatMessage({ id: 'Roles' }), seccion: 'Roles' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Roles-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Roles-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Roles-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Roles-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Roles-Borrar' },

        { header: intl.formatMessage({ id: 'Permisos' }), seccion: 'Permisos' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Permisos-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Permisos-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Permisos-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Permisos-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Permisos-Borrar' },

        { header: intl.formatMessage({ id: 'Usuarios' }), seccion: 'Usuarios' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Usuarios-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Usuarios-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Usuarios-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Usuarios-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Usuarios-Borrar' },
        { header: intl.formatMessage({ id: 'Seleccionar rol' }), seccion: 'Usuarios-SeleccionarRol' },
        { header: intl.formatMessage({ id: 'Seleccionar estado' }), seccion: 'Usuarios-SeleccionarEstado' },
        { header: intl.formatMessage({ id: 'Seleccionar tipo' }), seccion: 'Usuarios-SeleccionarTipo' },
        { header: intl.formatMessage({ id: 'Ver perfil' }), seccion: 'Usuarios-VerPerfil' },

        { header: intl.formatMessage({ id: 'Envio Contenido' }), seccion: 'Envio Contenido' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Contenido-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Contenido-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Contenido-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Contenido-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Contenido-Borrar' },

        { header: intl.formatMessage({ id: 'Envío Configuracion Empresa' }), seccion: 'Envío Configuracion Empresa' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envío Configuracion Empresa-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envío Configuracion Empresa-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envío Configuracion Empresa-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envío Configuracion Empresa-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envío Configuracion Empresa-Borrar' },

        { header: intl.formatMessage({ id: 'Envio Configuracion' }), seccion: 'Envio Configuracion' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Configuracion-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Configuracion-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Configuracion-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Configuracion-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Configuracion-Borrar' },
        { header: intl.formatMessage({ id: 'Descargar CSV' }), seccion: 'Envio Configuracion-DescargarCSV' },

        { header: intl.formatMessage({ id: 'Envio Movimiento' }), seccion: 'Envio Movimiento' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Movimiento-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Movimiento-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Movimiento-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Movimiento-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Movimiento-Borrar' },

        { header: intl.formatMessage({ id: 'Envio Pallet' }), seccion: 'Envio Pallet' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Pallet-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Pallet-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Pallet-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Pallet-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Pallet-Borrar' },

        { header: intl.formatMessage({ id: 'Envio Parada' }), seccion: 'Envio Parada' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Parada-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Parada-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Parada-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Parada-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Parada-Borrar' },

        { header: intl.formatMessage({ id: 'Envio Sensor' }), seccion: 'Envio Sensor' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envio Sensor-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envio Sensor-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envio Sensor-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envio Sensor-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envio Sensor-Borrar' },

        { header: intl.formatMessage({ id: 'Envíos' }), seccion: 'Envíos' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Envíos-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Envíos-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Envíos-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Envíos-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Envíos-Borrar' },

        { header: intl.formatMessage({ id: 'Pallet Parametro' }), seccion: 'Pallet Parametro' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Pallet Parametro-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Pallet Parametro-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Pallet Parametro-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Pallet Parametro-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Pallet Parametro-Borrar' },

        { header: intl.formatMessage({ id: 'Pallet' }), seccion: 'Pallet' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Pallet-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Pallet-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Pallet-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Pallet-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Pallet-Borrar' },
        { header: intl.formatMessage({ id: 'Descargar CSV' }), seccion: 'Pallet-DescargarCSV' },
        { header: intl.formatMessage({ id: 'Importar CSV' }), seccion: 'Pallet-ImportarCSV' },

        { header: intl.formatMessage({ id: 'Parametro' }), seccion: 'Parametro' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Parametro-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Parametro-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Parametro-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Parametro-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Parametro-Borrar' },

        { header: intl.formatMessage({ id: 'Tipos de Carrocería' }), seccion: 'Tipos de Carrocería' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipos de Carrocería-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipos de Carrocería-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipos de Carrocería-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipos de Carrocería-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipos de Carrocería-Borrar' },

        { header: intl.formatMessage({ id: 'Tipo Sensor' }), seccion: 'Tipo Sensor' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Sensor-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Sensor-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Sensor-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Sensor-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Sensor-Borrar' },

        { header: intl.formatMessage({ id: 'Tipo Vehiculo' }), seccion: 'Tipo Vehiculo' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Vehiculo-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Vehiculo-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Vehiculo-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Vehiculo-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Vehiculo-Borrar' },

        { header: intl.formatMessage({ id: 'Tipo Categoria' }), seccion: 'Tipo Categoria' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Categoria-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Categoria-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Categoria-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Categoria-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Categoria-Borrar' },

        { header: intl.formatMessage({ id: 'Tipo Transporte' }), seccion: 'Tipo Transporte' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Tipo Transporte-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Tipo Transporte-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Tipo Transporte-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Tipo Transporte-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Tipo Transporte-Borrar' },

        { header: intl.formatMessage({ id: 'Resumen Envío' }), seccion: 'Resumen Envío' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Resumen Envío-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Resumen Envío-Ver' },

        { header: intl.formatMessage({ id: 'Resumen Envío Pallet' }), seccion: 'Resumen Envío Pallet' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Resumen Envío Pallet-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Resumen Envío Pallet-Ver' },

        { header: intl.formatMessage({ id: 'Operarios' }), seccion: 'Operarios' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Operarios-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Operarios-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Operarios-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Operarios-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Operarios-Borrar' },

        { header: intl.formatMessage({ id: 'Lugar Parada' }), seccion: 'Lugar Parada' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Lugar Parada-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Lugar Parada-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Lugar Parada-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Lugar Parada-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Lugar Parada-Borrar' },

        { header: intl.formatMessage({ id: 'Productos' }), seccion: 'Productos' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Productos-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Productos-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Productos-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Productos-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Productos-Borrar' },

        { header: intl.formatMessage({ id: 'Clientes' }), seccion: 'Clientes' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Clientes-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Clientes-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Clientes-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Clientes-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Clientes-Borrar' },

        { header: intl.formatMessage({ id: 'Parámetros permitidos de Pallet' }), seccion: 'Parámetros permitidos de Pallet' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Parámetros permitidos de Pallet-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Parámetros permitidos de Pallet-Ver' },
        { header: intl.formatMessage({ id: 'Nuevo' }), seccion: 'Parámetros permitidos de Pallet-Nuevo' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Parámetros permitidos de Pallet-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Parámetros permitidos de Pallet-Borrar' },

        { header: intl.formatMessage({ id: 'Pallets Asignados' }), seccion: 'Pallets Asignados' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Pallets Asignados-Acceder' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Pallets Asignados-Actualizar' },

        { header: intl.formatMessage({ id: 'Sensores activos' }), seccion: 'Sensores activos' },
        { header: intl.formatMessage({ id: 'Acceder' }), seccion: 'Sensores activos-Acceder' },
        { header: intl.formatMessage({ id: 'Ver' }), seccion: 'Sensores activos-Ver' },
        { header: intl.formatMessage({ id: 'Actualizar' }), seccion: 'Sensores activos-Actualizar' },
        { header: intl.formatMessage({ id: 'Borrar' }), seccion: 'Sensores activos-Borrar' },
    ]);

    //
    //Un permiso se identifica por controlador, accion, rol e id si ya existe en base de datos
    //
    const crearClavePermiso = (controlador, accion, rolNombre, permisoId) =>
        `${controlador}-${accion}-${rolNombre}${permisoId ? `-${permisoId}` : ""}`;

    //
    //Quitamos el id final para poder comprobar si una celda esta marcada sin depender del registro concreto
    //
    const quitarIdClavePermiso = (permiso) => {
        const partes = String(permiso).split("-");
        partes.pop();
        return partes.join("-");
    };

    //
    //Extraemos el nombre de la seccion base para agrupar sus acciones
    //
    const obtenerNombreSeccion = (seccion) => String(seccion).split("-")[0];

    //
    //Extraemos la accion de la fila cuando no es una fila cabecera de seccion
    //
    const obtenerAccionSeccion = (seccion) => {
        const partes = String(seccion).split("-");
        return partes.length > 1 ? partes.slice(1).join("-") : "";
    };

    //
    //Normalizamos la busqueda para comparar sin mayusculas ni espacios sobrantes
    //
    const normalizarTexto = (texto) => String(texto || "").trim().toLowerCase();

    //
    //Obtenemos la lista de acciones reales de una seccion para calcular sus estados
    //
    const obtenerAccionesPorSeccion = (seccionBase) => {
        return columnaPrincipal
            .filter((item) => item.seccion?.includes("-") && obtenerNombreSeccion(item.seccion) === seccionBase)
            .map((item) => ({
                controlador: seccionBase,
                accion: obtenerAccionSeccion(item.seccion),
            }));
    };

    //
    //Cargamos roles y permisos vigentes para pintar la matriz
    //
    const obtenerDatos = async () => {
        try {
            const listaPermisos = obtenerListaPermisos();

            //
            //Leemos los roles reales de la empresa del usuario
            //
            const filtroRol = { where: { and: { empresaId: getUsuarioSesion().empresaId } } };
            const registrosRolesRespuesta = await getRol(JSON.stringify(filtroRol));
            let registrosRoles = registrosRolesRespuesta;
            if (typeof registrosRolesRespuesta === "string") {
                try {
                    registrosRoles = JSON.parse(registrosRolesRespuesta);
                } catch {
                    registrosRoles = [];
                }
            }

            //
            //Guardamos la lista completa para reutilizar ids y nombres sin tener que volver a resolverlos
            //
            setRolesDisponibles(Array.isArray(registrosRoles) ? registrosRoles : []);
            setColumnaPrincipal(listaPermisos);

            //
            //Marcamos los permisos existentes a partir de la vista que ya usa la pantalla hoy
            //
            const filtroEmpresaRolPermiso = { where: { and: { empresaId: getUsuarioSesion().empresaId } } };
            const permisosMarcados = await getVistaEmpresaRolPermiso(JSON.stringify(filtroEmpresaRolPermiso));
            const permisosSet = new Set(
                (permisosMarcados || []).map((permisoMarcado) =>
                    crearClavePermiso(
                        permisoMarcado.permisoControlador,
                        permisoMarcado.permisoAccion,
                        permisoMarcado.rolNombre,
                        permisoMarcado.permisoId
                    )
                )
            );

            //
            //Generamos tambien una version sin id para consultas rapidas de marcado y estados
            //
            const permisosSinId = new Set(Array.from(permisosSet).map((permiso) => quitarIdClavePermiso(permiso)));
            setListaPermisosMarcados(permisosSet);
            setListaPermisosMarcadosSinId(permisosSinId);
        } catch (error) {
            console.log(error?.message || error);
        }
    };

    //
    //Comprobamos si una celda concreta esta marcada
    //
    const estaMarcado = (controlador, accion, rolNombre) => {
        return listaPermisosMarcadosSinId.has(crearClavePermiso(controlador, accion, rolNombre));
    };

    //
    //Calculamos el estado visual de una seccion para un rol segun sus acciones marcadas
    //
    const obtenerEstadoSeccion = (seccionBase, rolNombre) => {
        const acciones = obtenerAccionesPorSeccion(seccionBase);
        const totalAcciones = acciones.length;

        if (totalAcciones === 0) {
            return { texto: "Nada", clase: "is-empty" };
        }

        const accionesMarcadas = acciones.filter((permiso) =>
            estaMarcado(permiso.controlador, permiso.accion, rolNombre)
        ).length;

        if (accionesMarcadas === 0) {
            return { texto: "Nada", clase: "is-empty" };
        }

        if (accionesMarcadas === totalAcciones) {
            return { texto: "Todo", clase: "is-full" };
        }

        return { texto: "Parcial", clase: "is-partial" };
    };

    //
    //Filtramos solo por nombre de seccion y arrastramos debajo sus acciones relacionadas
    //
    const obtenerFilasVisibles = () => {
        const textoNormalizado = normalizarTexto(textoBusqueda);

        if (!textoNormalizado) {
            return columnaPrincipal;
        }

        const seccionesCoincidentes = columnaPrincipal
            .filter((item) => !item.seccion?.includes("-"))
            .filter((item) => normalizarTexto(item.header).includes(textoNormalizado))
            .map((item) => item.seccion);

        return columnaPrincipal.filter((item) => {
            const seccionBase = obtenerNombreSeccion(item.seccion);
            return seccionesCoincidentes.includes(seccionBase);
        });
    };

    //
    //Aplicamos el cambio individual tal y como ya hacia la pantalla, pero apoyandonos en la cache actual
    //
    const handlePermisoMarcado = async (permiso, evento) => {
        if (permisosEnProceso.current.has(permiso)) {
            return;
        }

        permisosEnProceso.current.add(permiso);
        bloquearPantalla(true);
        document.body.style.cursor = "wait";

        try {
            const partesPermiso = permiso.split("-");
            const controlador = partesPermiso[0];
            const accion = partesPermiso[1];
            const rolNombre = partesPermiso.slice(2).join("-");

            if (evento.checked) {
                //
                //Resolvemos el rol y creamos el permiso exacto
                //
                const rolId = await getNombreRol(rolNombre, getUsuarioSesion().empresaId);
                const nuevoPermiso = {
                    rolId: rolId[0].id,
                    modulo: "Neatpallet",
                    controlador,
                    accion,
                    usuCreacion: getUsuarioSesion()?.id,
                };

                await postPermiso(nuevoPermiso);
                await refrescarMenuLateral();
                await obtenerDatos();
                return;
            }

            //
            //Mantenemos la proteccion del rol de sistemas en el borrado individual
            //
            if (rolNombre === "Sistemas") {
                toast.current?.show({
                    severity: "error",
                    summary: intl.formatMessage({ id: "Error" }),
                    detail: intl.formatMessage({ id: "No se puede eliminar permisos del rol de Sistemas" }),
                });
                await obtenerDatos();
                return;
            }

            //
            //Buscamos el id real en el set actual y borramos solo ese registro
            //
            const listadoPermisos = Array.from(listaPermisosMarcados);
            const listaSinId = listadoPermisos.reduce((mapa, permisoActual) => {
                const [clave, id] = permisoActual.split(/-(?=[^-]+$)/);
                mapa[clave] = id;
                return mapa;
            }, {});

            if (listaSinId.hasOwnProperty(permiso)) {
                await deletePermiso(parseInt(listaSinId[permiso]));
                await refrescarMenuLateral();
                await obtenerDatos();
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: error?.response?.data?.error?.message || error?.message || intl.formatMessage({ id: "No se pudo actualizar el permiso" }),
            });
            await obtenerDatos();
        } finally {
            permisosEnProceso.current.delete(permiso);
            document.body.style.cursor = "default";
            bloquearPantalla(false);
        }
    };

    //
    //Preparamos la lista completa de permisos editables de un rol para marcar o desmarcar en bloque
    //
    const aplicarCambioMasivo = async (rol, marcar) => {
        bloquearPantalla(true);
        document.body.style.cursor = "wait";

        try {
            const permisosActualizar = columnaPrincipal
                .filter((item) => item.seccion?.includes("-"))
                .map((item) => ({
                    controlador: obtenerNombreSeccion(item.seccion),
                    accion: obtenerAccionSeccion(item.seccion),
                }));

            //
            //Enviamos una unica operacion para que base de datos resuelva el cambio lo mas rapido posible
            //
            await actualizarMatrizPermisos({
                rolId: rol.id,
                rolNombre: rol.nombre,
                marcar,
                usuId: getUsuarioSesion()?.id,
                permisos: permisosActualizar,
            });

            await refrescarMenuLateral();
            await obtenerDatos();

            toast.current?.show({
                severity: "success",
                summary: intl.formatMessage({ id: "Correcto" }),
                detail: marcar
                    ? intl.formatMessage({ id: "Permisos marcados correctamente" })
                    : intl.formatMessage({ id: "Permisos desmarcados correctamente" }),
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: error?.response?.data?.error?.message || error?.message || intl.formatMessage({ id: "No se pudo actualizar el permiso" }),
            });
            await obtenerDatos();
        } finally {
            document.body.style.cursor = "default";
            bloquearPantalla(false);
        }
    };

    //
    //Mostramos una reconfirmacion antes de aplicar una operacion delicada sobre todo un rol
    //
    const confirmarCambioMasivo = (rol, marcar) => {
        confirmDialog({
            header: marcar
                ? intl.formatMessage({ id: "Confirmar marcado masivo" })
                : intl.formatMessage({ id: "Confirmar desmarcado masivo" }),
            message: marcar
                ? `${intl.formatMessage({ id: "Se marcaran todos los permisos del rol" })} ${rol.nombre}.`
                : `${intl.formatMessage({ id: "Se desmarcaran todos los permisos del rol" })} ${rol.nombre}.`,
            icon: "pi pi-exclamation-triangle",
            acceptLabel: intl.formatMessage({ id: "Continuar" }),
            rejectLabel: intl.formatMessage({ id: "Cancelar" }),
            acceptClassName: "p-button-danger",
            accept: () => aplicarCambioMasivo(rol, marcar),
        });
    };

    //
    //Renderizamos el nombre de la fila, destacando las cabeceras de seccion
    //
    const nombrePermisos = (rowData) => {
        const esSeccion = !rowData.seccion.includes("-");
        return (
            <div className={esSeccion ? "neat-permiso-section-title" : "neat-permiso-action-title"}>
                {rowData.header}
            </div>
        );
    };

    //
    //En las filas cabecera mostramos el estado agregado del rol para esa seccion
    //
    const renderEstadoSeccion = (rowData, rol) => {
        if (rowData.seccion.includes("-")) {
            return null;
        }

        const estado = obtenerEstadoSeccion(rowData.seccion, rol.nombre);
        return (
            <span className={`neat-permiso-status ${estado.clase}`}>
                {estado.texto}
            </span>
        );
    };

    //
    //En las filas de accion seguimos mostrando el check que persiste al instante
    //
    const renderCheckbox = (rowData, rol) => {
        if (!rowData.seccion.includes("-")) {
            return renderEstadoSeccion(rowData, rol);
        }

        const controlador = obtenerNombreSeccion(rowData.seccion);
        const accion = obtenerAccionSeccion(rowData.seccion);

        return (
            <Checkbox
                key={`checkbox-${rowData.seccion}-${rol.nombre}`}
                id={`checkbox-${rowData.seccion}-${rol.nombre}`}
                checked={estaMarcado(controlador, accion, rol.nombre)}
                onChange={(evento) => handlePermisoMarcado(`${controlador}-${accion}-${rol.nombre}`, evento)}
                className="mr-2"
            />
        );
    };

    //
    //La cabecera de cada rol incorpora acciones masivas con confirmacion
    //
    const renderHeaderRol = (rol) => (
        <div className="neat-permiso-role-header">
            <span className="neat-permiso-role-title">{rol.nombre}</span>
            <div className="neat-permiso-role-links">
                <button type="button" className="neat-permiso-link-button" onClick={() => confirmarCambioMasivo(rol, true)}>
                    {intl.formatMessage({ id: "Marcar todo" })}
                </button>
                <button type="button" className="neat-permiso-link-button" onClick={() => confirmarCambioMasivo(rol, false)}>
                    {intl.formatMessage({ id: "Desmarcar todo" })}
                </button>
            </div>
        </div>
    );

    //
    //Resaltamos visualmente las filas cabecera de seccion
    //
    const rowClass = (data) => ({
        "bg-gray-50": !data.seccion.includes("-"),
    });

    const filasVisibles = obtenerFilasVisibles();
    const totalSecciones = columnaPrincipal.filter((item) => !item.seccion?.includes("-")).length;
    const seccionesVisibles = filasVisibles.filter((item) => !item.seccion?.includes("-")).length;

    const header = (
        <div className="neat-permiso-toolbar">
            <div className="neat-permiso-search">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText
                        value={textoBusqueda}
                        onChange={(evento) => setTextoBusqueda(evento.target.value)}
                        placeholder={intl.formatMessage({ id: "Buscar sección..." })}
                    />
                </span>
            </div>
            <div className="neat-permiso-toolbar-meta">
                {seccionesVisibles} de {totalSecciones} secciones - {rolesDisponibles.length} roles
            </div>
        </div>
    );

    return (
        <div className="grid Permiso">
            <div className="col-12">
                <PermisoIntro permisos={columnaPrincipal} roles={rolesDisponibles.map((rol) => rol.nombre)} />
                <div className="card">
                    <Toast ref={toast} position="top-right" />
                    <ConfirmDialog />
                    <DataTable
                        className="datatable-responsive"
                        ref={referenciaDataTable}
                        header={header}
                        dataKey="seccion"
                        value={filasVisibles}
                        responsiveLayout="scroll"
                        rowClassName={rowClass}
                    >
                        <Column
                            field="controlador"
                            header={intl.formatMessage({ id: "Sección / Acción" })}
                            headerStyle={{ minWidth: "17rem" }}
                            body={nombrePermisos}
                        />
                        {rolesDisponibles.map((rol) => (
                            <Column
                                key={rol.id}
                                field={rol.nombre}
                                header={renderHeaderRol(rol)}
                                headerStyle={{ minWidth: "15rem" }}
                                body={(rowData) => renderCheckbox(rowData, rol)}
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Permiso;
