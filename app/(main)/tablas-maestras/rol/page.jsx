"use client";
import { useState } from "react";
import { getRol, getRolCount, deleteRol } from "@/app/api-endpoints/rol";
import EditarRoles from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
import RolIntro from "./RolIntro";
const Rol = () => {
    const intl = useIntl();
    const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
        { campo: 'dashboardUrl', header: intl.formatMessage({ id: 'Pantalla de inicio' }), tipo: 'string' },
    ]

    return (
        <div>
            <RolIntro refreshKey={summaryRefreshKey} />
            <Crud
                headerCrud={intl.formatMessage({ id: 'Roles' })}
                getRegistros={getRol}
                getRegistrosCount={getRolCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Roles"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarRoles />}
                columnas={columnas}
                deleteRegistro={deleteRol}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    style: { width: "min(980px, 92vw)" },
                }}
                onDataChange={() => setSummaryRefreshKey((key) => key + 1)}
            />
        </div>
    );
};
export default Rol;
