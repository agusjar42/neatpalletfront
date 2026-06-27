import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";

const EditarDatosTipoTransporte = ({
    tipoTransporte,
    setTipoTransporte,
    estadoGuardando,
    vehiculosDisponibles = [],
    categoriasDisponibles = [],
}) => {
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
                    <label htmlFor="orden" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Orden' })}*</label>
                    <InputNumber value={tipoTransporte.orden === '' || tipoTransporte.orden === undefined ? null : tipoTransporte.orden}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, orden: e.value })}
                        className={`${(estadoGuardando && (tipoTransporte.orden === "" || tipoTransporte.orden === null || tipoTransporte.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }}/>
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="nombre" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Nombre' })}*</label>
                    <InputText value={tipoTransporte.nombre || ""}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, nombre: e.target.value })}
                        className={`${(estadoGuardando && (tipoTransporte.nombre === "" || tipoTransporte.nombre === null || tipoTransporte.nombre === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="vehiculo">{intl.formatMessage({ id: 'Vehiculo' })}</label>
                    <Dropdown value={tipoTransporte.tipoVehiculoId ?? null}
                        options={vehiculosDisponibles}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, tipoVehiculoId: e.value })}
                        placeholder={intl.formatMessage({ id: 'Selecciona un vehiculo' })}
                        className={`${(estadoGuardando && !tipoTransporte.tipoVehiculoId) ? "p-invalid" : ""}`}
                        showClear />
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
                    <Dropdown value={tipoTransporte.tipoCategoriaId ?? null}
                        options={categoriasDisponibles}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, tipoCategoriaId: e.value })}
                        placeholder={intl.formatMessage({ id: 'Selecciona una categoria' })}
                        showClear />
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
