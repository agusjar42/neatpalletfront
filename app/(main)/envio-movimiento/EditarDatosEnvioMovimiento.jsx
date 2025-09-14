import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioMovimiento = ({ envioMovimiento, setEnvioMovimiento, estadoGuardando, envios, tiposSensor }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.descripcion || 'Sin descripción'}`,
        value: envio.id
    }));

    const opcionesTipoSensor = tiposSensor.map(tipo => ({
        label: tipo.nombre,
        value: tipo.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el movimiento de envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Envío' })}*</b></label>
                    <Dropdown value={envioMovimiento.envioId || ""}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioMovimiento.envioId == null || envioMovimiento.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoSensorId"><b>{intl.formatMessage({ id: 'Tipo de Sensor' })}*</b></label>
                    <Dropdown value={envioMovimiento.tipoSensorId || ""}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, tipoSensorId: e.value })}
                        options={opcionesTipoSensor}
                        className={`p-column-filter ${(estadoGuardando && (envioMovimiento.tipoSensorId == null || envioMovimiento.tipoSensorId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un tipo de sensor' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fecha">{intl.formatMessage({ id: 'Fecha' })}</label>
                    <InputText value={envioMovimiento.fecha}
                        placeholder={intl.formatMessage({ id: 'Fecha del movimiento' })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, fecha: e.target.value })}
                        maxLength={20} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="gps">{intl.formatMessage({ id: 'GPS' })}</label>
                    <InputText value={envioMovimiento.gps}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS' })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, gps: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="imagen">{intl.formatMessage({ id: 'Imagen' })}</label>
                    <InputText value={envioMovimiento.imagen}
                        placeholder={intl.formatMessage({ id: 'Ruta de la imagen' })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, imagen: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={envioMovimiento.valor}
                        placeholder={intl.formatMessage({ id: 'Valor del sensor' })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, valor: e.target.value })}
                        maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioMovimiento;