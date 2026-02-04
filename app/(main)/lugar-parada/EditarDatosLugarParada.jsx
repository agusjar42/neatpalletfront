import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosLugarParada = ({ lugarParada, setLugarParada, estadoGuardando, estoyDentroDeUnTab, clientes }) => {
    const intl = useIntl();

    const opcionesCliente = clientes ? clientes.map(cliente => ({
        label: cliente.nombre,
        value: cliente.id
    })) : [];

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _lugarParada = { ...lugarParada };
        const esTrue = valor === true ? 'S' : 'N';
        _lugarParada[`${nombreInputSwitch}`] = esTrue;
        setLugarParada(_lugarParada);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del lugar de parada' })}>
            <div className="formgrid grid">
                {!estoyDentroDeUnTab && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="clienteId"><b>{intl.formatMessage({ id: 'Cliente' })}*</b></label>
                        <Dropdown 
                            value={lugarParada.clienteId || ""}
                            onChange={(e) => setLugarParada({ ...lugarParada, clienteId: e.value })}
                            options={opcionesCliente}
                            placeholder={intl.formatMessage({ id: 'Seleccione un cliente' })}
                            className={`${(estadoGuardando && !lugarParada.clienteId) ? "p-invalid" : ""}`}
                            showClear
                        />
                    </div>
                )}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText 
                        value={lugarParada.nombre || ""}
                        placeholder={intl.formatMessage({ id: 'Nombre del lugar de parada' })}
                        onChange={(e) => setLugarParada({ ...lugarParada, nombre: e.target.value })}
                        className={`${(estadoGuardando && (lugarParada.nombre === "" || lugarParada.nombre === undefined)) ? "p-invalid" : ""}`}
                        maxLength={250} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="direccionGps">{intl.formatMessage({ id: 'Dirección GPS' })}</label>
                    <InputText 
                        value={lugarParada.direccionGps || ""}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS' })}
                        onChange={(e) => setLugarParada({ ...lugarParada, direccionGps: e.target.value })}
                        maxLength={250} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label htmlFor="direccion">{intl.formatMessage({ id: 'Dirección' })}</label>
                    <InputTextarea 
                        value={lugarParada.direccion || ""}
                        placeholder={intl.formatMessage({ id: 'Dirección completa del lugar de parada' })}
                        onChange={(e) => setLugarParada({ ...lugarParada, direccion: e.target.value })}
                        rows={3}
                        maxLength={500} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={lugarParada.activoSN === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosLugarParada;