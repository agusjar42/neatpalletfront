import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';
const EditarDatosTipoArchivo = ({ tipoArchivo, setTipoArchivo, listaTipoArchivos, listaEmpresas, empresaSeleccionada, setEmpresaSeleccionada, listaSecciones, seccionSeleccionada, setSeccionSeleccionada, estadoGuardando }) => {
    const intl = useIntl();
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _tipoArchivo = { ...tipoArchivo };
        const esTrue = valor === true ? 'S' : 'N';
        _tipoArchivo[`${nombreInputSwitch}`] = esTrue;
        setTipoArchivo(_tipoArchivo);
    };

    const manejarCambioInputNumber = (e, nombreInput) => {
        const valor = e.value || 0;
        let _tipoArchivo = { ...tipoArchivo };
        _tipoArchivo[`${nombreInput}`] = valor;
        setTipoArchivo(_tipoArchivo);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el tipo de archivo' })}>
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
                    <label htmlFor="empresa">{intl.formatMessage({ id: 'Seccion' })}</label>
                    <Dropdown value={seccionSeleccionada || ""}
                        onChange={(e) => setSeccionSeleccionada(e.value)}
                        options={listaSecciones.map(seccion => seccion.nombre)}
                        className={`p-column-filter ${(estadoGuardando && (seccionSeleccionada == null || seccionSeleccionada === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona una seccion' })}/>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Nombre' })}</label>
                    <InputText value={tipoArchivo.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del tipo de archivo' })}
                        onChange={(e) => setTipoArchivo({ ...tipoArchivo, nombre: e.target.value })}
                        className={`${(estadoGuardando && tipoArchivo.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre">{intl.formatMessage({ id: 'Orden' })}</label>
                        <InputNumber
                            id="orden"
                            value={tipoArchivo.orden}
                            onChange={(e) => manejarCambioInputNumber(e, "orden")}
                            required
                            autoFocus
                            useGrouping={false}
                            className={`${(estadoGuardando && tipoArchivo.orden === "") ? "p-invalid" : ""}`}
                        />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipo">{intl.formatMessage({ id: 'Tipo' })}</label>
                    <Dropdown value={tipoArchivo.tipo}
                        onChange={(e) => setTipoArchivo({ ...tipoArchivo, tipo: e.target.value })}
                        options={listaTipoArchivos.map(tipo => tipo.nombre)}
                        className={`p-column-filter ${(estadoGuardando && (tipoArchivo.tipo === null || tipoArchivo.tipo === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un tipo' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Multiple' })}</label>
                    <InputSwitch
                        checked={tipoArchivo.multiple === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "multiple")}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={tipoArchivo.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>

        </Fieldset>
    );
};

export default EditarDatosTipoArchivo;