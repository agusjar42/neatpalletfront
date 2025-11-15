import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';
import { InputNumber } from "primereact/inputnumber";

const EditarDatosTipoSensor = ({ tipoSensor, setTipoSensor, estadoGuardando, manejarCambioInputSwitch }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el tipo de sensor' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={tipoSensor.orden}
                        placeholder={intl.formatMessage({ id: 'Orden del tipo de sensor' })}
                        onChange={(e) => setTipoSensor({ ...tipoSensor, orden: e.value })}
                        className={`${(estadoGuardando && (tipoSensor.orden === "" || tipoSensor.orden === null || tipoSensor.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999} 
                        inputStyle={{ textAlign: 'right' }}/>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={tipoSensor.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de sensor' })}
                        onChange={(e) => setTipoSensor({ ...tipoSensor, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoSensor.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSn" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoSensor.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosTipoSensor;