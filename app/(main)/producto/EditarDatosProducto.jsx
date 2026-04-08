import React from "react";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { useIntl } from "react-intl";

const EditarDatosProducto = ({ producto, setProducto, estadoGuardando }) => {
  const intl = useIntl();

  const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
    const valor = (e.target && e.target.value) || "";
    let _producto = { ...producto };
    const esTrue = valor === true ? "S" : "N";
    _producto[`${nombreInputSwitch}`] = esTrue;
    setProducto(_producto);
  };

  return (
    <Fieldset legend={intl.formatMessage({ id: "Datos del producto" })}>
      <div className="formgrid grid">
        <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
          <label htmlFor="orden">{intl.formatMessage({ id: "Orden" })}</label>
          <InputNumber
            value={producto.orden}
            onValueChange={(e) => setProducto({ ...producto, orden: e.value })}
            mode="decimal"
            useGrouping={false}
            min={0}
            max={99999}
            placeholder={intl.formatMessage({ id: "Orden del producto" })}
          />
        </div>
        <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
          <label htmlFor="nombre">
            <b>{intl.formatMessage({ id: "Nombre" })}*</b>
          </label>
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
        <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
          <label htmlFor="pesoKgs">
            {intl.formatMessage({ id: "Peso (Kg)" })}
          </label>
          <InputNumber
            value={producto.pesoKgs}
            onValueChange={(e) =>
              setProducto({ ...producto, pesoKgs: e.value })
            }
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={3}
            min={0}
            placeholder={intl.formatMessage({ id: "Peso del producto" })}
          />
        </div>
        <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
          <label htmlFor="activoSN" className="font-bold block">
            {intl.formatMessage({ id: "Activo" })}
          </label>
          <InputSwitch
            checked={producto.activoSN === "S"}
            onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
          />
        </div>
      </div>
    </Fieldset>
  );
};

export default EditarDatosProducto;
