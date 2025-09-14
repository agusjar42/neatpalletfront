import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosPalletParametro = ({ palletParametro, setPalletParametro, estadoGuardando, pallets, parametros }) => {
    const intl = useIntl();

    const opcionesPallet = pallets.map(pallet => ({
        label: `${pallet.codigo} - ${pallet.alias || pallet.modelo || 'Sin alias'}`,
        value: pallet.id
    }));

    const opcionesParametro = parametros.map(parametro => ({
        label: parametro.nombre,
        value: parametro.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el parámetro del pallet' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="palletId"><b>{intl.formatMessage({ id: 'Pallet' })}*</b></label>
                    <Dropdown value={palletParametro.palletId || ""}
                        onChange={(e) => setPalletParametro({ ...palletParametro, palletId: e.value })}
                        options={opcionesPallet}
                        className={`p-column-filter ${(estadoGuardando && (palletParametro.palletId == null || palletParametro.palletId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un pallet' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="parametroId"><b>{intl.formatMessage({ id: 'Parámetro' })}*</b></label>
                    <Dropdown value={palletParametro.parametroId || ""}
                        onChange={(e) => setPalletParametro({ ...palletParametro, parametroId: e.value })}
                        options={opcionesParametro}
                        className={`p-column-filter ${(estadoGuardando && (palletParametro.parametroId == null || palletParametro.parametroId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un parámetro' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={palletParametro.valor}
                        placeholder={intl.formatMessage({ id: 'Valor del parámetro' })}
                        onChange={(e) => setPalletParametro({ ...palletParametro, valor: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="textoLibre">{intl.formatMessage({ id: 'Texto libre' })}</label>
                    <InputTextarea value={palletParametro.textoLibre}
                        placeholder={intl.formatMessage({ id: 'Texto libre adicional' })}
                        onChange={(e) => setPalletParametro({ ...palletParametro, textoLibre: e.target.value })}
                        rows={3} cols={30} maxLength={500} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosPalletParametro;