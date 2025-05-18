import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
const EditarDatosTraduccion = ({ traduccion, setTraduccion, listaIdiomas, idiomaSeleccionado, setIdiomaSeleccionado, estadoGuardando }) => {
    const intl = useIntl();
    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la traduccion' })}>	
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="idioma">{intl.formatMessage({ id: 'Idioma' })}</label>
                    <Dropdown value={idiomaSeleccionado || ""}
                        onChange={(e) => setIdiomaSeleccionado(e.value)}
                        options={listaIdiomas.map(Idioma => Idioma.nombre)}
                        className={`p-column-filter ${(estadoGuardando && (idiomaSeleccionado == null || idiomaSeleccionado === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un idioma' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="clave">{intl.formatMessage({ id: 'Clave' })}</label>
                    <InputText value={traduccion.clave}
                        placeholder={intl.formatMessage({ id: 'Clave de la traduccion' })}
                        onChange={(e) => setTraduccion({ ...traduccion, clave: e.target.value })}
                        className={`${(estadoGuardando && traduccion.clave === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={traduccion.valor}
                        placeholder={intl.formatMessage({ id: 'Valor de la traduccion' })}
                        onChange={(e) => setTraduccion({ ...traduccion, valor: e.target.value })}
                        className={`${(estadoGuardando && traduccion.valor === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosTraduccion;