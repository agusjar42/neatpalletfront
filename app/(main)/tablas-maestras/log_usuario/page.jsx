"use client";
import { useEffect, useState } from "react";
import { getVistaLogUsuarioUsuarios, getVistaLogUsuarioUsuariosCount, deleteLogUsuario } from "@/app/api-endpoints/log_usuario";
//import EditarIdioma from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
import LogsSistemaTabs from "../../logs-incorrectos/LogsSistemaTabs";
import LogsUsuarioIntro, { obtenerTextoTipoLogUsuario, obtenerTipoLogUsuario } from "./LogsUsuarioIntro";

const LogUsuario = () => {
    const intl = useIntl();
    const filtradoBase = { empresaId: getUsuarioSesion()?.empresaId };
    const [registrosResumen, setRegistrosResumen] = useState([]);

    useEffect(() => {
        const cargarResumen = async () => {
            const where = { and: { ...filtradoBase } };
            const queryParams = {
                limit: 100000,
                offset: 0,
                order: "fechaRegistro DESC",
                where,
            };
            const registros = await getVistaLogUsuarioUsuarios(JSON.stringify(queryParams));
            setRegistrosResumen(Array.isArray(registros) ? registros : []);
        };

        cargarResumen();
    }, []);

    const tipoTemplate = (rowData) => {
        const tipo = obtenerTipoLogUsuario(obtenerTextoTipoLogUsuario(rowData));

        return (
            <span className={`neat-log-type-badge ${tipo.className}`}>
                {tipo.label}
            </span>
        );
    };

    const columnas = [
        { campo: 'tipoLogUsuario', header: intl.formatMessage({ id: 'Tipo' }), tipo: 'string', body: tipoTemplate, virtual: true },
        { campo: 'fechaRegistro', header: intl.formatMessage({ id: 'Fecha de registro' }), tipo: 'fechaHora' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Mail' }), tipo: 'string' },
        { campo: 'nombreUsuario', header: intl.formatMessage({ id: 'Usuario' }), tipo: 'string' },
        { campo: 'ip', header: 'Ip', tipo: 'string' },
        { campo: 'masDatos', header: intl.formatMessage({ id: 'Mas datos' }), tipo: 'string' },
    ]

    return (
        <div>
            <LogsSistemaTabs />
            <LogsUsuarioIntro registros={registrosResumen} />
            <Crud
                headerCrud={intl.formatMessage({ id: 'Logs de usuario' })}
                getRegistros={getVistaLogUsuarioUsuarios}
                getRegistrosCount={getVistaLogUsuarioUsuariosCount}
                botones={['descargarCSV']}
                columnas={columnas}
                deleteRegistro={deleteLogUsuario}
                filtradoBase={filtradoBase}
            />
        </div>
    );
};
export default LogUsuario;
