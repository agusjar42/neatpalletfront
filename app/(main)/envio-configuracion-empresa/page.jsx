"use client";
import { getEnvioConfiguracionEmpresa, getEnvioConfiguracionEmpresaCount, deleteEnvioConfiguracionEmpresa } from "@/app/api-endpoints/envio-configuracion-empresa";
import EditarEnvioConfiguracionEmpresas from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const EnvioConfiguracionEmpresa = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'unidadMedida', header: intl.formatMessage({ id: 'Unidad de medida' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Configuraciones de Empresa' })}
                getRegistros={getEnvioConfiguracionEmpresa}
                getRegistrosCount={getEnvioConfiguracionEmpresaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio Configuracion Empresa"}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarEnvioConfiguracionEmpresas />}
                columnas={columnas}
                deleteRegistro={deleteEnvioConfiguracionEmpresa}
            />
        </div>
    );
};

export default EnvioConfiguracionEmpresa;