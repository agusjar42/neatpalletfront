import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";

const EditarDatosTipoCarroceria = ({ tipoCarroceria, setTipoCarroceria, estadoGuardando }) => {
    const intl = useIntl();
    
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _tipoCarroceria = { ...tipoCarroceria };
        const esTrue = valor === true ? 'S' : 'N';
        _tipoCarroceria[`${nombreInputSwitch}`] = esTrue;
        setTipoCarroceria(_tipoCarroceria);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el tipo de carrocería' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={tipoCarroceria.orden}
                        placeholder={intl.formatMessage({ id: 'Orden del tipo de carrocería' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, orden: e.value })}
                        className={`${(estadoGuardando && (tipoCarroceria.orden === "" || tipoCarroceria.orden === null || tipoCarroceria.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={tipoCarroceria.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de carrocería' })}
                        onChange={(e) => setTipoCarroceria({ ...tipoCarroceria, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoCarroceria.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoCarroceria.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosTipoCarroceria;