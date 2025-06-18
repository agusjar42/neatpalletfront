import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';
const EditarDatosSeccion = ({ seccion, setSeccion, estadoGuardando }) => {
    const intl = useIntl();
    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la sección' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                <InputText value={seccion.nombre}
                    placeholder={intl.formatMessage({ id: 'Nombre de la sección' })}
                    onChange={(e) => setSeccion({ ...seccion, nombre: e.target.value })}
                    className={`${(estadoGuardando && seccion.nombre === "") ? "p-invalid" : ""}`}
                    rows={5} cols={30} maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosSeccion;