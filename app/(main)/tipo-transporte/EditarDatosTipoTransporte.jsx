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
                    <label htmlFor="codigo">{intl.formatMessage({ id: 'Codigo' })}</label>
                    <InputText value={tipoTransporte.codigo || ""}
                        placeholder={intl.formatMessage({ id: 'Codigo del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, codigo: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="vehiculo">{intl.formatMessage({ id: 'Vehiculo' })}</label>
                    <InputText value={tipoTransporte.vehiculo || ""}
                        placeholder={intl.formatMessage({ id: 'Vehiculo del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, vehiculo: e.target.value, nombre: e.target.value })}
                        className={`${(estadoGuardando && (tipoTransporte.vehiculo || tipoTransporte.nombre || "") === "") ? "p-invalid" : ""}`}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="uso">{intl.formatMessage({ id: 'Uso' })}</label>
                    <InputText value={tipoTransporte.uso || ""}
                        placeholder={intl.formatMessage({ id: 'Uso del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, uso: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="categoria">{intl.formatMessage({ id: 'Categoria' })}</label>
                    <InputText value={tipoTransporte.categoria || ""}
                        placeholder={intl.formatMessage({ id: 'Categoria del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, categoria: e.target.value })}
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
