import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from "primereact/inputnumber";
import { useIntl } from 'react-intl';

const EditarDatosPais = ({ pais, setPais, estadoGuardando }) => {
    const intl = useIntl();

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _paischeck = { ...pais };
        const esTrue = valor === true ? 'S' : 'N';
        _paischeck[`${nombreInputSwitch}`] = esTrue;
        setPais(_paischeck);
    };

    return (
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Orden' })}*</b>
                </label>
                <InputNumber
                    value={pais.orden === '' || pais.orden === undefined ? null : pais.orden}
                    onChange={(e) => setPais({ ...pais, orden: e.value })}
                    className={`${(estadoGuardando && (pais.orden === "" || pais.orden === null || pais.orden === undefined)) ? "p-invalid" : ""}`}
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
                    value={pais.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del pais' })}
                    onChange={(e) => setPais({ ...pais, nombre: e.target.value })}
                    className={`${(estadoGuardando && (pais.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="iso">{intl.formatMessage({ id: 'Iso' })}</label>
                <InputText
                    value={pais.iso || ""}
                    placeholder={intl.formatMessage({ id: 'Iso del pais' })}
                    onChange={(e) => setPais({ ...pais, iso: e.target.value })}
                    maxLength={10}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={pais.activoSn === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
        </div>
    );
};

export default EditarDatosPais;
