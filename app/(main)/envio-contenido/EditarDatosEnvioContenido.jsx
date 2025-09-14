import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosEnvioContenido = ({ enviocontenido, setEnvioContenido, estadoGuardando, envios }) => {
    const intl = useIntl();

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.descripcion || 'Sin descripción'}`,
        value: envio.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el contenido' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Envío' })}*</b></label>
                    <Dropdown value={enviocontenido.envioId || ""}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (enviocontenido.envioId == null || enviocontenido.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="producto">{intl.formatMessage({ id: 'Producto' })}</label>
                    <InputText value={enviocontenido.producto}
                        placeholder={intl.formatMessage({ id: 'Nombre del producto' })}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, producto: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="referencia">{intl.formatMessage({ id: 'Referencia' })}</label>
                    <InputText value={enviocontenido.referencia}
                        placeholder={intl.formatMessage({ id: 'Referencia del producto' })}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, referencia: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="pesoKgs">{intl.formatMessage({ id: 'Peso (Kg)' })}</label>
                    <InputNumber value={enviocontenido.pesoKgs}
                        placeholder={intl.formatMessage({ id: 'Peso en kilogramos' })}
                        onValueChange={(e) => setEnvioContenido({ ...enviocontenido, pesoKgs: e.value })}
                        minFractionDigits={2} maxFractionDigits={2} min={0} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="pesoTotal">{intl.formatMessage({ id: 'Peso Total (Kg)' })}</label>
                    <InputNumber value={enviocontenido.pesoTotal}
                        placeholder={intl.formatMessage({ id: 'Peso total en kilogramos' })}
                        onValueChange={(e) => setEnvioContenido({ ...enviocontenido, pesoTotal: e.value })}
                        minFractionDigits={2} maxFractionDigits={2} min={0} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="medidas">{intl.formatMessage({ id: 'Medidas' })}</label>
                    <InputText value={enviocontenido.medidas}
                        placeholder={intl.formatMessage({ id: 'Medidas del producto' })}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, medidas: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-3">
                    <label htmlFor="fotoProducto">{intl.formatMessage({ id: 'Foto del producto' })}</label>
                    <InputText value={enviocontenido.fotoProducto}
                        placeholder={intl.formatMessage({ id: 'Ruta de la foto del producto' })}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, fotoProducto: e.target.value })}
                        maxLength={250} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="fotoPallet">{intl.formatMessage({ id: 'Foto del pallet' })}</label>
                    <InputText value={enviocontenido.fotoPallet}
                        placeholder={intl.formatMessage({ id: 'Ruta de la foto del pallet' })}
                        onChange={(e) => setEnvioContenido({ ...enviocontenido, fotoPallet: e.target.value })}
                        maxLength={250} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioContenido;