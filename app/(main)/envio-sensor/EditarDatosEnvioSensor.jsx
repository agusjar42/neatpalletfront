import React from "react";
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

const EditarDatosEnvioSensor = ({ envioSensor, setEnvioSensor, estadoGuardando, envios, tiposSensor, estoyDentroDeUnTab }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));

    //
    //De los tipos de sensor solo mostramos los activos y el seleccionado
    //para no perder el valor actual al editar un registro inactivo
    //
    const opcionesTipoSensor = tiposSensor
        .filter(tipo =>
            tipo.activoSn === "S" ||
            tipo.id === envioSensor.tipoSensorId
        )
        .map(tipo => ({
            label: tipo.nombre,
            value: tipo.id
        }));

    return (
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Orden' })}*</label>
                <InputNumber
                    value={envioSensor.orden === '' || envioSensor.orden === undefined ? null : envioSensor.orden}
                    onChange={(e) => setEnvioSensor({ ...envioSensor, orden: e.value })}
                    className={`w-full ${(estadoGuardando && (envioSensor.orden === "" || envioSensor.orden === null || envioSensor.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: 'right' }}
                />
            </div>

            {!estoyDentroDeUnTab && (
                <div className="catalogo-edit-field">
                    <label htmlFor="envioId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Origen Ruta' })}*</label>
                    <Dropdown
                        value={envioSensor.envioId || ""}
                        onChange={(e) => setEnvioSensor({ ...envioSensor, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`w-full p-column-filter ${(estadoGuardando && (envioSensor.envioId == null || envioSensor.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envio' })}
                    />
                </div>
            )}

            <div className="catalogo-edit-field">
                <label htmlFor="tipoSensorId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Tipo de Sensor' })}*</label>
                <Dropdown
                    value={envioSensor.tipoSensorId || ""}
                    onChange={(e) => setEnvioSensor({ ...envioSensor, tipoSensorId: e.value })}
                    options={opcionesTipoSensor}
                    className={`w-full p-column-filter ${(estadoGuardando && (envioSensor.tipoSensorId == null || envioSensor.tipoSensorId === "")) ? "p-invalid" : ""}`}
                    showClear
                    placeholder={intl.formatMessage({ id: 'Selecciona un tipo de sensor' })}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="valor" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Valor' })}*</label>
                <InputText
                    value={envioSensor.valor || ""}
                    placeholder={intl.formatMessage({ id: 'Valor del sensor' })}
                    onChange={(e) => setEnvioSensor({ ...envioSensor, valor: e.target.value })}
                    className={`w-full ${(estadoGuardando && (envioSensor.valor === "" || envioSensor.valor === null || envioSensor.valor === undefined)) ? "p-invalid" : ""}`}
                    maxLength={50}
                />
                <small className="p-text-secondary">
                    {intl.formatMessage({ id: 'Valor minimo a tener en cuenta en el calculo.' })}
                </small>
            </div>
        </div>
    );
};

export default EditarDatosEnvioSensor;
