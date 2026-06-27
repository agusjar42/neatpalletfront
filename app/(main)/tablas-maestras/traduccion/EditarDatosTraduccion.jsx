import React from "react";
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';

const EditarDatosTraduccion = ({ traduccion, setTraduccion, estadoGuardando, idiomas }) => {
    const intl = useIntl();

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field catalogo-edit-field-full">
                <label htmlFor="clave" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Clave' })}*</b>
                </label>
                <InputText
                    value={traduccion.clave || ""}
                    placeholder={intl.formatMessage({ id: 'Clave de la traduccion' })}
                    onChange={(e) => setTraduccion({ ...traduccion, clave: e.target.value })}
                    className={`${(estadoGuardando && (traduccion.clave || "") === "") ? "p-invalid" : ""}`}
                    disabled={true}
                />
            </div>

            {idiomas.map((idioma) => (
                <div key={idioma.id} className="catalogo-edit-field catalogo-edit-field-full">
                    <label htmlFor={`valor-${idioma.nombre}`}>{idioma.nombre}</label>
                    <InputText
                        value={traduccion[idioma.nombre.toLowerCase()] || ''}
                        placeholder={`${intl.formatMessage({ id: 'Valor de la traduccion en' })} ${idioma.nombre.toLowerCase()}`}
                        onChange={(e) => setTraduccion({
                            ...traduccion,
                            [idioma.nombre.toLowerCase()]: e.target.value
                        })}
                    />
                </div>
            ))}
        </div>
    );
};

export default EditarDatosTraduccion;
