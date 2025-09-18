import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";

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
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el parametro' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={parametro.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del parametro' })}
                        onChange={(e) => setParametro({ ...parametro, nombre: e.target.value })}
                        className={`${(estadoGuardando && parametro.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={parametro.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="valorDisponible">{intl.formatMessage({ id: 'Valores disponibles' })}</label>
                    <InputTextarea value={parametro.valorDisponible}
                        placeholder={intl.formatMessage({ id: 'Valores disponibles para el parametro' })}
                        onChange={(e) => setParametro({ ...parametro, valorDisponible: e.target.value })}
                        rows={5} cols={30} maxLength={500} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosParametro;