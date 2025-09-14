"use client";
import { getEnvioContenido, getEnvioContenidoCount, deleteEnvioContenido } from "@/app/api-endpoints/envio-contenido";
import EditarEnvioContenido from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioContenido = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'ID Envío' }), tipo: 'number' },
        { campo: 'producto', header: intl.formatMessage({ id: 'Producto' }), tipo: 'string' },
        { campo: 'referencia', header: intl.formatMessage({ id: 'Referencia' }), tipo: 'string' },
        { campo: 'pesoKgs', header: intl.formatMessage({ id: 'Peso (Kg)' }), tipo: 'number' },
        { campo: 'pesoTotal', header: intl.formatMessage({ id: 'Peso Total (Kg)' }), tipo: 'number' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Contenidos' })}
                getRegistros={getEnvioContenido}
                getRegistrosCount={getEnvioContenidoCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Contenido"}
                editarComponente={<EditarEnvioContenido />}
                columnas={columnas}
                deleteRegistro={deleteEnvioContenido}
            />
        </div>
    );
};

export default EnvioContenido;