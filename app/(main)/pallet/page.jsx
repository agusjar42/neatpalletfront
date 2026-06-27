"use client";
import { getPallet, getPalletCount, deletePallet, upsertPalletFromCSV } from "@/app/api-endpoints/pallet";
import EditarPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";
import { createResult, getValueFromRow } from "@/app/utility/csv-import-utils";
import PalletIntro from "./PalletIntro";

const Pallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: "orden", header: intl.formatMessage({ id: "Orden" }), tipo: "string" },
        { campo: "codigo", header: "NUM. PALLET", tipo: "string" },
        { campo: "alias", header: "NOMBRE ASIGNADO", tipo: "string" },
        { campo: "medidas", header: intl.formatMessage({ id: "Medidas" }), tipo: "string" },
        { campo: "modelo", header: intl.formatMessage({ id: "Modelo" }), tipo: "string" },
        { campo: "fechaImpresionEspanol", header: "ADQUISICION", tipo: "string" },
        { campo: "estado", header: "ESTADO", tipo: "string" },
        { campo: "ultimaSenal", header: "ULTIMA SENAL", tipo: "string" },
    ];

    //
    //Transformamos los registros para exportar con los nombres visibles en la tabla
    //
    const procesarDatosParaCSV = (registros) => {
        return registros.map((registro) => {
            return {
                [intl.formatMessage({ id: "Orden" })]: registro.orden,
                ["NUM. pallet"]: registro.codigo,
                ["Nombre asignado"]: registro.alias,
                [intl.formatMessage({ id: "Medidas" })]: registro.medidas,
                [intl.formatMessage({ id: "Modelo" })]: registro.modelo,
                ["Adquisicion"]: registro.fechaImpresion,
                ["Estado"]: registro.estado,
                ["Ultima senal"]: registro.ultimaSenal,
                [intl.formatMessage({ id: "Periodo envio mail (horas)" })]: registro.periodoEnvioMail,
                [intl.formatMessage({ id: "Fecha de impresion" })]: registro.fechaImpresion,
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
        const cabecerasConocidas = ["orden", "codigo", "alias", "medidas", "modelo", "adquisicion", "estado", "ultimasenal", "periodoenviomail", "fechaimpresion"];
        const tieneCabecera = headersNormalizados.some((header) => cabecerasConocidas.includes(header));

        const filas = [];

        if (tieneCabecera) {
            rowsNormalizados.forEach((row, index) => {
                filas.push({
                    linea: index + 2,
                    orden: getValueFromRow(row, ["orden"]),
                    codigo: getValueFromRow(row, ["codigo"]),
                    alias: getValueFromRow(row, ["alias"]),
                    medidas: getValueFromRow(row, ["medidas"]),
                    modelo: getValueFromRow(row, ["modelo"]),
                    adquisicion: getValueFromRow(row, ["adquisicion"]),
                    estado: getValueFromRow(row, ["estado"]),
                    ultimaSenal: getValueFromRow(row, ["ultimaSenal", "ultima senal"]),
                    periodoEnvioMail: getValueFromRow(row, ["periodoEnvioMail", "periodo envio mail", "periodo envio mail horas", "periodo"]),
                    fechaImpresion: getValueFromRow(row, ["fechaImpresion", "fecha impresion"]),
                });
            });
        } else {
            const filasSinCabecera = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))];
            filasSinCabecera.forEach((campos, index) => {
                filas.push({
                    linea: index + 1,
                    orden: campos[0] ?? "",
                    codigo: campos[1] ?? "",
                    alias: campos[2] ?? "",
                    medidas: campos[3] ?? "",
                    modelo: campos[4] ?? "",
                    adquisicion: campos[5] ?? "",
                    estado: campos[6] ?? "",
                    ultimaSenal: campos[7] ?? "",
                    periodoEnvioMail: campos[8] ?? "",
                    fechaImpresion: campos[9] ?? "",
                });
            });
        }

        for (const fila of filas) {
            try {
                const codigo = String(fila.codigo ?? "").trim();
                const alias = String(fila.alias ?? "").trim();

                if (!codigo) {
                    throw new Error(`Fila ${fila.linea}: Codigo es obligatorio`);
                }
                if (!alias) {
                    throw new Error(`Fila ${fila.linea}: Alias es obligatorio`);
                }

                const periodoRaw = String(fila.periodoEnvioMail ?? "").trim();
                const periodoParsed = periodoRaw ? parseInt(periodoRaw, 10) : 24;
                const periodoEnvioMail = Number.isNaN(periodoParsed) ? 24 : periodoParsed;

                const payload = {
                    orden: String(fila.orden ?? "").trim(),
                    codigo,
                    alias,
                    medidas: String(fila.medidas ?? "").trim(),
                    modelo: String(fila.modelo ?? "").trim(),
                    adquisicion: String(fila.adquisicion ?? "").trim(),
                    estado: String(fila.estado ?? "").trim(),
                    ultimaSenal: String(fila.ultimaSenal ?? "").trim(),
                    periodoEnvioMail,
                    fechaImpresion: String(fila.fechaImpresion ?? "").trim() || String(fila.adquisicion ?? "").trim() || new Date().toISOString(),
                };

                const upsertResult = await upsertPalletFromCSV(payload);
                if (upsertResult?.action === "created") {
                    result.created++;
                } else if (upsertResult?.action === "updated") {
                    result.updated++;
                } else {
                    result.updated++;
                }
            } catch (error) {
                const mensaje = error?.message || "Error desconocido";
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
                botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV", "importarCSVPallets"]}
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
