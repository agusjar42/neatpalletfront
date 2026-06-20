"use client";
import { deleteUsuario, getVistaUsuarios, getVistaUsuariosCount } from "@/app/api-endpoints/usuario";
import Crud from "../../components/shared/crud";
import EditarUsuario from "./editar";
import { useIntl } from 'react-intl'
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useState, useEffect } from "react";

//
//Construimos las iniciales para la tabla cuando el usuario no tiene avatar
//
const obtenerInicialesUsuario = (nombre = "") => {
    const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) {
        return "--";
    }
    if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
    }
    return `${partes[0][0] ?? ""}${partes[1][0] ?? ""}`.toUpperCase();
};

//
//Mostramos el avatar como circulo con imagen o iniciales
//
const avatarUsuarioBody = (rowData) => {
    const avatar = rowData?.avatar;
    const iniciales = obtenerInicialesUsuario(rowData?.nombre);

    return (
        <div className="usuarios-avatar-cell">
            {avatar ? (
                <img src={avatar} alt={rowData?.nombre || "Usuario"} />
            ) : (
                <span>{iniciales}</span>
            )}
        </div>
    );
};

//
//Pintamos el estado con una pill similar al mockup
//
const estadoUsuarioBody = (rowData) => {
    const activo = String(rowData?.activoSn || "").toUpperCase() === "S";
    return (
        <span className={`usuarios-estado-pill ${activo ? "is-active" : "is-inactive"}`}>
            {activo ? "Activo" : "Inactivo"}
        </span>
    );
};

//
//Intentamos reutilizar cualquier campo existente que represente el ultimo acceso
//
const formatearUltimoAcceso = (valor) => {
    if (!valor) {
        return "-";
    }

    if (typeof valor === "string") {
        const texto = valor.trim();
        if (!texto) {
            return "-";
        }
        if (texto.toLowerCase().includes("hace")) {
            return texto;
        }
    }

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
        return String(valor);
    }

    const diferenciaMs = Date.now() - fecha.getTime();
    const horaMs = 60 * 60 * 1000;
    const diaMs = 24 * horaMs;
    const semanaMs = 7 * diaMs;

    if (diferenciaMs < diaMs) {
        const horas = Math.max(1, Math.round(diferenciaMs / horaMs));
        return `hace ${horas} h`;
    }

    if (diferenciaMs < semanaMs) {
        const dias = Math.max(1, Math.round(diferenciaMs / diaMs));
        return `hace ${dias} dias`;
    }

    const semanas = Math.max(1, Math.round(diferenciaMs / semanaMs));
    return `hace ${semanas} semana${semanas > 1 ? "s" : ""}`;
};

const ultimoAccesoBody = (rowData) => {
    const valor = rowData?.ultimoAcceso
        ?? rowData?.fechaUltimoAcceso
        ?? rowData?.ultimoLogin
        ?? rowData?.fechaLogin
        ?? rowData?.fechaModificacion
        ?? rowData?.usuFechaAcceso;

    return <span>{formatearUltimoAcceso(valor)}</span>;
};

