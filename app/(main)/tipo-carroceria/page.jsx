"use client";
import {
  getTipoCarroceria,
  getTipoCarroceriaCount,
  deleteTipoCarroceria,
  postTipoCarroceria,
  patchTipoCarroceria,
} from "@/app/api-endpoints/tipo-carroceria";
import EditarTipoCarroceria from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";
import { getUsuarioSesion } from "@/app/utility/Utils";
import {
  createResult,
  getUsuarioSesionId,
  getValueFromRow,
  normalizeHeader,
  parseActivoSN,
  parseNumberOrNull,
} from "@/app/utility/csv-import-utils";

const TipoCarroceria = () => {
  const intl = useIntl();
  const empresaIdSesion = getUsuarioSesion()?.empresaId;
  const columnas = [
    { campo: "orden", header: intl.formatMessage({ id: "Orden" }), tipo: "string" },
    { campo: "nombre", header: intl.formatMessage({ id: "Nombre" }), tipo: "string" },
    { campo: "activoSn", header: intl.formatMessage({ id: "Activo" }), tipo: "booleano" },
  ];

  const procesarImportacionCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();
    const existentes = await getTipoCarroceria(
      JSON.stringify({ where: { and: { empresaId: empresaIdSesion } } })
    );
    const indexByNombre = new Map();
    existentes.forEach((item) => {
      if (item.nombre) indexByNombre.set(normalizeHeader(item.nombre), item);
    });

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const payload = {
          empresaId: empresaIdSesion,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          activoSn: parseActivoSN(getValueFromRow(row, ["activoSn", "activo"]), "S"),
        };

        const existente = indexByNombre.get(normalizeHeader(nombre));
        if (existente?.id) {
          payload.usuarioModificacion = usuarioSesionId;
          await patchTipoCarroceria(existente.id, payload);
          result.updated++;
        } else {
          payload.usuarioCreacion = usuarioSesionId;
          const nuevo = await postTipoCarroceria(payload);
          if (nuevo?.id) {
            result.created++;
            indexByNombre.set(normalizeHeader(nombre), nuevo);
          }
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
        headerCrud={intl.formatMessage({ id: "Tipos de Carrocería" })}
        getRegistros={getTipoCarroceria}
        getRegistrosCount={getTipoCarroceriaCount}
        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV", "importarCSV"]}
        controlador={"Tipos de Carrocería"}
        filtradoBase={{ empresaId: empresaIdSesion }}
        editarComponente={<EditarTipoCarroceria />}
        editarComponenteParametrosExtra={{ empresaId: empresaIdSesion }}
        columnas={columnas}
        deleteRegistro={deleteTipoCarroceria}
        procesarImportacionCSV={procesarImportacionCSV}
      />
    </div>
  );
};

export default TipoCarroceria;
