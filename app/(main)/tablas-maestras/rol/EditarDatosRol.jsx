import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
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
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el rol' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={rol.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del rol' })}
                        onChange={(e) => setRol({ ...rol, nombre: e.target.value })}
                        className={`${(estadoGuardando && rol.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50} />
                </div>
                {/* <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Dashboard' })}</label>
                    <InputText value={rol.dashboardUrl}
                        placeholder={intl.formatMessage({ id: 'Url de la pantalla del dashboard' })}
                        onChange={(e) => setRol({ ...rol, dashboardUrl: e.target.value })}
                        //className={`${(estadoGuardando && rol.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={150}/>
                </div> */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="provincia">{intl.formatMessage({ id: 'Pantalla de inicio' })}</label>
                    <Dropdown value={pantallaDashboardSeleccionada || ""}
                        onChange={(e) => setPantallaDashboardSeleccionada(e.value)}
                        options={pantallasDashboard ? pantallasDashboard.map(pantalla => pantalla.nombre) : []}
                        className={`p-column-filter ${(estadoGuardando && (pantallaDashboardSeleccionada == null || pantallaDashboardSeleccionada === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona una pantalla de inicio' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="muestraEmpresa" className="font-bold block">{intl.formatMessage({ id: 'Muestra el nombre de la empresa' })}</label>
                    <InputSwitch
                        checked={rol.muestraEmpresa === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "muestraEmpresa")}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={rol.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>

        </Fieldset>
    );
};

export default EditarDatosRol;