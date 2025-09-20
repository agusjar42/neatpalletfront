import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useIntl } from 'react-intl';

const EditarDatosPallet = ({ pallet, setPallet, estadoGuardando }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el pallet' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="codigo"><b>{intl.formatMessage({ id: 'Código' })}*</b></label>
                    <InputText value={pallet.codigo}
                        placeholder={intl.formatMessage({ id: 'Código del pallet' })}
                        onChange={(e) => setPallet({ ...pallet, codigo: e.target.value })}
                        className={`${(estadoGuardando && pallet.codigo === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="alias">{intl.formatMessage({ id: 'Alias' })}</label>
                    <InputText value={pallet.alias}
                        placeholder={intl.formatMessage({ id: 'Alias del pallet' })}
                        onChange={(e) => setPallet({ ...pallet, alias: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaImpresion">{intl.formatMessage({ id: 'Fecha de impresión' })}</label>
                    <InputText
                        type="date"
                        value={pallet.fechaImpresion}
                        onChange={(e) => setPallet({ ...pallet, fechaImpresion: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="medidas">{intl.formatMessage({ id: 'Medidas' })}</label>
                    <InputText value={pallet.medidas}
                        placeholder={intl.formatMessage({ id: 'Medidas del pallet' })}
                        onChange={(e) => setPallet({ ...pallet, medidas: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="modelo">{intl.formatMessage({ id: 'Modelo' })}</label>
                    <InputText value={pallet.modelo}
                        placeholder={intl.formatMessage({ id: 'Modelo del pallet' })}
                        onChange={(e) => setPallet({ ...pallet, modelo: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="periodoEnvioMail">{intl.formatMessage({ id: 'Período envío mail (horas)' })}</label>
                    <InputNumber value={pallet.periodoEnvioMail}
                        placeholder={intl.formatMessage({ id: 'Horas entre envíos de mail' })}
                        onValueChange={(e) => setPallet({ ...pallet, periodoEnvioMail: e.value })}
                        min={0} max={9999}
                        inputStyle={{ textAlign: 'right' }}
                        />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosPallet;