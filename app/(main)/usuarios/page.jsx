"use client";
import { deleteUsuario, getVistaUsuarios, getVistaUsuariosCount } from "@/app/api-endpoints/usuario";
import Crud from "../../components/shared/crud";
import EditarUsuario from "./editar";
import { useIntl } from 'react-intl'
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getUsuarioSesion } from "@/app/utility/Utils";
import { useState, useEffect, useRef } from "react";
import Cookies from 'js-cookie';

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

    const columnas = [
        { campo: 'nombreRol', header: intl.formatMessage({ id: 'Rol' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]
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
                />
            )}
            {//                
            //Si estoy entrando en la vista de usuarios
            //
            }
            {(isNaN(idUsuario) && searchParams.get("usuario") == null && localStorage.getItem("usuarioId") == null) &&
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
                />
            }
        </div>
    );
};
export default Usuario;