"use client";
import {
  getProducto,
  getProductoCount,
  deleteProducto,
  postProducto,
  patchProducto,
} from "@/app/api-endpoints/empresa-producto";
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
  const empresaIdSesion = getUsuarioSesionEmpresaId();

  //
  //Definimos anchos minimos para que las columnas mantengan una estructura estable
  //
  const columnas = [
    {
      campo: "orden",
      header: "ORDEN",
      tipo: "number",
      headerStyle: { minWidth: "5.5rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "sku",
      header: "SKU",
      tipo: "string",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "nombre",
      header: "PRODUCTO",
      tipo: "string",
      headerStyle: { minWidth: "14rem" },
    },
    {
      campo: "familia",
      header: "FAMILIA",
      tipo: "string",
      headerStyle: { minWidth: "10rem" },
    },
    {
      campo: "rangoTemp",
      header: "RANGO TEMP.",
      tipo: "string",
      headerStyle: { minWidth: "9rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "vidaUtil",
      header: "VIDA UTIL",
      tipo: "string",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "pesoKgs",
      header: "PESO",
      tipo: "number",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "activoSN",
      header: "ESTADO",
      tipo: "booleano",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
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
          sku: getValueFromRow(row, ["sku"]),
          nombre,
          familia: getValueFromRow(row, ["familia"]),
          rangoTemp: getValueFromRow(row, ["rangoTemp", "rango temp", "rangotemp"]),
          vidaUtil: getValueFromRow(row, ["vidaUtil", "vida util", "vidautil"]),
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
        mostrarEdicionEnModal={true}
        modalEdicionProps={{
          showHeader: false,
          className: "neat-crud-edit-dialog catalogo-edit-dialog",
          style: { width: "min(560px, 94vw)" },
        }}
        columnas={columnas}
        filtradoBase={empresaIdSesion ? { empresaId: empresaIdSesion } : undefined}
        deleteRegistro={deleteProducto}
        procesarImportacionCSV={procesarImportacionCSV}
      />
    </div>
  );
};

export default Producto;
