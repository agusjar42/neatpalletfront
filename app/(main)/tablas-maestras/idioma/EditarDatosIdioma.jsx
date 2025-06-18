import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { AutoComplete } from "primereact/autocomplete";
import { useIntl } from 'react-intl';
const EditarDatosIdioma = ({ idioma, setIdioma, estadoGuardando, isoIdiomas, setIsoSeleccionado, isoSeleccionado }) => {
    const intl = useIntl();
    const [filtradoIso, setFiltradoIso] = useState([]);
    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _idioma = { ...idioma };
        const esTrue = valor === true ? 'S' : 'N';
        _idioma[`${nombreInputSwitch}`] = esTrue;
        setIdioma(_idioma);
    };

    const busquedaIsoIdiomas = (event) => {
        let _isoIdiomasFiltrados;
        if (!event.query.trim().length) {
            _isoIdiomasFiltrados = [...isoIdiomas];
        } else {
            _isoIdiomasFiltrados = isoIdiomas.filter(item =>
                item.idioma.toLowerCase().includes(event.query.toLowerCase())
            );
        }
        setFiltradoIso(_isoIdiomasFiltrados);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el idioma' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaTransporteNombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={idioma.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre del idioma' })}
                        onChange={(e) => setIdioma({ ...idioma, nombre: e.target.value })}
                        className={`${(estadoGuardando && idioma.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50}/>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaTransporteNombre">{intl.formatMessage({ id: 'Iso' })}</label>
                    <AutoComplete
                            value={isoSeleccionado}
                            suggestions={filtradoIso}
                            dropdown
                            field="idioma"
                            completeMethod={busquedaIsoIdiomas}
                            onChange={(e) => setIsoSeleccionado(e.value)}
                            //className={`${(estadoGuardando && idioma.iso === "") ? "p-invalid" : ""}`}
                            style={{ width: '350px' }} // Ajusta este valor según sea necesario
                        />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={idioma.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosIdioma;