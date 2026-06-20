"use client";
import { getPallet, getPalletCount, deletePallet, upsertPalletFromCSV } from "@/app/api-endpoints/pallet";
import EditarPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { createResult, getValueFromRow } from "@/app/utility/csv-import-utils";
import PalletIntro from "./PalletIntro";

const Pallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'codigo', header: intl.formatMessage({ id: 'Código' }), tipo: 'string' },
        { campo: 'alias', header: intl.formatMessage({ id: 'Alias' }), tipo: 'string' },
        { campo: 'modelo', header: intl.formatMessage({ id: 'Modelo' }), tipo: 'string' },
        { campo: 'medidas', header: intl.formatMessage({ id: 'Medidas' }), tipo: 'string' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Orden' })]: registro.orden,
                [intl.formatMessage({ id: 'Código' })]: registro.codigo,
                [intl.formatMessage({ id: 'Alias' })]: registro.alias,
                [intl.formatMessage({ id: 'Modelo' })]: registro.modelo,
                [intl.formatMessage({ id: 'Medidas' })]: registro.medidas,
                [intl.formatMessage({ id: 'Fecha de Impresión' })]: registro.fechaImpresion,
                [intl.formatMessage({ id: 'Periodo envío mail (horas)' })]: registro.periodoEnvioMail,
            };
        });
    };

    const procesarImportacionCSV = async ({
        headers = [],
        headersNormalizados = [],
        rows = [],
        rowsNormalizados = [],
    }) => {
        const result = createResult();
        const cabecerasConocidas = ['orden', 'codigo', 'alias', 'modelo', 'medidas', 'periodoenviomail', 'fechaimpresion'];
        const tieneCabecera = headersNormalizados.some((header) => cabecerasConocidas.includes(header));

        const filas = [];

        if (tieneCabecera) {
            rowsNormalizados.forEach((row, index) => {
                filas.push({
                    linea: index + 2,
                    orden: getValueFromRow(row, ['orden']),
                    codigo: getValueFromRow(row, ['codigo']),
                    alias: getValueFromRow(row, ['alias']),
                    modelo: getValueFromRow(row, ['modelo']),
                    medidas: getValueFromRow(row, ['medidas']),
                    periodoEnvioMail: getValueFromRow(row, ['periodoEnvioMail', 'periodo envio mail', 'periodo envio mail horas', 'periodo']),
                    fechaImpresion: getValueFromRow(row, ['fechaImpresion', 'fecha impresion']),
                });
            });
        } else {
            const filasSinCabecera = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))];
            filasSinCabecera.forEach((campos, index) => {
                filas.push({
                    linea: index + 1,
                    orden: campos[0] ?? '',
                    codigo: campos[1] ?? '',
                    alias: campos[2] ?? '',
                    modelo: campos[3] ?? '',
                    medidas: campos[4] ?? '',
                    periodoEnvioMail: campos[5] ?? '',
                    fechaImpresion: campos[6] ?? '',
                });
            });
        }

        for (const fila of filas) {
            try {
                const codigo = String(fila.codigo ?? '').trim();
                const alias = String(fila.alias ?? '').trim();

                if (!codigo) {
                    throw new Error(`Fila ${fila.linea}: Codigo es obligatorio`);
                }
                if (!alias) {
                    throw new Error(`Fila ${fila.linea}: Alias es obligatorio`);
                }

                const periodoRaw = String(fila.periodoEnvioMail ?? '').trim();
                const periodoParsed = periodoRaw ? parseInt(periodoRaw, 10) : 24;
                const periodoEnvioMail = Number.isNaN(periodoParsed) ? 24 : periodoParsed;

                const payload = {
                    orden: String(fila.orden ?? '').trim(),
                    codigo,
                    alias,
                    modelo: String(fila.modelo ?? '').trim(),
                    medidas: String(fila.medidas ?? '').trim(),
                    periodoEnvioMail,
                    fechaImpresion: String(fila.fechaImpresion ?? '').trim() || new Date().toISOString(),
                };

                const upsertResult = await upsertPalletFromCSV(payload);
                if (upsertResult?.action === 'created') {
                    result.created++;
                } else if (upsertResult?.action === 'updated') {
                    result.updated++;
                } else {
                    result.updated++;
                }
            } catch (error) {
                const mensaje = error?.message || 'Error desconocido';
                result.errors.push(
                    mensaje.toLowerCase().startsWith(`fila ${fila.linea}:`.toLowerCase())
                        ? mensaje
                        : `Fila ${fila.linea}: ${mensaje}`
                );
            }
        }

        return result;
    };

    return (
        <div>
            <PalletIntro />
            <Crud
                headerCrud=""
                getRegistros={getPallet}
                getRegistrosCount={getPalletCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV', 'importarCSVPallets']}
                controlador={"Pallet"}
                editarComponente={<EditarPallets />}
                columnas={columnas}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    style: { width: "min(1200px, 96vw)" },
                }}
                deleteRegistro={deletePallet}
                procesarDatosParaCSV={procesarDatosParaCSV}
                procesarImportacionCSV={procesarImportacionCSV}
            />
        </div>
    );
};

export default Pallet;

