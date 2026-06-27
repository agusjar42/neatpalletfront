import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosRol = ({ rol, setRol, estadoGuardando, pantallasDashboard, pantallaDashboardSeleccionada, setPantallaDashboardSeleccionada }) => {
    const intl = useIntl();

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _rol = { ...rol };
        const esTrue = valor === true ? 'S' : 'N';
        _rol[`${nombreInputSwitch}`] = esTrue;
        setRol(_rol);
    };

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Orden' })}*</b>
                </label>
                <InputNumber
                    value={rol.orden === '' || rol.orden === undefined ? null : rol.orden}
                    onChange={(e) => setRol({ ...rol, orden: e.value })}
                    className={`${(estadoGuardando && (rol.orden === "" || rol.orden === null || rol.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: 'right' }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="nombre" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Nombre' })}*</b>
                </label>
                <InputText
                    value={rol.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del rol' })}
                    onChange={(e) => setRol({ ...rol, nombre: e.target.value })}
                    className={`${(estadoGuardando && (rol.nombre || "") === "") ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="pantallaInicio" style={{ color: "black" }}>
                    <b>{intl.formatMessage({ id: 'Pantalla de inicio' })}*</b>
                </label>
                <Dropdown
                    value={pantallaDashboardSeleccionada || ""}
                    onChange={(e) => setPantallaDashboardSeleccionada(e.value)}
                    options={pantallasDashboard ? pantallasDashboard.map(pantalla => pantalla.nombre) : []}
                    className={`p-column-filter ${(estadoGuardando && (pantallaDashboardSeleccionada == null || pantallaDashboardSeleccionada === "")) ? "p-invalid" : ""}`}
                    showClear
                    placeholder={intl.formatMessage({ id: 'Selecciona una pantalla de inicio' })}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="muestraEmpresa">{intl.formatMessage({ id: 'Muestra el nombre de la empresa' })}</label>
                <InputSwitch
                    checked={rol.muestraEmpresa === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "muestraEmpresa")}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={rol.activoSn === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                />
            </div>
        </div>
    );
};

export default EditarDatosRol;
