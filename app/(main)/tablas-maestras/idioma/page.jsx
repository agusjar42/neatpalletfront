"use client";
import { getIdiomas, getIdiomasCount, deleteIdioma, postIdioma, patchIdioma } from "@/app/api-endpoints/idioma";
import EditarIdioma from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { createResult, getUsuarioSesionId, getValueFromRow, parseActivoSN, parseNumberOrNull } from "@/app/utility/csv-import-utils";
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

        for (let i = 0; i < rowsNormalizados.length; i++) {
            try {
                const row = rowsNormalizados[i];
                const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
                const iso = getValueFromRow(row, ["iso"]);
                const nombre = getValueFromRow(row, ["nombre"]);
                const orden = parseNumberOrNull(getValueFromRow(row, ["orden"]));
                const activoSn = parseActivoSN(getValueFromRow(row, ["activoSn", "activo", "activosn"]), "S");

                if (!rowId && !iso && !nombre) {
                    throw new Error(`Fila ${i + 2}: Debe indicar al menos ISO o Nombre`);
                }

                const payload = {
                    iso: iso || null,
                    nombre: nombre || null,
                    orden,
                    activoSn,
                };

                if (rowId) {
                    payload.usuModificacion = usuarioSesionId;
                    await patchIdioma(rowId, payload);
                    result.updated++;
                } else {
                    payload.usuCreacion = usuarioSesionId;
                    await postIdioma(payload);
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
