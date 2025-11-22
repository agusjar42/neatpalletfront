"use client";
import { getResumenEnvio } from "@/app/api-endpoints/envio";
import EditarResumenEnvio from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const ResumenEnvio = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'id', header: intl.formatMessage({ id: 'ID' }), tipo: 'string' },
        { campo: 'eventosGuardados', header: intl.formatMessage({ id: 'Eventos Guardados' }), tipo: 'number' },
        { campo: 'eventosEnviados', header: intl.formatMessage({ id: 'Eventos Enviados' }), tipo: 'number' },
        { campo: 'totalAlarmas', header: intl.formatMessage({ id: 'Total Alarmas' }), tipo: 'number' },
        { campo: 'bateriaActual', header: intl.formatMessage({ id: 'Batería Actual' }), tipo: 'number' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Resumen Envío' })}
                getRegistros={getResumenEnvio}
                getRegistrosCount={() => Promise.resolve([{count: 0}])}
                botones={['ver']}
                controlador={"Resumen Envío"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarResumenEnvio />}
                columnas={columnas}
            />
        </div>
    );
};
export default ResumenEnvio;