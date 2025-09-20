import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioSensor = ({ envioSensor, setEnvioSensor, estadoGuardando, envios, tiposSensor }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));
    //
    //De los Tipos de Sensor solo mostramos los activos y el que esté seleccionado (para poder editar un registro inactivo)
    //
    const opcionesTipoSensor = tiposSensor
        .filter(tipo =>
            tipo.activoSn === "S" ||
            tipo.id === tiposSensor.tipoSensorId
        )
        .map(tipo => ({
            label: tipo.nombre,
            value: tipo.id
        }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el sensor de envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Envío' })}*</b></label>
                    <Dropdown value={envioSensor.envioId || ""}
                        onChange={(e) => setEnvioSensor({ ...envioSensor, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioSensor.envioId == null || envioSensor.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoSensorId"><b>{intl.formatMessage({ id: 'Tipo de Sensor' })}*</b></label>
                    <Dropdown value={envioSensor.tipoSensorId || ""}
                        onChange={(e) => setEnvioSensor({ ...envioSensor, tipoSensorId: e.value })}
                        options={opcionesTipoSensor}
                        className={`p-column-filter ${(estadoGuardando && (envioSensor.tipoSensorId == null || envioSensor.tipoSensorId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un tipo de sensor' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={envioSensor.valor}
                        placeholder={intl.formatMessage({ id: 'Valor del sensor' })}
                        onChange={(e) => setEnvioSensor({ ...envioSensor, valor: e.target.value })}
                        maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioSensor;