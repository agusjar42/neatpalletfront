import React from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { useIntl } from "react-intl";

const EditarDatosProducto = ({ producto, setProducto, estadoGuardando }) => {
  const intl = useIntl();

  //
  //Actualizamos el valor del switch para persistir siempre S o N
  //
  const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
    const valor = (e.target && e.target.value) || "";
    let _producto = { ...producto };
    const esTrue = valor === true ? "S" : "N";
    _producto[`${nombreInputSwitch}`] = esTrue;
    setProducto(_producto);
  };

  return (
            <div className="catalogo-edit-form-grid">
                <div className="catalogo-edit-field">
                    <label htmlFor="orden" style={{ color: 'black' }}><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={producto.orden === '' || producto.orden === undefined ? null : producto.orden}
                        onChange={(e) => setProducto({ ...producto, orden: e.value })}
                        className={`${(estadoGuardando && (producto.orden === "" || producto.orden === null || producto.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        placeholder={intl.formatMessage({ id: "Orden del producto" })}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="sku">{intl.formatMessage({ id: 'SKU' })}</label>
                    <InputText value={producto.sku || ""}
                        placeholder={intl.formatMessage({ id: "SKU del producto" })}
                        onChange={(e) => setProducto({ ...producto, sku: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="nombre" style={{ color: 'black' }}><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={producto.nombre || ""}
                        placeholder={intl.formatMessage({ id: "Nombre del producto" })}
                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                        className={`${(estadoGuardando && (producto.nombre === "" || producto.nombre === undefined)) ? "p-invalid" : ""}`}
                        maxLength={50} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="familia">{intl.formatMessage({ id: 'Familia' })}</label>
                    <InputText value={producto.familia || ""}
                        placeholder={intl.formatMessage({ id: "Familia del producto" })}
                        onChange={(e) => setProducto({ ...producto, familia: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="rangoTemp">{intl.formatMessage({ id: 'Rango temp.' })}</label>
                    <InputText value={producto.rangoTemp || ""}
                        placeholder={intl.formatMessage({ id: "Rango de temperatura" })}
                        onChange={(e) => setProducto({ ...producto, rangoTemp: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="vidaUtil">{intl.formatMessage({ id: 'Vida util' })}</label>
                    <InputText value={producto.vidaUtil || ""}
                        placeholder={intl.formatMessage({ id: "Vida util del producto" })}
                        onChange={(e) => setProducto({ ...producto, vidaUtil: e.target.value })}
                        maxLength={100} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="pesoKgs">{intl.formatMessage({ id: 'Peso (Kg)' })}</label>
                    <InputNumber value={producto.pesoKgs}
                        onChange={(e) => setProducto({ ...producto, pesoKgs: e.value })}
                        className="w-full"
                        mode="decimal"
                        minFractionDigits={0}
                        maxFractionDigits={2}
                        min={0}
                        placeholder={intl.formatMessage({ id: "Peso del producto" })}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="catalogo-edit-field">
                    <label htmlFor="activoSN">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={producto.activoSN !== 'N'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSN")}
                    />
                </div>
            </div>
  );
};

export default EditarDatosProducto;
