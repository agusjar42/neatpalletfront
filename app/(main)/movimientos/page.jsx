"use client";
import { getMovimientos, getMovimientosCount, deleteMovimiento } from "@/app/api-endpoints/movimiento";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const Movimiento = () => {
    const intl = useIntl();
    const columnas = [
 
         { campo: 'name', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'temperature', header: intl.formatMessage({ id: 'Temperatura' }), tipo: 'string' },
        { campo: 'humidity', header: intl.formatMessage({ id: 'Humedad' }), tipo: 'string' },
        { campo: 'press', header: intl.formatMessage({ id: 'Presión' }), tipo: 'string' },
        { campo: 'pm2_5', header: intl.formatMessage({ id: 'pm2_5' }), tipo: 'string' },
        { campo: 'pm5', header: intl.formatMessage({ id: 'pm5' }), tipo: 'string' },
        { campo: 'pm10', header: intl.formatMessage({ id: 'pm10' }), tipo: 'string' },
        { campo: 'battery_volts', header: intl.formatMessage({ id: 'Bat.Voltios' }), tipo: 'string' },
        { campo: 'battery_pct', header: intl.formatMessage({ id: 'Bat. PCT' }), tipo: 'string' },
        { campo: 'rssi', header: intl.formatMessage({ id: 'Rssi' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Movimientos de Palets' })}
                getRegistros={getMovimientos}
                getRegistrosCount={getMovimientosCount}
                botones={['eliminar', 'descargarCSV']}
                controlador={"Movimientos"}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                columnas={columnas}
                deleteRegistro={deleteMovimiento}
            />
        </div>
    );
};
export default Movimiento;