import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";

const EditarDatosParametro = ({ parametro, setParametro, estadoGuardando }) => {
    const intl = useIntl();

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _parametro = { ...parametro };
        const esTrue = valor === true ? 'S' : 'N';
        _parametro[`${nombreInputSwitch}`] = esTrue;
        setParametro(_parametro);
    };

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Orden' })}*</b>
                </label>
                <InputNumber
                    value={parametro.orden === '' || parametro.orden === undefined ? null : parametro.orden}
                    onChange={(e) => setParametro({ ...parametro, orden: e.value })}
                    className={`${(estadoGuardando && (parametro.orden === "" || parametro.orden === null || parametro.orden === undefined)) ? "p-invalid" : ""}`}
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
                    value={parametro.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del parametro' })}
                    onChange={(e) => setParametro({ ...parametro, nombre: e.target.value })}
                    className={`${(estadoGuardando && (parametro.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={parametro.activoSn === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
            <div className="catalogo-edit-field catalogo-edit-field-full">
                <label htmlFor="valorDisponible">{intl.formatMessage({ id: 'Valores disponibles' })}</label>
                <InputTextarea
                    value={parametro.valorDisponible || ""}
                    placeholder={intl.formatMessage({ id: 'Valores disponibles para el parametro' })}
                    onChange={(e) => setParametro({ ...parametro, valorDisponible: e.target.value })}
                    rows={5}
                    maxLength={500}
                />
            </div>
        </div>
    );
};

export default EditarDatosParametro;
