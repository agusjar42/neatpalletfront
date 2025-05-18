import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';
const EditarDatosRol = ({ rol, setRol, listaEmpresas, empresaSeleccionada, setEmpresaSeleccionada, estadoGuardando }) => {
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
                    <label htmlFor="empresa">{intl.formatMessage({ id: 'Empresa' })}</label>
                    <Dropdown value={empresaSeleccionada || ""}
                        onChange={(e) => setEmpresaSeleccionada(e.value)}
                        options={listaEmpresas.map(empresa => empresa.nombre)}
                        className={`p-column-filter ${(estadoGuardando && (empresaSeleccionada == null || empresaSeleccionada === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona una empresa' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Nombre' })}</label>
                    <InputText value={rol.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del rol' })}
                        onChange={(e) => setRol({ ...rol, nombre: e.target.value })}
                        className={`${(estadoGuardando && rol.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
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