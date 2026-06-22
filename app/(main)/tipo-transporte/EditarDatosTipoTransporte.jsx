import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";

const EditarDatosTipoTransporte = ({ tipoTransporte, setTipoTransporte, estadoGuardando }) => {
    const intl = useIntl();
    
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _tipoTransporte = { ...tipoTransporte };
        const esTrue = valor === true ? 'S' : 'N';
        _tipoTransporte[`${nombreInputSwitch}`] = esTrue;
        setTipoTransporte(_tipoTransporte);
    };

    return (
            <div className="catalogo-edit-form-grid">
                <div className="catalogo-edit-field">
                    <label htmlFor="orden">{intl.formatMessage({ id: 'Orden' })}</label>
                    <InputNumber value={tipoTransporte.orden === '' || tipoTransporte.orden === undefined ? null : tipoTransporte.orden}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, orden: e.value })}
                        className={`${(estadoGuardando && (tipoTransporte.orden === "" || tipoTransporte.orden === null || tipoTransporte.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }}/>
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Nombre' })}</label>
                    <InputText value={tipoTransporte.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoTransporte.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="activoSN">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoTransporte.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
    );
};

export default EditarDatosTipoTransporte;
