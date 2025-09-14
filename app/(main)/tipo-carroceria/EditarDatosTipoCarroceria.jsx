import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';

const EditarDatosTipoCarroceria = ({ tipoCarroceria, setTipoCarroceria, estadoGuardando }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el tipo de carrocería' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={tipoCarroceria.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de carrocería' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoCarroceria.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosTipoCarroceria;