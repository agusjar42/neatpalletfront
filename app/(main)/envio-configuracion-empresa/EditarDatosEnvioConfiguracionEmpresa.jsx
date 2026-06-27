import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosEnvioConfiguracionEmpresa = ({
    envioConfiguracionEmpresa,
    setEnvioConfiguracionEmpresa,
    estadoGuardando,
    mostrarCampoActivoSn = false,
}) => {
    const intl = useIntl();
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        const esTrue = valor === true ? 'S' : 'N';
        setEnvioConfiguracionEmpresa({
            ...envioConfiguracionEmpresa,
            [nombreInputSwitch]: esTrue,
        });
    };

    return (
            <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
                <div className="catalogo-edit-field">
                    <label htmlFor="orden" style={{ color: 'black' }}>
                        <b>{intl.formatMessage({ id: 'Orden' })}*</b>
                    </label>
                    <InputNumber value={envioConfiguracionEmpresa.orden === '' || envioConfiguracionEmpresa.orden === undefined ? null : envioConfiguracionEmpresa.orden}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, orden: e.value })}
                        className={`${(estadoGuardando && (envioConfiguracionEmpresa.orden === "" || envioConfiguracionEmpresa.orden === null || envioConfiguracionEmpresa.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="nombre" style={{ color: 'black' }}>
                        <b>{intl.formatMessage({ id: 'Nombre' })}*</b>
                    </label>
                    <InputText value={envioConfiguracionEmpresa.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la configuracion' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, nombre: e.target.value })}
                        className={`${(estadoGuardando && envioConfiguracionEmpresa.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <InputText value={envioConfiguracionEmpresa.valor}
                        placeholder={intl.formatMessage({ id: 'Valor de la configuracion' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, valor: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="unidadMedida">{intl.formatMessage({ id: 'Unidad de medida' })}</label>
                    <InputText value={envioConfiguracionEmpresa.unidadMedida}
                        placeholder={intl.formatMessage({ id: 'Unidad de medida' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, unidadMedida: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field catalogo-edit-field-full">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Descripcion' })}</label>
                    <InputTextarea value={envioConfiguracionEmpresa.descripcion || ""}
                        placeholder={intl.formatMessage({ id: 'Descripcion de la configuracion' })}
                        onChange={(e) => setEnvioConfiguracionEmpresa({ ...envioConfiguracionEmpresa, descripcion: e.target.value })}
                        rows={4}
                        autoResize
                        maxLength={255} />
                </div>
                {mostrarCampoActivoSn && (
                    <div className="catalogo-edit-field">
                        <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                        <InputSwitch
                            checked={(envioConfiguracionEmpresa.activoSn || 'S') === 'S'}
                            onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                        />
                    </div>
                )}
            </div>
    );
};

export default EditarDatosEnvioConfiguracionEmpresa;
