import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { useIntl } from 'react-intl';

const EditarDatosEnvio = ({ envio, setEnvio, estadoGuardando, manejarCambioInputSwitch, tiposTransporte, tiposCarroceria }) => {
    const intl = useIntl();

    const opcionesTipoTransporte = tiposTransporte.map(tipo => ({
        label: tipo.nombre,
        value: tipo.id
    }));

    const opcionesTipoCarroceria = tiposCarroceria.map(tipo => ({
        label: tipo.nombre,
        value: tipo.id
    }));

    const estadosEnvio = [
        { label: intl.formatMessage({ id: 'Pendiente' }), value: 'PENDIENTE' },
        { label: intl.formatMessage({ id: 'En Transito' }), value: 'EN_TRANSITO' },
        { label: intl.formatMessage({ id: 'Entregado' }), value: 'ENTREGADO' },
        { label: intl.formatMessage({ id: 'Cancelado' }), value: 'CANCELADO' }
    ];

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="descripcion"><b>{intl.formatMessage({ id: 'Descripción' })}*</b></label>
                    <InputText value={envio.descripcion}
                        placeholder={intl.formatMessage({ id: 'Descripción del envío' })}
                        onChange={(e) => setEnvio({ ...envio, descripcion: e.target.value })}
                        className={`${(estadoGuardando && envio.descripcion === "") ? "p-invalid" : ""}`}
                        maxLength={200} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="numeroSeguimiento">{intl.formatMessage({ id: 'Número de seguimiento' })}</label>
                    <InputText value={envio.numeroSeguimiento}
                        placeholder={intl.formatMessage({ id: 'Número de seguimiento' })}
                        onChange={(e) => setEnvio({ ...envio, numeroSeguimiento: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="estado">{intl.formatMessage({ id: 'Estado' })}</label>
                    <Dropdown value={envio.estado || ""}
                        onChange={(e) => setEnvio({ ...envio, estado: e.value })}
                        options={estadosEnvio}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un estado' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaInicio">{intl.formatMessage({ id: 'Fecha de inicio' })}</label>
                    <Calendar value={envio.fechaInicio ? new Date(envio.fechaInicio) : null}
                        onChange={(e) => setEnvio({ ...envio, fechaInicio: e.value })}
                        placeholder={intl.formatMessage({ id: 'Fecha de inicio del envío' })}
                        showIcon
                        dateFormat="dd/mm/yy" />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaFinEstimada">{intl.formatMessage({ id: 'Fecha fin estimada' })}</label>
                    <Calendar value={envio.fechaFinEstimada ? new Date(envio.fechaFinEstimada) : null}
                        onChange={(e) => setEnvio({ ...envio, fechaFinEstimada: e.value })}
                        placeholder={intl.formatMessage({ id: 'Fecha estimada de finalización' })}
                        showIcon
                        dateFormat="dd/mm/yy" />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fechaFinReal">{intl.formatMessage({ id: 'Fecha fin real' })}</label>
                    <Calendar value={envio.fechaFinReal ? new Date(envio.fechaFinReal) : null}
                        onChange={(e) => setEnvio({ ...envio, fechaFinReal: e.value })}
                        placeholder={intl.formatMessage({ id: 'Fecha real de finalización' })}
                        showIcon
                        dateFormat="dd/mm/yy" />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoTransporteId">{intl.formatMessage({ id: 'Tipo de transporte' })}</label>
                    <Dropdown value={envio.tipoTransporteId || ""}
                        onChange={(e) => setEnvio({ ...envio, tipoTransporteId: e.value })}
                        options={opcionesTipoTransporte}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona tipo de transporte' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoCarroceriaId">{intl.formatMessage({ id: 'Tipo de carrocería' })}</label>
                    <Dropdown value={envio.tipoCarroceriaId || ""}
                        onChange={(e) => setEnvio({ ...envio, tipoCarroceriaId: e.value })}
                        options={opcionesTipoCarroceria}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona tipo de carrocería' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="origen">{intl.formatMessage({ id: 'Origen' })}</label>
                    <InputText value={envio.origen}
                        placeholder={intl.formatMessage({ id: 'Ciudad o dirección de origen' })}
                        onChange={(e) => setEnvio({ ...envio, origen: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="destino">{intl.formatMessage({ id: 'Destino' })}</label>
                    <InputText value={envio.destino}
                        placeholder={intl.formatMessage({ id: 'Ciudad o dirección de destino' })}
                        onChange={(e) => setEnvio({ ...envio, destino: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="conductor">{intl.formatMessage({ id: 'Conductor' })}</label>
                    <InputText value={envio.conductor}
                        placeholder={intl.formatMessage({ id: 'Nombre del conductor' })}
                        onChange={(e) => setEnvio({ ...envio, conductor: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="vehiculo">{intl.formatMessage({ id: 'Vehículo' })}</label>
                    <InputText value={envio.vehiculo}
                        placeholder={intl.formatMessage({ id: 'Matrícula o identificación del vehículo' })}
                        onChange={(e) => setEnvio({ ...envio, vehiculo: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSn" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={envio.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label htmlFor="observaciones">{intl.formatMessage({ id: 'Observaciones' })}</label>
                    <InputTextarea value={envio.observaciones}
                        placeholder={intl.formatMessage({ id: 'Observaciones adicionales del envío' })}
                        onChange={(e) => setEnvio({ ...envio, observaciones: e.target.value })}
                        rows={4} cols={30} maxLength={500} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvio;