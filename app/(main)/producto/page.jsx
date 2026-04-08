"use client";
import {
  getProducto,
  getProductoCount,
  deleteProducto,
} from "@/app/api-endpoints/producto";
import EditarProductos from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";

const Producto = () => {
  const intl = useIntl();
  const columnas = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "number",
    },
    {
      campo: "empresaId",
      header: intl.formatMessage({ id: "Empresa" }),
      tipo: "number",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "pesoKgs",
      header: intl.formatMessage({ id: "Peso (Kg)" }),
      tipo: "number",
    },
    {
      campo: "activoSN",
      header: intl.formatMessage({ id: "Activo" }),
      tipo: "booleano",
    },
  ];

  return (
    <div>
      <Crud
        headerCrud={intl.formatMessage({ id: "Productos" })}
        getRegistros={getProducto}
        getRegistrosCount={getProductoCount}
        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
        controlador={"Productos"}
        editarComponente={<EditarProductos />}
        columnas={columnas}
        deleteRegistro={deleteProducto}
      />
    </div>
  );
};

export default Producto;
