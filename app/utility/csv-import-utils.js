import { getUsuarioSesion } from "@/app/utility/Utils";

const normalizeHeader = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const getValueFromRow = (rowNormalizado, posiblesClaves = []) => {
  for (const clave of posiblesClaves) {
    const normalizedKey = normalizeHeader(clave);
    if (!isEmpty(rowNormalizado[normalizedKey])) {
      return String(rowNormalizado[normalizedKey]).trim();
    }
  }
  return "";
};

const parseNumberOrNull = (value) => {
  if (isEmpty(value)) return null;
  const num = Number(String(value).replace(",", "."));
  return Number.isNaN(num) ? null : num;
};

const parseActivoSN = (value, defaultValue = "S") => {
  if (isEmpty(value)) return defaultValue;
  const normalized = normalizeHeader(value);
  if (["s", "si", "1", "true", "activo", "yes", "y"].includes(normalized)) {
    return "S";
  }
  if (["n", "no", "0", "false", "inactivo"].includes(normalized)) {
    return "N";
  }
  return defaultValue;
};

const createResult = () => ({ created: 0, updated: 0, errors: [] });

const getUsuarioSesionId = () => getUsuarioSesion()?.id ?? null;

const getUsuarioSesionEmpresaId = () => getUsuarioSesion()?.empresaId ?? null;

export {
  normalizeHeader,
  isEmpty,
  getValueFromRow,
  parseNumberOrNull,
  parseActivoSN,
  createResult,
  getUsuarioSesionId,
  getUsuarioSesionEmpresaId,
};
