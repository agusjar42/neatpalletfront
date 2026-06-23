import React from "react";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useIntl } from "react-intl";

const EditarDatosTipoVehiculo = ({ tipoVehiculo, setTipoVehiculo, estadoGuardando, manejarCambioInputSwitch }) => {
    const intl = useIntl();

    return (
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field">
                <label htmlFor="orden">{intl.formatMessage({ id: "Orden" })}</label>
                <InputNumber
                    value={tipoVehiculo.orden === "" || tipoVehiculo.orden === undefined ? null : tipoVehiculo.orden}
                    onChange={(e) => setTipoVehiculo({ ...tipoVehiculo, orden: e.value })}
                    className={`${(estadoGuardando && (tipoVehiculo.orden === "" || tipoVehiculo.orden === null || tipoVehiculo.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: "right" }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="nombre">{intl.formatMessage({ id: "Nombre" })}</label>
                <InputText
                    value={tipoVehiculo.nombre || ""}
                    placeholder={intl.formatMessage({ id: "Nombre del tipo de vehiculo" })}
                    onChange={(e) => setTipoVehiculo({ ...tipoVehiculo, nombre: e.target.value })}
                    className={`${(estadoGuardando && (tipoVehiculo.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: "Activo" })}</label>
                <InputSwitch
                    checked={(tipoVehiculo.activoSn || "S") === "S"}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
        </div>
    );
};

export default EditarDatosTipoVehiculo;
