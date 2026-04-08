"use client";
import { getIdiomas, getIdiomasCount, deleteIdioma, postIdioma, patchIdioma } from "@/app/api-endpoints/idioma";
import EditarIdioma from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { createResult, getUsuarioSesionId, getValueFromRow, normalizeHeader, parseActivoSN, parseNumberOrNull } from "@/app/utility/csv-import-utils";
const Idioma = () => {
    const intl = useIntl();

    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'iso', header: intl.formatMessage({ id: 'Iso' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    const procesarImportacionCSV = async ({ rowsNormalizados }) => {
        const result = createResult();
        const usuarioSesionId = getUsuarioSesionId();
        const existentes = await getIdiomas();
        const indexByIso = new Map();
        const indexByNombre = new Map();

        existentes.forEach((item) => {
            if (item.iso) indexByIso.set(normalizeHeader(item.iso), item);
            if (item.nombre) indexByNombre.set(normalizeHeader(item.nombre), item);
        });

        for (let i = 0; i < rowsNormalizados.length; i++) {
            try {
                const row = rowsNormalizados[i];
                const iso = getValueFromRow(row, ["iso"]);
                const nombre = getValueFromRow(row, ["nombre"]);
                const orden = parseNumberOrNull(getValueFromRow(row, ["orden"]));
                const activoSn = parseActivoSN(getValueFromRow(row, ["activoSn", "activo", "activosn"]), "S");

                if (!iso && !nombre) {
                    throw new Error(`Fila ${i + 2}: Debe indicar al menos ISO o Nombre`);
                }

                const payload = {
                    iso: iso || null,
                    nombre: nombre || null,
                    orden,
                    activoSn,
                };

                const existente = (iso && indexByIso.get(normalizeHeader(iso))) || (nombre && indexByNombre.get(normalizeHeader(nombre)));
                if (existente?.id) {
                    payload.usuModificacion = usuarioSesionId;
                    await patchIdioma(existente.id, payload);
                    result.updated++;
                } else {
                    payload.usuCreacion = usuarioSesionId;
                    const nuevo = await postIdioma(payload);
                    if (nuevo?.id) {
                        result.created++;
                        if (payload.iso) indexByIso.set(normalizeHeader(payload.iso), nuevo);
                        if (payload.nombre) indexByNombre.set(normalizeHeader(payload.nombre), nuevo);
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
                headerCrud={intl.formatMessage({ id: 'Idiomas' })}
                getRegistros={getIdiomas}
                getRegistrosCount={getIdiomasCount}
                botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV', 'importarCSV']}
                controlador={"Idiomas"}
                empresaId={null}
                editarComponente={<EditarIdioma />}
                columnas={columnas}
                deleteRegistro={deleteIdioma}
                procesarImportacionCSV={procesarImportacionCSV}
            />
        </div>
    );
};
export default Idioma;
