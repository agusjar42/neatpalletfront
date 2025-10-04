import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioParada = ({ envioParada, setEnvioParada, estadoGuardando, envios, estoyDentroDeUnTab }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la parada de envío' })}>
            <div className="formgrid grid">
                {!estoyDentroDeUnTab && (<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Origen Ruta' })}*</b></label>
                    <Dropdown value={envioParada.envioId || ""}
                        onChange={(e) => setEnvioParada({ ...envioParada, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioParada.envioId == null || envioParada.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>)}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fecha">{intl.formatMessage({ id: 'Fecha' })}</label>
                    <InputText type="date"
                    value={envioParada.fecha}
                        placeholder={intl.formatMessage({ id: 'Fecha de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, fecha: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="lugarParada">{intl.formatMessage({ id: 'Lugar de parada' })}</label>
                    <InputText value={envioParada.lugarParada}
                        placeholder={intl.formatMessage({ id: 'Lugar de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, lugarParada: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="lugarParadaGps">{intl.formatMessage({ id: 'GPS de la parada' })}</label>
                    <InputText value={envioParada.lugarParadaGps}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, lugarParadaGps: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="direccion">{intl.formatMessage({ id: 'Dirección' })}</label>
                    <InputText value={envioParada.direccion}
                        placeholder={intl.formatMessage({ id: 'Dirección de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, direccion: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombreOperario">{intl.formatMessage({ id: 'Nombre del operario' })}</label>
                    <InputText value={envioParada.nombreOperario}
                        placeholder={intl.formatMessage({ id: 'Nombre del operario' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, nombreOperario: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="telefonoOperario">{intl.formatMessage({ id: 'Teléfono del operario' })}</label>
                    <InputText value={envioParada.telefonoOperario}
                        placeholder={intl.formatMessage({ id: 'Teléfono del operario' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, telefonoOperario: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="emailOperario">{intl.formatMessage({ id: 'Email del operario' })}</label>
                    <InputText value={envioParada.emailOperario}
                        placeholder={intl.formatMessage({ id: 'Email del operario' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, emailOperario: e.target.value })}
                        maxLength={100} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioParada;