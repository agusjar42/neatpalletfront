import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { useIntl } from 'react-intl';

const EditarDatosEnvio = ({ envio, setEnvio, estadoGuardando }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del envío' })}>
            <div className="formgrid grid">
                {/* Primera fila */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="origenRuta"><b>{intl.formatMessage({ id: 'Origen de la ruta' })}*</b></label>
                    <InputText 
                        value={envio.origenRuta || ""}
                        placeholder={intl.formatMessage({ id: 'Ingrese el origen' })}
                        onChange={(e) => setEnvio({ ...envio, origenRuta: e.target.value })}
                        className={`${(estadoGuardando && (envio.origenRuta === "" || envio.origenRuta === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="destinoRuta"><b>{intl.formatMessage({ id: 'Destino de la ruta' })}*</b></label>
                    <InputText 
                        value={envio.destinoRuta || ""}
                        placeholder={intl.formatMessage({ id: 'Ingrese el destino' })}
                        onChange={(e) => setEnvio({ ...envio, destinoRuta: e.target.value })}
                        className={`${(estadoGuardando && (envio.destinoRuta === "" || envio.destinoRuta === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>

                {/* Segunda fila */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="gpsRutaOrigen"><b>{intl.formatMessage({ id: 'GPS Ruta Origen' })}*</b></label>
                    <InputText 
                        value={envio.gpsRutaOrigen || ""}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS origen (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, gpsRutaOrigen: e.target.value })}
                        maxLength={50} 
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="gpsRutaDestino"><b>{intl.formatMessage({ id: 'GPS Ruta Destino' })}*</b></label>
                    <InputText 
                        value={envio.gpsRutaDestino || ""}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS destino (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, gpsRutaDestino: e.target.value })}
                        maxLength={50} 
                    />
                </div>

                {/* Tercera fila */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaSalida"><b>{intl.formatMessage({ id: 'Fecha de salida' })}*</b></label>
                    <InputText type="date"
                        value={envio.fechaSalida}
                        placeholder={intl.formatMessage({ id: 'Seleccione fecha y hora de salida' })}
                        onChange={(e) => setEnvio({ ...envio, fechaSalida: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaLlegada"><b>{intl.formatMessage({ id: 'Fecha de llegada' })}*</b></label>
                    <InputText type="date"
                        value={envio.fechaLlegada}
                        placeholder={intl.formatMessage({ id: 'Seleccione fecha y hora de llegada' })}
                        onChange={(e) => setEnvio({ ...envio, fechaLlegada: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="paradasPrevistas">{intl.formatMessage({ id: 'Paradas previstas' })}</label>
                    <InputNumber 
                        value={envio.paradasPrevistas || 0}
                        onValueChange={(e) => setEnvio({ ...envio, paradasPrevistas: e.value })}
                        placeholder={intl.formatMessage({ id: 'Número de paradas' })}
                        min={0}
                        max={999}
                        showButtons
                        buttonLayout="horizontal"
                        step={1}
                        inputStyle={{ textAlign: 'right' }}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvio;