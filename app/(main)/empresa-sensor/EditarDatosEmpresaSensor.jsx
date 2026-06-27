import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { InputNumber } from "primereact/inputnumber";

const EditarDatosEmpresaSensor = ({ empresaSensor, setEmpresaSensor, estadoGuardando, tiposSensor }) => {
    const intl = useIntl();

    //
    //De los Tipos de Sensor solo mostramos los activos y el que esté seleccionado (para poder editar un registro inactivo)
    //
    const opcionesTipoSensor = tiposSensor
        .filter(tipo =>
            tipo.activoSn === "S" ||
            tipo.id === empresaSensor.tipoSensorId
        )
        .map(tipo => ({
            label: tipo.nombre,
            value: tipo.id
        }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el sensor de empresa' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={empresaSensor.orden === '' || empresaSensor.orden === undefined ? null : empresaSensor.orden}
                        onChange={(e) => setEmpresaSensor({ ...empresaSensor, orden: e.value })}
                        className={`${(estadoGuardando && (empresaSensor.orden === "" || empresaSensor.orden === null || empresaSensor.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoSensorId"><b>{intl.formatMessage({ id: 'Tipo de Sensor' })}*</b></label>
                    <Dropdown value={empresaSensor.tipoSensorId || ""}
                        onChange={(e) => setEmpresaSensor({ ...empresaSensor, tipoSensorId: e.value })}
                        options={opcionesTipoSensor}
                        className={`p-column-filter ${(estadoGuardando && (empresaSensor.tipoSensorId == null || empresaSensor.tipoSensorId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Seleccione un tipo de sensor' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                        {intl.formatMessage({ id: 'Valor' })}
                        {/*<span className="pi pi-info-circle text-blue-500" style={{ fontSize: "1.5em" }} />*/}
                    </label>
                    <InputNumber value={empresaSensor.valor}
                        placeholder={intl.formatMessage({ id: 'Valor del sensor' })}
                        onChange={(e) => setEmpresaSensor({ ...empresaSensor, valor: e.value })}
                        maxLength={50}
                        inputStyle={{ textAlign: 'right' }} />
                    <small className="p-text-secondary">
                        {intl.formatMessage({ id: 'Valor mínimo a tener en cuenta en el cálculo.' })}
                    </small>
                </div>
            </div>
            {/* Bocadillo de información */}
            {/*<div className="p-mt-3">
                <div
                    className="flex align-items-center bg-gray-100 border-round p-3 w-full"
                >
                    <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                    <span>
                        {intl.formatMessage({ id: 'Recuerde que solo puede editar los sensores activos o el sensor actualmente seleccionado.' })}
                    </span>
                </div>
            </div>*/}
        </Fieldset>
    );
};

export default EditarDatosEmpresaSensor;
