import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from "primereact/inputnumber";
import { AutoComplete } from "primereact/autocomplete";
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
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el pais' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="paisNombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={pais.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del pais' })}
                        onChange={(e) => setPais({ ...pais, nombre: e.target.value })}
                        className={`${(estadoGuardando && pais.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="paisIso">{intl.formatMessage({ id: 'Iso' })}</label>
                    <InputText value={pais.iso}
                        placeholder={intl.formatMessage({ id: 'Iso del pais' })}
                        onChange={(e) => setPais({ ...pais, iso: e.target.value })}
                        //className={`${(estadoGuardando && pais.iso === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={10} />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={pais.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosPais;