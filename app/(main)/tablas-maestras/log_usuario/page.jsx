"use client";
import { getVistaLogUsuarioUsuarios, getVistaLogUsuarioUsuariosCount, deleteLogUsuario } from "@/app/api-endpoints/log_usuario";
//import EditarIdioma from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const LogUsuario = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombreUsuario', header: intl.formatMessage({ id: 'Usuario' }), tipo: 'string' },
        { campo: 'fechaRegistro', header: intl.formatMessage({ id: 'Fecha de registro' }), tipo: 'fechaHora' },
        { campo: 'ip', header: 'Ip', tipo: 'string' },
        { campo: 'masDatos', header: intl.formatMessage({ id: 'Mas datos' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Log de usuarios' })}
                getRegistros={getVistaLogUsuarioUsuarios}
                getRegistrosCount={getVistaLogUsuarioUsuariosCount}
                botones={['descargarCSV']}
                columnas={columnas}
                deleteRegistro={deleteLogUsuario}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
            />
        </div>
    );
};
export default LogUsuario;