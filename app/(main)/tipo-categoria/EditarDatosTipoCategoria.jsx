import React from "react";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useIntl } from "react-intl";

const EditarDatosTipoCategoria = ({ tipoCategoria, setTipoCategoria, estadoGuardando, manejarCambioInputSwitch }) => {
    const intl = useIntl();

    return (
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field">
                <label htmlFor="orden">{intl.formatMessage({ id: "Orden" })}</label>
                <InputNumber
                    value={tipoCategoria.orden === "" || tipoCategoria.orden === undefined ? null : tipoCategoria.orden}
                    onChange={(e) => setTipoCategoria({ ...tipoCategoria, orden: e.value })}
                    className={`${(estadoGuardando && (tipoCategoria.orden === "" || tipoCategoria.orden === null || tipoCategoria.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: "right" }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="nombre">{intl.formatMessage({ id: "Nombre" })}</label>
                <InputText
                    value={tipoCategoria.nombre || ""}
                    placeholder={intl.formatMessage({ id: "Nombre del tipo de categoria" })}
                    onChange={(e) => setTipoCategoria({ ...tipoCategoria, nombre: e.target.value })}
                    className={`${(estadoGuardando && (tipoCategoria.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: "Activo" })}</label>
                <InputSwitch
                    checked={(tipoCategoria.activoSn || "S") === "S"}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
        </div>
    );
};

export default EditarDatosTipoCategoria;
