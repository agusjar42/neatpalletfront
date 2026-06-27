import React from "react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl';

const EditarDatosLugarParada = ({ lugarParada, setLugarParada, estadoGuardando, estoyDentroDeUnTab, clientes }) => {
    const intl = useIntl();

    const opcionesCliente = clientes ? clientes.map((cliente) => ({
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
        <div className="catalogo-edit-form-grid">
            {!estoyDentroDeUnTab && (
                <div className="catalogo-edit-field">
                    <label htmlFor="clienteId" className="catalogo-edit-label-required">
                        {intl.formatMessage({ id: 'Punto de entrega' })}*
                    </label>
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
            <div className="catalogo-edit-field">
                <label htmlFor="nombre" className="catalogo-edit-label-required">
                    {intl.formatMessage({ id: 'Nombre' })}*
                </label>
                <InputText
                    value={lugarParada.nombre || ""}
                    placeholder={intl.formatMessage({ id: 'Nombre del lugar de parada' })}
                    onChange={(e) => setLugarParada({ ...lugarParada, nombre: e.target.value })}
                    className={`${(estadoGuardando && (lugarParada.nombre === "" || lugarParada.nombre === undefined)) ? "p-invalid" : ""}`}
                    maxLength={250}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="direccionGps">{intl.formatMessage({ id: 'Direccion GPS' })}</label>
                <InputText
                    value={lugarParada.direccionGps || ""}
                    placeholder={intl.formatMessage({ id: 'Coordenadas GPS' })}
                    onChange={(e) => setLugarParada({ ...lugarParada, direccionGps: e.target.value })}
                    maxLength={250}
                />
            </div>
            <div className="catalogo-edit-field catalogo-edit-field-full">
                <label htmlFor="direccion">{intl.formatMessage({ id: 'Direccion' })}</label>
                <InputTextarea
                    value={lugarParada.direccion || ""}
                    placeholder={intl.formatMessage({ id: 'Direccion completa del lugar de parada' })}
                    onChange={(e) => setLugarParada({ ...lugarParada, direccion: e.target.value })}
                    rows={3}
                    maxLength={500}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSN">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={lugarParada.activoSN === 'S'}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
                />
            </div>
        </div>
    );
};

export default EditarDatosLugarParada;
