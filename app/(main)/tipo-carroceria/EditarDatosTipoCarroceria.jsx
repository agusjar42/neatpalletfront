import React from "react";
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

const EditarDatosTipoCarroceria = ({
    tipoCarroceria,
    setTipoCarroceria,
    estadoGuardando,
    tiposDisponibles = [],
}) => {
    const intl = useIntl();
    
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _tipoCarroceria = { ...tipoCarroceria };
        const esTrue = valor === true ? 'S' : 'N';
        _tipoCarroceria[`${nombreInputSwitch}`] = esTrue;
        setTipoCarroceria(_tipoCarroceria);
    };

    return (
            <div className="catalogo-edit-form-grid">
                <div className="catalogo-edit-field">
                    <label htmlFor="orden">{intl.formatMessage({ id: 'Orden' })}</label>
                    <InputNumber value={tipoCarroceria.orden === '' || tipoCarroceria.orden === undefined ? null : tipoCarroceria.orden}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, orden: e.value })}
                        className={`${(estadoGuardando && (tipoCarroceria.orden === "" || tipoCarroceria.orden === null || tipoCarroceria.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="codigo">{intl.formatMessage({ id: 'Codigo' })}</label>
                    <InputText value={tipoCarroceria.codigo || ""}
                        placeholder={intl.formatMessage({ id: 'Codigo de la carroceria' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, codigo: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Tipo' })}</label>
                    <Dropdown value={tipoCarroceria.nombre || ""}
                        options={tiposDisponibles}
                        placeholder={intl.formatMessage({ id: 'Selecciona un tipo de carroceria' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, nombre: e.value })}
                        className={`${(estadoGuardando && tipoCarroceria.nombre === "") ? "p-invalid" : ""}`}
                        showClear />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="capacidad">{intl.formatMessage({ id: 'Capacidad' })}</label>
                    <InputText value={tipoCarroceria.capacidad || ""}
                        placeholder={intl.formatMessage({ id: 'Capacidad de la carroceria' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, capacidad: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="activoSN">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoCarroceria.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
    );
};

export default EditarDatosTipoCarroceria;
