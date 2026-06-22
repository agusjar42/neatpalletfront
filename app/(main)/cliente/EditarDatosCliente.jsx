import React from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { useIntl } from "react-intl";

const EditarDatosCliente = ({ cliente, setCliente, estadoGuardando }) => {
  const intl = useIntl();

  //
  //Convertimos el switch al formato S/N que usa el backend
  //
  const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
    const valor = (e.target && e.target.value) || "";
    const clienteActualizado = { ...cliente };
    clienteActualizado[nombreInputSwitch] = valor === true ? "S" : "N";
    setCliente(clienteActualizado);
  };

  return (
    <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
      <div className="catalogo-edit-field">
        <label htmlFor="orden">{intl.formatMessage({ id: "Orden" })}</label>
        <InputNumber
          value={cliente.orden === "" || cliente.orden === undefined ? null : cliente.orden}
          onValueChange={(e) => setCliente({ ...cliente, orden: e.value })}
          mode="decimal"
          useGrouping={false}
          min={0}
          inputStyle={{ textAlign: "right" }}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="codigo">{intl.formatMessage({ id: "Codigo" })}</label>
        <InputText
          value={cliente.codigo || ""}
          placeholder={intl.formatMessage({ id: "Codigo del cliente" })}
          onChange={(e) => setCliente({ ...cliente, codigo: e.target.value })}
          maxLength={50}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="nombre">{intl.formatMessage({ id: "Nombre" })}</label>
        <InputText
          value={cliente.nombre || ""}
          placeholder={intl.formatMessage({ id: "Nombre del cliente" })}
          onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
          className={`${estadoGuardando && !cliente.nombre ? "p-invalid" : ""}`}
          maxLength={50}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="horario">{intl.formatMessage({ id: "Horario" })}</label>
        <InputText
          value={cliente.horario || ""}
          placeholder={intl.formatMessage({ id: "Horario del cliente" })}
          onChange={(e) => setCliente({ ...cliente, horario: e.target.value })}
          maxLength={100}
        />
      </div>

      <div className="catalogo-edit-field" style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="direccion">{intl.formatMessage({ id: "Direccion" })}</label>
        <InputText
          value={cliente.direccion || ""}
          placeholder={intl.formatMessage({ id: "Direccion del cliente" })}
          onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
          maxLength={500}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="telefono">{intl.formatMessage({ id: "Telefono" })}</label>
        <InputText
          value={cliente.telefono || ""}
          placeholder={intl.formatMessage({ id: "Telefono del cliente" })}
          onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
          maxLength={50}
        />
      </div>
      <div className="catalogo-edit-field">
        <label htmlFor="mail">{intl.formatMessage({ id: "Email" })}</label>
        <InputText
          value={cliente.mail || ""}
          placeholder={intl.formatMessage({ id: "Email del cliente" })}
          onChange={(e) => setCliente({ ...cliente, mail: e.target.value })}
          maxLength={50}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="activoSN">{intl.formatMessage({ id: "Activo" })}</label>
        <InputSwitch
          checked={cliente.activoSN === "S"}
          onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
        />
      </div>
    </div>
  );
};

export default EditarDatosCliente;