const Usuario = () => {
    const intl = useIntl();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [idUsuario, setIdUsuario] = useState(parseInt(searchParams.get("usuario") || localStorage.getItem("usuarioId")));

    useEffect(() => {
        if (!isNaN(idUsuario)) {
            if (idUsuario > 0) {
                const usuLogeadoId = getUsuarioSesion()?.id
                if ((idUsuario !== usuLogeadoId)) {
                    window.location.href = '/auth/access/'
                    router.push('/auth/access/')
                }
            }
            localStorage.setItem("usuarioId", idUsuario);
        }
        if (searchParams.get("usuario") == null && idUsuario > 0 && !isNaN(idUsuario)) {
            localStorage.removeItem("usuarioId");
        }
    }, []);

    const propsModal = {
        mostrarEdicionEnModal: true,
        modalEdicionProps: {
            showHeader: false,
            className: "neat-crud-edit-dialog usuario-edit-dialog",
            style: { width: "min(560px, 94vw)" },
        },
    };

    //
    //En administracion general dejamos la empresa visible, pero mantenemos primero
    //la estructura principal del mockup
    //
    const columnasUsuarioAdmin = [
        { campo: 'avatar', header: intl.formatMessage({ id: 'Imagen' }), tipo: 'string', body: avatarUsuarioBody, headerStyle: { minWidth: "6rem" }, style: { minWidth: "6rem" } },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Telefono' }), tipo: 'string' },
        { campo: 'nombreRol', header: intl.formatMessage({ id: 'Rol' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Estado' }), tipo: 'string', body: estadoUsuarioBody },
        { campo: 'ultimoAccesoTabla', header: intl.formatMessage({ id: 'Ultimo acceso' }), tipo: 'string', body: ultimoAccesoBody, virtual: true },
        { campo: 'nombreEmpresa', header: intl.formatMessage({ id: 'Empresa' }), tipo: 'string' },
    ];

    //
    //Para cliente seguimos exactamente el orden visual pedido en el mockup
    //
    const columnas = [
        { campo: 'avatar', header: intl.formatMessage({ id: 'Imagen' }), tipo: 'string', body: avatarUsuarioBody, headerStyle: { minWidth: "6rem" }, style: { minWidth: "6rem" } },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Telefono' }), tipo: 'string' },
        { campo: 'nombreRol', header: intl.formatMessage({ id: 'Rol' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Estado' }), tipo: 'string', body: estadoUsuarioBody },
        { campo: 'ultimoAccesoTabla', header: intl.formatMessage({ id: 'Ultimo acceso' }), tipo: 'string', body: ultimoAccesoBody, virtual: true },
    ];

    return (
        <div>
            {//
            //Si estoy entrando el el perfil de un usuario especifico, lo muestro
            //
            }
            {(!isNaN(idUsuario) && idUsuario > 0) && (
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Usuarios' })}
                    getRegistros={getVistaUsuarios}
                    getRegistrosCount={getVistaUsuariosCount}
                    botones={['nuevo', 'editar', 'eliminar', 'descargarCSV']}
                    filtradoBase={{
                        empresaId: Number(localStorage.getItem('empresa'))
                    }}
                    controlador={"Usuarios"}
                    registroEditar={idUsuario}
                    editarComponente={<EditarUsuario />}
                    seccion={"Usuario"}
                    columnas={columnas}
                    deleteRegistro={deleteUsuario}
                    {...propsModal}
                />
            )}
            {//
            //Si estoy entrando en la vista de usuarios y soy administrador no filtro por empresa mostrando todos los usuarios del sistema
            //
            }
            {(isNaN(idUsuario) && searchParams.get("usuario") == null && localStorage.getItem("usuarioId") == null && JSON.parse(localStorage.getItem('userDataNeatpallet'))?.["usuarioAdmin"] === "S") &&
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Usuarios' })}
                    getRegistros={getVistaUsuarios}
                    getRegistrosCount={getVistaUsuariosCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    controlador={"Usuarios"}
                    editarComponente={<EditarUsuario />}
                    seccion={"Usuario"}
                    columnas={columnasUsuarioAdmin}
                    deleteRegistro={deleteUsuario}
                    {...propsModal}
                />
            }
            {//
            //Si estoy entrando en la vista de usuarios y NO soy administrador filtro por empresa mostrando solo los usuarios de la empresa
            //
            }
            {(isNaN(idUsuario) && searchParams.get("usuario") == null && localStorage.getItem("usuarioId") == null && JSON.parse(localStorage.getItem('userDataNeatpallet'))?.["usuarioAdmin"] !== "S") &&
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Usuarios' })}
                    getRegistros={getVistaUsuarios}
                    getRegistrosCount={getVistaUsuariosCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    filtradoBase={{
                        empresaId: Number(localStorage.getItem('empresa'))
                    }}
                    controlador={"Usuarios"}
                    editarComponente={<EditarUsuario />}
                    seccion={"Usuario"}
                    columnas={columnas}
                    deleteRegistro={deleteUsuario}
                    {...propsModal}
                />
            }
        </div>
    );
};
export default Usuario;
