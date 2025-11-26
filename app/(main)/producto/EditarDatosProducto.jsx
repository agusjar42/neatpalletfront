import React from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosProducto = ({ producto, setProducto, estadoGuardando, estoyDentroDeUnTab, clientes }) => {
    const intl = useIntl();

    const opcionesCliente = clientes ? clientes.map(cliente => ({
        label: cliente.nombre,
        value: cliente.id
    })) : [];

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del producto' })}>
            <div className="formgrid grid">
                {!estoyDentroDeUnTab && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                        <label htmlFor="clienteId"><b>{intl.formatMessage({ id: 'Cliente' })}*</b></label>
                        <Dropdown 
                            value={producto.clienteId || ""}
                            onChange={(e) => setProducto({ ...producto, clienteId: e.value })}
                            options={opcionesCliente}
                            placeholder={intl.formatMessage({ id: 'Seleccione un cliente' })}
                            className={`${(estadoGuardando && !producto.clienteId) ? "p-invalid" : ""}`}
                            showClear
                        />
                    </div>
                )}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText 
                        value={producto.nombre || ""}
                        placeholder={intl.formatMessage({ id: 'Nombre del producto' })}
                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                        className={`${(estadoGuardando && (producto.nombre === "" || producto.nombre === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} 
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosProducto;