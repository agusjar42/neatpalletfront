"use client";
import { getEnvioMovimiento, getEnvioMovimientoCount, deleteEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import EditarEnvioMovimientos from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioMovimiento = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'ID Envío' }), tipo: 'number' },
        { campo: 'tipoSensorId', header: intl.formatMessage({ id: 'ID Tipo Sensor' }), tipo: 'number' },
        { campo: 'fecha', header: intl.formatMessage({ id: 'Fecha' }), tipo: 'string' },
        { campo: 'gps', header: intl.formatMessage({ id: 'GPS' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Movimientos de Envío' })}
                getRegistros={getEnvioMovimiento}
                getRegistrosCount={getEnvioMovimientoCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"EnvioMovimiento"}
                editarComponente={<EditarEnvioMovimientos />}
                columnas={columnas}
                deleteRegistro={deleteEnvioMovimiento}
            />
        </div>
    );
};

export default EnvioMovimiento;