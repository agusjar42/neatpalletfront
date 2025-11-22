import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputNumber } from 'primereact/inputnumber';
import { useIntl } from 'react-intl';

const EditarDatosResumenEnvio = ({ resumenEnvio, setResumenEnvio, estadoGuardando }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del resumen de envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="eventosGuardados">{intl.formatMessage({ id: 'Eventos Guardados' })}</label>
                    <InputNumber 
                        value={resumenEnvio.eventosGuardados}
                        disabled
                        inputStyle={{ textAlign: 'right' }} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="eventosEnviados">{intl.formatMessage({ id: 'Eventos Enviados' })}</label>
                    <InputNumber 
                        value={resumenEnvio.eventosEnviados}
                        disabled
                        inputStyle={{ textAlign: 'right' }} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="totalAlarmas">{intl.formatMessage({ id: 'Total Alarmas' })}</label>
                    <InputNumber 
                        value={resumenEnvio.totalAlarmas}
                        disabled
                        inputStyle={{ textAlign: 'right' }} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="bateriaActual">{intl.formatMessage({ id: 'Batería Actual' })}</label>
                    <InputNumber 
                        value={resumenEnvio.bateriaActual}
                        disabled
                        inputStyle={{ textAlign: 'right' }}
                        suffix=" %" 
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosResumenEnvio;