import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioPallet = ({ envioPallet, setEnvioPallet, estadoGuardando, envios, pallets }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));

    const opcionesPallet = pallets.map(pallet => ({
        label: `${pallet.codigo} - ${pallet.alias || pallet.modelo || 'Sin alias'}`,
        value: pallet.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el envío de pallet' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Envío' })}*</b></label>
                    <Dropdown value={envioPallet.envioId || ""}
                        onChange={(e) => setEnvioPallet({ ...envioPallet, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioPallet.envioId == null || envioPallet.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="palletId"><b>{intl.formatMessage({ id: 'Pallet' })}*</b></label>
                    <Dropdown value={envioPallet.palletId || ""}
                        onChange={(e) => setEnvioPallet({ ...envioPallet, palletId: e.value })}
                        options={opcionesPallet}
                        className={`p-column-filter ${(estadoGuardando && (envioPallet.palletId == null || envioPallet.palletId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un pallet' })} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioPallet;