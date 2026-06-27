import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';
import { InputNumber } from "primereact/inputnumber";

const EditarDatosTipoSensor = ({ tipoSensor, setTipoSensor, estadoGuardando, manejarCambioInputSwitch }) => {
    const intl = useIntl();

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Orden' })}*</b>
                </label>
                <InputNumber
                    value={tipoSensor.orden === '' || tipoSensor.orden === undefined ? null : tipoSensor.orden}
                    onChange={(e) => setTipoSensor({ ...tipoSensor, orden: e.value })}
                    className={`${(estadoGuardando && (tipoSensor.orden === "" || tipoSensor.orden === null || tipoSensor.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: 'right' }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="nombre" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Nombre' })}*</b>
                </label>
                <InputText
                    value={tipoSensor.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del tipo de sensor' })}
                    onChange={(e) => setTipoSensor({ ...tipoSensor, nombre: e.target.value })}
                    className={`${(estadoGuardando && (tipoSensor.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="valorDefecto">{intl.formatMessage({ id: 'Valor Defecto' })}</label>
                <InputText
                    value={tipoSensor.valorDefecto || ""}
                    placeholder={intl.formatMessage({ id: 'Valor defecto del tipo de sensor' })}
                    onChange={(e) => setTipoSensor({ ...tipoSensor, valorDefecto: e.target.value })}
                    maxLength={50}
                />
                <small style={{ color: '#94949f', fontSize: '10px' }}>
                    <i>{intl.formatMessage({ id: 'Este campo se copiara en una empresa en su creacion' })}</i>
                </small>
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="unidad">{intl.formatMessage({ id: 'Unidad' })}</label>
                <InputText
                    value={tipoSensor.unidad || ""}
                    placeholder={intl.formatMessage({ id: 'Unidad del sensor' })}
                    onChange={(e) => setTipoSensor({ ...tipoSensor, unidad: e.target.value })}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={tipoSensor.activoSn === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
        </div>
    );
};

export default EditarDatosTipoSensor;
