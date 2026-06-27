import React from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useIntl } from "react-intl";

const EditarDatosPallet = ({ pallet, setPallet, estadoGuardando }) => {
    const intl = useIntl();
    const fechaImpresionInput = pallet.fechaImpresion
        ? String(pallet.fechaImpresion).slice(0, 10)
        : "";

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: "black" }}><b>{intl.formatMessage({ id: "Orden" })}*</b></label>
                <InputNumber
                    value={pallet.orden === "" || pallet.orden === undefined ? null : pallet.orden}
                    placeholder={intl.formatMessage({ id: "Orden del pallet" })}
                    onChange={(e) => setPallet({ ...pallet, orden: e.value })}
                    className={`${(estadoGuardando && (pallet.orden === "" || pallet.orden === null || pallet.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: "right" }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="codigo" style={{ color: "black" }}><b>{intl.formatMessage({ id: "Codigo" })}*</b></label>
                <InputText
                    value={pallet.codigo || ""}
                    placeholder={intl.formatMessage({ id: "Codigo del pallet" })}
                    onChange={(e) => setPallet({ ...pallet, codigo: e.target.value })}
                    className={`${(estadoGuardando && (pallet.codigo || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="alias" style={{ color: "black" }}><b>{intl.formatMessage({ id: "Alias" })}*</b></label>
                <InputText
                    value={pallet.alias || ""}
                    placeholder={intl.formatMessage({ id: "Alias del pallet" })}
                    onChange={(e) => setPallet({ ...pallet, alias: e.target.value })}
                    className={`${(estadoGuardando && (pallet.alias || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="adquisicion">{intl.formatMessage({ id: "Adquisicion" })}</label>
                <InputText
                    type="date"
                    value={fechaImpresionInput}
                    onChange={(e) => setPallet({ ...pallet, fechaImpresion: e.target.value })}
                    maxLength={20}
                    style={{ textAlign: "right" }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="medidas">{intl.formatMessage({ id: "Medidas" })}</label>
                <InputText
                    value={pallet.medidas || ""}
                    placeholder={intl.formatMessage({ id: "Medidas del pallet" })}
                    onChange={(e) => setPallet({ ...pallet, medidas: e.target.value })}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="modelo">{intl.formatMessage({ id: "Modelo" })}</label>
                <InputText
                    value={pallet.modelo || ""}
                    placeholder={intl.formatMessage({ id: "Modelo del pallet" })}
                    onChange={(e) => setPallet({ ...pallet, modelo: e.target.value })}
                    maxLength={50}
                />
            </div>
            
            <div className="catalogo-edit-field">
                <label htmlFor="periodoEnvioMail">{intl.formatMessage({ id: "Periodo envio mail (horas)" })}</label>
                <InputNumber
                    value={pallet.periodoEnvioMail}
                    placeholder={intl.formatMessage({ id: "Horas entre envios de mail" })}
                    onValueChange={(e) => setPallet({ ...pallet, periodoEnvioMail: e.value })}
                    min={0}
                    max={9999}
                    inputStyle={{ textAlign: "right" }}
                />
            </div>
        </div>
    );
};

export default EditarDatosPallet;
