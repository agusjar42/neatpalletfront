"use client";
import { getVistaTraduccionIdioma, getVistaTraduccionIdiomaCount, deleteTraduccion, postTraduccion, patchTraduccion } from "@/app/api-endpoints/traduccion";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import EditarTraduccion from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { useEffect, useState } from 'react';
import { createResult, getUsuarioSesionId, getValueFromRow, normalizeHeader, parseNumberOrNull } from "@/app/utility/csv-import-utils";

const Traduccion = () => {
    const intl = useIntl();
    const [columnas, setColumnas] = useState([{ campo: 'clave', header: intl.formatMessage({ id: 'Clave' }), tipo: 'string' }]);

    useEffect(() => {
        const cargarColumnas = async () => {
            try {
                // Obtener los idiomas de la base de datos
                const idiomas = await getIdiomas();
                const idiomasOrdenados = idiomas.sort((a, b) => a.nombre.localeCompare(b.nombre));
                // Añadir una columna por cada idioma
                const columnasIdiomas = idiomasOrdenados.map(idioma => ({
                    campo: idioma.nombre.toLowerCase(),
                    header: idioma.nombre,
                    tipo: 'string'
                }));

                // Combinar las columnas base con las de idiomas
                setColumnas([...columnas, ...columnasIdiomas]);
            } catch (error) {
                console.error('Error al cargar los idiomas:', error);
            }
        };

        cargarColumnas();
    }, [intl]);

    const obtenerTranslationId = (row, idiomaNombreNormalizado) => {
        if (!row) return null;
        for (const [key, value] of Object.entries(row)) {
            const keyNormalizada = normalizeHeader(key);
            if (keyNormalizada === `${idiomaNombreNormalizado}id`) {
                return parseNumberOrNull(value);
            }
        }
        return null;
    };

    const procesarImportacionCSV = async ({ rows, rowsNormalizados }) => {
        const result = createResult();
        const usuarioSesionId = getUsuarioSesionId();
        const idiomas = await getIdiomas();
        const idiomaByNombre = new Map();
        const idiomaByIso = new Map();

        idiomas.forEach((idioma) => {
            idiomaByNombre.set(normalizeHeader(idioma.nombre), idioma);
            idiomaByIso.set(normalizeHeader(idioma.iso), idioma);
        });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNormalizada = rowsNormalizados?.[i] || {};
            try {
                const rowId = parseNumberOrNull(getValueFromRow(rowNormalizada, ['id']));
                const claveEntry = Object.entries(row).find(([key]) => {
                    const normalized = normalizeHeader(key);
                    return normalized === 'clave' || normalized === 'key';
                });

                const clave = (claveEntry?.[1] || '').trim();
                if (!clave) {
                    throw new Error(`Fila ${i + 2}: La columna "clave" es obligatoria`);
                }

                let rowIdUsado = false;

                for (const [header, value] of Object.entries(row)) {
                    const normalizedHeader = normalizeHeader(header);
                    if (normalizedHeader === 'clave' || normalizedHeader === 'key' || normalizedHeader === 'id') {
                        continue;
                    }

                    const idioma = idiomaByNombre.get(normalizedHeader) || idiomaByIso.get(normalizedHeader);
                    if (!idioma) {
                        continue;
                    }

                    const valor = (value ?? '').toString();
                    if (!valor.trim()) {
                        continue;
                    }

                    const idiomaNombreNormalizado = normalizeHeader(idioma.nombre);
                    let traduccionId = obtenerTranslationId(row, idiomaNombreNormalizado);
                    if (!traduccionId && rowId && !rowIdUsado) {
                        traduccionId = rowId;
                        rowIdUsado = true;
                    }

                    if (traduccionId) {
                        await patchTraduccion(traduccionId, {
                            clave,
                            valor,
                            usuModificacion: usuarioSesionId,
                        });
                        result.updated++;
                    } else {
                        await postTraduccion({
                            idiomaId: idioma.id,
                            clave,
                            valor,
                            usuCreacion: usuarioSesionId,
                        });
                        result.created++;
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
                headerCrud={intl.formatMessage({ id: 'Traducciones' })}
                getRegistros={getVistaTraduccionIdioma}
                getRegistrosCount={getVistaTraduccionIdiomaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV', 'importarCSV']}
                controlador={"Traducciones"}
                //parametrosEliminar={['id', 'inglesId']}
                editarComponente={<EditarTraduccion />}
                columnas={columnas}
                deleteRegistro={deleteTraduccion}
                procesarImportacionCSV={procesarImportacionCSV}
            />
        </div>
    );
};

export default Traduccion;
