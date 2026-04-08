"use client";
import {
  getProducto,
  getProductoCount,
  deleteProducto,
  postProducto,
  patchProducto,
} from "@/app/api-endpoints/producto";
import EditarProductos from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";
import {
  createResult,
  getUsuarioSesionEmpresaId,
  getUsuarioSesionId,
  getValueFromRow,
  parseActivoSN,
  parseNumberOrNull,
} from "@/app/utility/csv-import-utils";

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

  const procesarImportacionCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();
    const empresaSesionId = getUsuarioSesionEmpresaId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!rowId && !nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const empresaId =
          parseNumberOrNull(getValueFromRow(row, ["empresaId", "empresa"])) ??
          empresaSesionId;
        if (!empresaId) {
          throw new Error(`Fila ${i + 2}: No se pudo resolver empresaId`);
        }

        const payload = {
          empresaId,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          pesoKgs: parseNumberOrNull(getValueFromRow(row, ["pesoKgs", "peso", "pesokg"])),
          activoSN: parseActivoSN(getValueFromRow(row, ["activoSN", "activoSn", "activo"]), "S"),
        };

        if (rowId) {
          payload.usuModificacion = usuarioSesionId;
          await patchProducto(rowId, payload);
          result.updated++;
        } else {
          payload.usuCreacion = usuarioSesionId;
          await postProducto(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  return (
    <div>
      <Crud
        headerCrud={intl.formatMessage({ id: "Productos" })}
        getRegistros={getProducto}
        getRegistrosCount={getProductoCount}
        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV", "importarCSV"]}
        controlador={"Productos"}
        editarComponente={<EditarProductos />}
        columnas={columnas}
        deleteRegistro={deleteProducto}
        procesarImportacionCSV={procesarImportacionCSV}
      />
    </div>
  );
};

export default Producto;
