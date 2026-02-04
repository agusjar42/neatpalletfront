import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosOperario = ({ operario, setOperario, estadoGuardando, estoyDentroDeUnTab, clientes }) => {
    const intl = useIntl();

    const opcionesCliente = clientes ? clientes.map(cliente => ({
        label: cliente.nombre,
        value: cliente.id
    })) : [];

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _operario = { ...operario };
        const esTrue = valor === true ? 'S' : 'N';
        _operario[`${nombreInputSwitch}`] = esTrue;
        setOperario(_operario);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del operario' })}>
            <div className="formgrid grid">
                {!estoyDentroDeUnTab && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="clienteId"><b>{intl.formatMessage({ id: 'Cliente' })}*</b></label>
                        <Dropdown 
                            value={operario.clienteId || ""}
                            onChange={(e) => setOperario({ ...operario, clienteId: e.value })}
                            options={opcionesCliente}
                            placeholder={intl.formatMessage({ id: 'Seleccione un cliente' })}
                            className={`${(estadoGuardando && !operario.clienteId) ? "p-invalid" : ""}`}
                            showClear
                        />
                    </div>
                )}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText 
                        value={operario.nombre || ""}
                        placeholder={intl.formatMessage({ id: 'Nombre del operario' })}
                        onChange={(e) => setOperario({ ...operario, nombre: e.target.value })}
                        className={`${(estadoGuardando && (operario.nombre === "" || operario.nombre === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="telefono">{intl.formatMessage({ id: 'Teléfono' })}</label>
                    <InputText 
                        value={operario.telefono || ""}
                        placeholder={intl.formatMessage({ id: 'Teléfono del operario' })}
                        onChange={(e) => setOperario({ ...operario, telefono: e.target.value })}
                        maxLength={50} 
                        style={{ textAlign: 'right' }} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Email' })}</label>
                    <InputText 
                        value={operario.email || ""}
                        placeholder={intl.formatMessage({ id: 'Email del operario' })}
                        onChange={(e) => setOperario({ ...operario, email: e.target.value })}
                        maxLength={250} 
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={operario.activoSN === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosOperario;