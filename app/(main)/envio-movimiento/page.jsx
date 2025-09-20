"use client";
import { getEnvioMovimiento, getEnvioMovimientoCount, deleteEnvioMovimiento } from "@/app/api-endpoints/envio-movimiento";
import EditarEnvioMovimientos from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioMovimiento = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen Ruta' }), tipo: 'string' },
        { campo: 'nombreSensor', header: intl.formatMessage({ id: 'Nombre Sensor' }), tipo: 'string' },
        { campo: 'fechaEspanol', header: intl.formatMessage({ id: 'Fecha' }), tipo: 'string' },
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
                controlador={"Envio Movimiento"}
                editarComponente={<EditarEnvioMovimientos />}
                columnas={columnas}
                deleteRegistro={deleteEnvioMovimiento}
            />
        </div>
    );
};

export default EnvioMovimiento;