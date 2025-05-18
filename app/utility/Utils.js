// --------------------------------- L I B R E R I A S --------------------------------------------//
import { format } from 'date-fns';
import { differenceInDays, parseISO } from 'date-fns';
  // ------------------------------------------------------------------------------------------------//

// Recibe fecha de tipo String y retorna Fecha Formateada de tipo Date (dd/MM/yyyy)
export function formatearFechaString(fechaString) {
  return fechaString ? format(new Date(fechaString), 'dd/MM/yyyy') : 'N/A'
}

// Retorna la fecha en formato String
export function formatearFechaLocal_a_toISOString(fecha) {
  // Obtener la zona horaria del sistema
  const tzOffset = fecha.getTimezoneOffset() * 60000; // en milisegundos
  // Crear una nueva fecha en UTC ajustada con el offset de la zona horaria local
  const fechaLocal = new Date(fecha.getTime() - tzOffset);
  // Convertir la fecha a formato ISO 8601 con 'Z' indicando UTC
  return fechaLocal.toISOString().slice(0, -1) + 'Z';
};

// Recibe fecha de tipo Date y retorna Fecha Formateada de tipo Date (dd/MM/yyyy)
export function formatearFechaDate(fecha) {
  return fecha.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Retorna el token del usuario que esta logueado
export function getAccessToken() {
  return JSON.parse(localStorage.getItem('userDataNeatpallet'))?.accessToken
}
//Retorna un array de los datos del usuario que está logueado
export function getUsuarioSesion() {
  return JSON.parse(localStorage.getItem('userDataNeatpallet'));
}

// Retorna la ruta base de la API
export function devuelveBasePath() {
  let NEXT_PUBLIC_BACKEND_BASEPATH = process.env.NEXT_PUBLIC_BACKEND_BASEPATH_LOCAL
  if (process.env.NEXT_PUBLIC_ENTORNO == "DEV") {
    NEXT_PUBLIC_BACKEND_BASEPATH = process.env.NEXT_PUBLIC_BACKEND_BASEPATH_DEV
  }
  if (process.env.NEXT_PUBLIC_ENTORNO == "PRE") {
    NEXT_PUBLIC_BACKEND_BASEPATH = process.env.NEXT_PUBLIC_BACKEND_BASEPATH_PRE
  }
  if (process.env.NEXT_PUBLIC_ENTORNO == "PRO") {
    NEXT_PUBLIC_BACKEND_BASEPATH = process.env.NEXT_PUBLIC_BACKEND_BASEPATH_PRO
  }
  return NEXT_PUBLIC_BACKEND_BASEPATH
}

//Convierte el número pasado por parámetro en en formato 000,000.00  
//Dependiendo de si ponemos ge-GE saldrá este formato 000.000,00
export function formatNumber(value) {
  if (isNaN(value)) return '';

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
/**
 * Calcula la diferencia en días entre una fecha en formato ISO y la fecha actual.
 * @param {string} fechaISO - La fecha en formato ISO.
 * @returns {number} - La diferencia en días.
 */
//import { differenceInDays, parseISO } from 'date-fns';

export function calcularDiferenciaDias(fechaISO) {
  const fechaComparacion = parseISO(fechaISO);
  const fechaActual = new Date();
  return differenceInDays(fechaComparacion, fechaActual);
}
