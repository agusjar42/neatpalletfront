import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioConfiguracion = ({ envioConfiguracion, setEnvioConfiguracion, estadoGuardando, envios, estoyDentroDeUnTab }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin descripción'}`,
        value: envio.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la configuración de envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={envioConfiguracion.orden}
                        placeholder={intl.formatMessage({ id: 'Orden de la configuración' })}
                        onChange={(e) => setEnvioConfiguracion({ ...envioConfiguracion, orden: e.value })}
                        className={`${(estadoGuardando && (envioConfiguracion.orden === "" || envioConfiguracion.orden === null || envioConfiguracion.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999} 
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                {!estoyDentroDeUnTab && (<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Origen Ruta' })}*</b></label>
                    <Dropdown value={envioConfiguracion.envioId || ""}
                        onChange={(e) => setEnvioConfiguracion({ ...envioConfiguracion, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioConfiguracion.envioId == null || envioConfiguracion.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>)}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={envioConfiguracion.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la configuración' })}
                        onChange={(e) => setEnvioConfiguracion({ ...envioConfiguracion, nombre: e.target.value })}
                        className={`${(estadoGuardando && envioConfiguracion.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={envioConfiguracion.valor}
                        placeholder={intl.formatMessage({ id: 'Valor de la configuración' })}
                        onChange={(e) => setEnvioConfiguracion({ ...envioConfiguracion, valor: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="unidadMedida">{intl.formatMessage({ id: 'Unidad de medida' })}</label>
                    <InputText value={envioConfiguracion.unidadMedida}
                        placeholder={intl.formatMessage({ id: 'Unidad de medida' })}
                        onChange={(e) => setEnvioConfiguracion({ ...envioConfiguracion, unidadMedida: e.target.value })}
                        maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioConfiguracion;
