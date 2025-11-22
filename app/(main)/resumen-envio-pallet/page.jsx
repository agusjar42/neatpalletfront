"use client";
import { getResumenEnvioPallet } from "@/app/api-endpoints/envio";
import EditarResumenEnvioPallet from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const ResumenEnvioPallet = () => {
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
                headerCrud={intl.formatMessage({ id: 'Resumen Envío Pallet' })}
                getRegistros={getResumenEnvioPallet}
                getRegistrosCount={() => Promise.resolve([{count: 0}])}
                botones={['ver']}
                controlador={"Resumen Envío Pallet"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarResumenEnvioPallet />}
                columnas={columnas}
            />
        </div>
    );
};
export default ResumenEnvioPallet;