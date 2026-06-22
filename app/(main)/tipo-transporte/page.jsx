"use client";
import {
  getTipoTransporte,
  getTipoTransporteCount,
  deleteTipoTransporte,
  postTipoTransporte,
  patchTipoTransporte,
} from "@/app/api-endpoints/empresa-tipo-transporte";
import EditarTipoTransportes from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";
import { getUsuarioSesion } from "@/app/utility/Utils";
import {
  createResult,
  getUsuarioSesionId,
  getValueFromRow,
  parseActivoSN,
  parseNumberOrNull,
} from "@/app/utility/csv-import-utils";

const TipoTransporte = () => {
  const intl = useIntl();
  const empresaIdSesion = getUsuarioSesion()?.empresaId;
  const codigoBodyTemplate = (rowData) => {
    if (rowData?.codigo) {
      return rowData.codigo;
    }
    if (rowData?.orden !== undefined && rowData?.orden !== null) {
      return `T-${String(rowData.orden).padStart(2, "0")}`;
    }
    return "-";
  };
  const vehiculoBodyTemplate = (rowData) => rowData?.vehiculo ?? rowData?.nombre ?? "-";
  const usoBodyTemplate = (rowData) => rowData?.uso ?? rowData?.nombre ?? "-";
  const categoriaBodyTemplate = (rowData) => (
    <span className="catalogo-table-chip">{rowData?.categoria ?? "General"}</span>
  );
  const columnas = [
    { campo: "orden", header: "ORDEN", tipo: "string" },
    { campo: "codigo", header: "CODIGO", tipo: "string", body: codigoBodyTemplate },
    { campo: "vehiculo", header: "VEHICULO", tipo: "string", body: vehiculoBodyTemplate },
    { campo: "uso", header: "USO", tipo: "string", body: usoBodyTemplate },
    { campo: "categoria", header: "CATEGORIA", tipo: "string", body: categoriaBodyTemplate },
    { campo: "activoSn", header: "ACTIVO", tipo: "booleano" },
  ];

  const procesarImportacionCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!rowId && !nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const payload = {
          empresaId: empresaIdSesion,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          activoSn: parseActivoSN(getValueFromRow(row, ["activoSn", "activo"]), "S"),
        };

        if (rowId) {
          payload.usuarioModificacion = usuarioSesionId;
          await patchTipoTransporte(rowId, payload);
          result.updated++;
        } else {
          payload.usuarioCreacion = usuarioSesionId;
          await postTipoTransporte(payload);
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
        headerCrud={intl.formatMessage({ id: "Tipos de Transporte" })}
        getRegistros={getTipoTransporte}
        getRegistrosCount={getTipoTransporteCount}
        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV", "importarCSV"]}
        controlador={"Tipo Transporte"}
        filtradoBase={{ empresaId: empresaIdSesion }}
        editarComponente={<EditarTipoTransportes />}
        editarComponenteParametrosExtra={{ empresaId: empresaIdSesion }}
        mostrarEdicionEnModal={true}
        modalEdicionProps={{
          showHeader: false,
          className: "neat-crud-edit-dialog catalogo-edit-dialog",
          style: { width: "min(560px, 94vw)" },
        }}
        columnas={columnas}
        deleteRegistro={deleteTipoTransporte}
        procesarImportacionCSV={procesarImportacionCSV}
      />
    </div>
  );
};

export default TipoTransporte;
