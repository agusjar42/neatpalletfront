import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';
const EditarDatosSeccion = ({ seccion, setSeccion, estadoGuardando }) => {
    const intl = useIntl();
    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la seccion' })}>
            <div className="flex flex-column gap-2">
                <label htmlFor="nombre">{intl.formatMessage({ id: 'Nombre' })}</label>
                <InputText value={seccion.nombre}
                    placeholder={intl.formatMessage({ id: 'Nombre de la seccion' })}
                    onChange={(e) => setSeccion({ ...seccion, nombre: e.target.value })}
                    className={`${(estadoGuardando && seccion.nombre === "") ? "p-invalid" : ""}`}
                    rows={5} cols={30} />
            </div>
        </Fieldset>
    );
};

export default EditarDatosSeccion;