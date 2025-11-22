"use client";
import { getEnvioContenido, getEnvioContenidoCount, deleteEnvioContenido } from "@/app/api-endpoints/envio-contenido";
import EditarEnvioContenido from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioContenido = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen Ruta' }), tipo: 'string' },
        { campo: 'producto', header: intl.formatMessage({ id: 'Producto' }), tipo: 'string' },
        { campo: 'referencia', header: intl.formatMessage({ id: 'Referencia' }), tipo: 'string' },
        { campo: 'pesoKgs', header: intl.formatMessage({ id: 'Peso (Kg)' }), tipo: 'number' },
        { campo: 'cantidad', header: intl.formatMessage({ id: 'Cantidad' }), tipo: 'number' },
        { campo: 'pesoTotal', header: intl.formatMessage({ id: 'Peso Total (Kg)' }), tipo: 'number' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Origen Ruta' })]: registro.origenRuta,
                [intl.formatMessage({ id: 'Producto' })]: registro.producto,
                [intl.formatMessage({ id: 'Referencia' })]: registro.referencia,
                [intl.formatMessage({ id: 'Peso (Kg)' })]: registro.pesoKgs,
                [intl.formatMessage({ id: 'Cantidad' })]: registro.cantidad,
                [intl.formatMessage({ id: 'Peso Total (Kg)' })]: registro.pesoTotal,
            };
        });
    };

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envio Contenido' })}
                getRegistros={getEnvioContenido}
                getRegistrosCount={getEnvioContenidoCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio Contenido"}
                editarComponente={<EditarEnvioContenido />}
                columnas={columnas}
                deleteRegistro={deleteEnvioContenido}
                procesarDatosParaCSV={procesarDatosParaCSV}
            />
        </div>
    );
};

export default EnvioContenido;