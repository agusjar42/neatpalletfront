import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
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
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el tipo de transporte' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={tipoTransporte.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de transporte' })}
                        onChange={(e) => setTipoTransporte({ ...tipoTransporte, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoTransporte.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoTransporte.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosTipoTransporte;