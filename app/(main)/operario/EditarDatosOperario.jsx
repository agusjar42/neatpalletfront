import React from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosOperario = ({ operario, setOperario, estadoGuardando, estoyDentroDeUnTab, clientes }) => {
    const intl = useIntl();

    const opcionesCliente = clientes ? clientes.map((cliente) => ({
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
        <div className="catalogo-edit-form-grid">
            {!estoyDentroDeUnTab && (
                <div className="catalogo-edit-field">
                    <label htmlFor="clienteId" className="catalogo-edit-label-required">
                        {intl.formatMessage({ id: 'Punto de entrega' })}*
                    </label>
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
            <div className="catalogo-edit-field">
                <label htmlFor="nombre" className="catalogo-edit-label-required">
                    {intl.formatMessage({ id: 'Nombre' })}*
                </label>
                <InputText
                    value={operario.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del operario' })}
                    onChange={(e) => setOperario({ ...operario, nombre: e.target.value })}
                    className={`${(estadoGuardando && (operario.nombre === "" || operario.nombre === undefined)) ? "p-invalid" : ""}`}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="telefono">{intl.formatMessage({ id: 'Telefono' })}</label>
                <InputText
                    value={operario.telefono || ""}
                    placeholder={intl.formatMessage({ id: 'Telefono del operario' })}
                    onChange={(e) => setOperario({ ...operario, telefono: e.target.value })}
                    maxLength={50}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="email">{intl.formatMessage({ id: 'Email' })}</label>
                <InputText
                    value={operario.email || ""}
                    placeholder={intl.formatMessage({ id: 'Email del operario' })}
                    onChange={(e) => setOperario({ ...operario, email: e.target.value })}
                    maxLength={250}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSN">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={operario.activoSN === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
                />
            </div>
        </div>
    );
};

export default EditarDatosOperario;
