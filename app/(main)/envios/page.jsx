"use client";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import EditarEnvio from "./Editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const Movimiento = () => {
    const intl = useIntl();
    const columnas = [
 
        { campo: 'anyo', header: intl.formatMessage({ id: 'Año' }), tipo: 'string' },
        { campo: 'origen', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destino', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'fechaSalida', header: intl.formatMessage({ id: 'Fecha Salida' }), tipo: 'string' },
        { campo: 'fechaLlegada', header: intl.formatMessage({ id: 'Fecha Llegada' }), tipo: 'string' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Año' })]: registro.anyo,
                [intl.formatMessage({ id: 'Origen' })]: registro.origen,
                [intl.formatMessage({ id: 'Destino' })]: registro.destino,
                [intl.formatMessage({ id: 'Fecha Salida' })]: registro.fecha_salida,
                [intl.formatMessage({ id: 'Fecha Llegada' })]: registro.fecha_llegada,
            };
        });
    };

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envios de Palets' })}
                seccion={"Envios"}
                getRegistros={getEnvio}
                getRegistrosCount={getEnvioCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV', 'pallet', 'parada', 'vehiculo', 'contenido']}
                controlador={"Envios"}
                editarComponente={<EditarEnvio />}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                columnas={columnas}
                deleteRegistro={deleteEnvio}
                procesarDatosParaCSV={procesarDatosParaCSV}
            />
        </div>
    );
};
export default Movimiento;