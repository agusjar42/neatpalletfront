import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useIntl } from 'react-intl';

const EditarDatosEnvioConfiguracionEmpresa = ({ envioConfiguracionEmpresa, setEnvioConfiguracionEmpresa, estadoGuardando }) => {
    const intl = useIntl();

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la configuración de empresa' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={envioConfiguracionEmpresa.orden}
                        placeholder={intl.formatMessage({ id: 'Orden de la configuración' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, orden: e.value })}
                        className={`${(estadoGuardando && (envioConfiguracionEmpresa.orden === "" || envioConfiguracionEmpresa.orden === null || envioConfiguracionEmpresa.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={envioConfiguracionEmpresa.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la configuración' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, nombre: e.target.value })}
                        className={`${(estadoGuardando && envioConfiguracionEmpresa.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={100} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={envioConfiguracionEmpresa.valor}
                        placeholder={intl.formatMessage({ id: 'Valor de la configuración' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, valor: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="unidadMedida">{intl.formatMessage({ id: 'Unidad de medida' })}</label>
                    <InputText value={envioConfiguracionEmpresa.unidadMedida}
                        placeholder={intl.formatMessage({ id: 'Unidad de medida' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, unidadMedida: e.target.value })}
                        maxLength={50} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioConfiguracionEmpresa;