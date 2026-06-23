import React from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useIntl } from "react-intl";

const EditarDatosProducto = ({ producto, setProducto, estadoGuardando }) => {
  const intl = useIntl();
  const opcionesEstado = [
    { label: "Activo", value: "Activo" },
    { label: "Pauseado", value: "Pauseado" },
    { label: "Descatalogado", value: "Descatalogado" },
  ];

  return (
    <div className="catalogo-edit-form-grid">
      <div className="catalogo-edit-field">
        <label htmlFor="orden">{intl.formatMessage({ id: "Orden" })}</label>
        <InputNumber
          value={producto.orden === '' || producto.orden === undefined ? null : producto.orden}
          onValueChange={(e) => setProducto({ ...producto, orden: e.value })}
          className="w-full"
          mode="decimal"
          useGrouping={false}
          min={0}
          placeholder={intl.formatMessage({ id: "Orden del producto" })}
          inputStyle={{ textAlign: "right" }}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="sku">{intl.formatMessage({ id: "SKU" })}</label>
        <InputText
          value={producto.sku || ""}
          placeholder={intl.formatMessage({ id: "SKU del producto" })}
          onChange={(e) =>
            setProducto({ ...producto, sku: e.target.value })
          }
          maxLength={50}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="nombre">{intl.formatMessage({ id: "Nombre" })}</label>
        <InputText
          value={producto.nombre || ""}
          placeholder={intl.formatMessage({ id: "Nombre del producto" })}
          onChange={(e) =>
            setProducto({ ...producto, nombre: e.target.value })
          }
          className={`${
            estadoGuardando &&
            (producto.nombre === "" || producto.nombre === undefined)
              ? "p-invalid"
              : ""
          }`}
          maxLength={50}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="familia">{intl.formatMessage({ id: "Familia" })}</label>
        <InputText
          value={producto.familia || ""}
          placeholder={intl.formatMessage({ id: "Familia del producto" })}
          onChange={(e) =>
            setProducto({ ...producto, familia: e.target.value })
          }
          maxLength={100}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="rangoTemp">{intl.formatMessage({ id: "Rango temp." })}</label>
        <InputText
          value={producto.rangoTemp || ""}
          placeholder={intl.formatMessage({ id: "Rango de temperatura" })}
          onChange={(e) =>
            setProducto({ ...producto, rangoTemp: e.target.value })
          }
          maxLength={100}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="vidaUtil">{intl.formatMessage({ id: "Vida util" })}</label>
        <InputText
          value={producto.vidaUtil || ""}
          placeholder={intl.formatMessage({ id: "Vida util del producto" })}
          onChange={(e) =>
            setProducto({ ...producto, vidaUtil: e.target.value })
          }
          maxLength={100}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="pesoKgs">{intl.formatMessage({ id: "Peso (Kg)" })}</label>
        <InputNumber
          value={producto.pesoKgs}
          onValueChange={(e) =>
            setProducto({ ...producto, pesoKgs: e.value })
          }
          className="w-full"
          mode="decimal"
          minFractionDigits={0}
          maxFractionDigits={3}
          min={0}
          placeholder={intl.formatMessage({ id: "Peso del producto" })}
          inputStyle={{ textAlign: "right" }}
        />
      </div>

      <div className="catalogo-edit-field">
        <label htmlFor="estado">{intl.formatMessage({ id: "Estado" })}</label>
        <Dropdown
          value={producto.estado || "Activo"}
          options={opcionesEstado}
          onChange={(e) => setProducto({ ...producto, estado: e.value })}
          placeholder={intl.formatMessage({ id: "Selecciona una opcion" })}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default EditarDatosProducto;
