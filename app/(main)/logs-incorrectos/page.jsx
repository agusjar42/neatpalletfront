"use client";
import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { devuelveBasePath } from "@/app/utility/Utils";
import axios from 'axios';
import { useIntl } from "react-intl";
import LogsSistemaTabs from "./LogsSistemaTabs";
import LogsSistemaIntro from "./LogsSistemaIntro";

const LogsIncorrectos = () => {
    const intl = useIntl();
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [textoBusquedaAplicado, setTextoBusquedaAplicado] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        cargarArchivos();
    }, []);

    const cargarArchivos = async () => {
        setLoading(true);
        try {
            const backendUrl = devuelveBasePath();
            const response = await axios.get(`${backendUrl}/log-usuarios/archivos-logs`);

            if (response.data.success) {
                setArchivos(response.data.archivos);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: intl.formatMessage({ id: "Error" }),
                    detail: intl.formatMessage({ id: "Error al cargar los archivos de logs" }),
                    life: 3000,
                });
            }
        } catch (error) {
            console.error(intl.formatMessage({ id: "Error al cargar archivos:" }), error);
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: intl.formatMessage({ id: "Error al conectar con el servidor" }),
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const descargarArchivo = async (nombreArchivo) => {
        try {
            const backendUrl = devuelveBasePath();
            const response = await axios.get(`${backendUrl}/log-usuarios/descargar-log/${nombreArchivo}`, {
                responseType: 'text',
            });

            //
            //Descargamos el archivo recibido como texto plano
            //
            const blob = new Blob([response.data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.current?.show({
                severity: "success",
                summary: "OK",
                detail: intl.formatMessage({ id: "Archivo descargado correctamente" }),
                life: 3000,
            });
        } catch (error) {
            console.error(intl.formatMessage({ id: "Error al descargar archivo:" }), error);
            toast.current?.show({
                severity: "error",
                summary: intl.formatMessage({ id: "Error" }),
                detail: intl.formatMessage({ id: "Error al descargar el archivo" }),
                life: 3000,
            });
        }
    };

    const borrarArchivo = (nombreArchivo) => {
        confirmDialog({
            message: `${intl.formatMessage({ id: "Estas seguro de que quieres borrar el archivo" })} "${nombreArchivo}"? ${intl.formatMessage({ id: "Esta accion no se puede deshacer." })}`,
            header: intl.formatMessage({ id: "Confirmacion de borrado" }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: intl.formatMessage({ id: "Si, borrar" }),
            rejectLabel: intl.formatMessage({ id: "Cancelar" }),
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const backendUrl = devuelveBasePath();
                    const response = await axios.delete(`${backendUrl}/log-usuarios/borrar-log/${nombreArchivo}`);

                    if (response.data.success) {
                        toast.current?.show({
                            severity: "success",
                            summary: "OK",
                            detail: intl.formatMessage({ id: "Archivo borrado correctamente" }),
                            life: 3000,
                        });
                        cargarArchivos();
                    } else {
                        toast.current?.show({
                            severity: "error",
                            summary: intl.formatMessage({ id: "Error" }),
                            detail: response.data.message || intl.formatMessage({ id: "Error al borrar el archivo" }),
                            life: 3000,
                        });
                    }
                } catch (error) {
                    console.error(intl.formatMessage({ id: "Error al borrar archivo:" }), error);
                    toast.current?.show({
                        severity: "error",
                        summary: intl.formatMessage({ id: "Error" }),
                        detail: intl.formatMessage({ id: "Error al conectar con el servidor" }),
                        life: 3000,
                    });
                }
            }
        });
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatearTamano = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const normalizarTexto = (texto) => String(texto || "").trim().toLowerCase();

    const archivosFiltrados = archivos.filter((archivo) => {
        const busqueda = normalizarTexto(textoBusquedaAplicado);

        if (!busqueda) {
            return true;
        }

        return [
            archivo.tipo,
            archivo.nombre,
            formatearFecha(archivo.fecha),
            formatearTamano(archivo.tamano),
        ].some((valor) => normalizarTexto(valor).includes(busqueda));
    });

    const accionesTemplate = (rowData) => {
        return (
            <div className="neat-row-actions">
                <Button
                    icon="pi pi-download"
                    className="neat-action-button neat-action-download"
                    rounded
                    title={intl.formatMessage({ id: "Descargar" })}
                    onClick={() => descargarArchivo(rowData.nombre)}
                />
                <Button
                    icon="pi pi-trash"
                    className="neat-action-button neat-action-delete"
                    rounded
                    title={intl.formatMessage({ id: "Borrar" })}
                    onClick={() => borrarArchivo(rowData.nombre)}
                />
            </div>
        );
    };

    const fechaTemplate = (rowData) => {
        return formatearFecha(rowData.fecha);
    };

    const tamanoTemplate = (rowData) => {
        return formatearTamano(rowData.tamano);
    };

    const manejarCambioDePagina = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const limpiarFiltros = () => {
        setTextoBusqueda("");
        setTextoBusquedaAplicado("");
        setFirst(0);
    };

    const aplicarBusqueda = () => {
        setTextoBusquedaAplicado(textoBusqueda);
        setFirst(0);
    };

    const exportarCsv = () => {
        const encabezados = ["Tipo", "Nombre del archivo", "Fecha de modificacion", "Tamano"];
        const lineas = [
            encabezados.join(";"),
            ...archivosFiltrados.map((archivo) => [
                archivo.tipo,
                archivo.nombre,
                formatearFecha(archivo.fecha),
                formatearTamano(archivo.tamano),
            ].map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`).join(";")),
        ];

        const blob = new Blob(["\ufeff" + lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "logs-sistema.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const headerTabla = (
        <div className="neat-crud-toolbar">
            <div className="neat-crud-toolbar-search">
                <span className="p-input-icon-left neat-crud-search-input-wrapper">
                    <i className="pi pi-search" />
                    <InputText
                        value={textoBusqueda}
                        onChange={(event) => setTextoBusqueda(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                aplicarBusqueda();
                            }
                        }}
                        className="neat-crud-search-input"
                        placeholder={intl.formatMessage({ id: "Buscar logs de sistema..." })}
                    />
                </span>
            </div>
            <div className="neat-crud-toolbar-actions">
                <Button
                    label={intl.formatMessage({ id: "Buscar" })}
                    icon="pi pi-search"
                    onClick={aplicarBusqueda}
                    className="neat-crud-toolbar-button neat-crud-toolbar-button-secondary"
                    outlined
                />
                <Button
                    label={intl.formatMessage({ id: "Limpiar filtros" })}
                    icon="pi pi-filter-slash"
                    onClick={limpiarFiltros}
                    className="neat-crud-toolbar-button neat-crud-toolbar-button-secondary"
                    outlined
                />
                <Button
                    label={intl.formatMessage({ id: "Exportar CSV" })}
                    icon="pi pi-download"
                    onClick={exportarCsv}
                    className="neat-crud-toolbar-button neat-crud-toolbar-button-secondary"
                    outlined
                />
            </div>
        </div>
    );

    const paginatorTemplate = {
        layout: "CurrentPageReport RowsPerPageDropdown",
        CurrentPageReport: (options) => (
            <span className="neat-paginator-report">
                {intl.formatMessage({ id: "Mostrando" })} {options.last} {intl.formatMessage({ id: "de" })} {options.totalRecords} (total {options.totalRecords})
            </span>
        ),
        RowsPerPageDropdown: (options) => {
            const rowOptions = [20, 50, 100];
            const currentRows = Number(options.value) || rows;
            const currentPage = options.currentPage || 0;
            const totalPages = options.totalPages || 1;
            const hasMultiplePages = totalPages > 1;
            const goToPage = (page) => manejarCambioDePagina({ first: page * currentRows, rows: currentRows });

            return (
                <div className="neat-rows-per-page">
                    {hasMultiplePages && (
                        <div className="neat-page-nav-group">
                            <button type="button" className="neat-page-nav" disabled={currentPage <= 0} onClick={() => goToPage(currentPage - 1)}>
                                Anterior
                            </button>
                            <button type="button" className="neat-page-nav" disabled={currentPage >= totalPages - 1} onClick={() => goToPage(currentPage + 1)}>
                                Siguiente
                            </button>
                        </div>
                    )}
                    <span>Por pagina:</span>
                    {rowOptions.map((rowCount) => (
                        <button
                            key={rowCount}
                            type="button"
                            className={options.value === rowCount ? "active" : ""}
                            onClick={(event) => options.onChange({ originalEvent: event, value: rowCount })}
                        >
                            {rowCount}
                        </button>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="grid">
            <ConfirmDialog />
            <Toast ref={toast} position="top-right" />

            <div className="col-12">
                <LogsSistemaTabs />
                <LogsSistemaIntro archivos={archivos} />
                <Card>
                    {loading ? (
                        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            <ProgressSpinner />
                        </div>
                    ) : archivos.length === 0 ? (
                        <div className="text-center p-5">
                            <i className="pi pi-inbox" style={{ fontSize: '3rem', color: 'var(--text-color-secondary)' }}></i>
                            <p className="text-600 mt-3">{intl.formatMessage({ id: "No hay archivos de logs disponibles" })}</p>
                        </div>
                    ) : (
                        <DataTable
                            value={archivosFiltrados}
                            paginator
                            first={first}
                            rows={rows}
                            onPage={manejarCambioDePagina}
                            rowsPerPageOptions={[20, 50, 100]}
                            paginatorTemplate={paginatorTemplate}
                            dataKey="nombre"
                            emptyMessage={intl.formatMessage({ id: "No se encontraron archivos" })}
                            className="datatable-responsive"
                            header={headerTabla}
                        >
                            <Column
                                field="tipo"
                                header={intl.formatMessage({ id: "Tipo" })}
                                sortable
                                style={{ width: '15%' }}
                            />
                            <Column
                                field="nombre"
                                header={intl.formatMessage({ id: "Nombre del Archivo" })}
                                sortable
                                style={{ width: '30%' }}
                            />
                            <Column
                                field="fecha"
                                header={intl.formatMessage({ id: "Fecha de Modificacion" })}
                                body={fechaTemplate}
                                sortable
                                style={{ width: '25%' }}
                            />
                            <Column
                                field="tamano"
                                header={intl.formatMessage({ id: "Tamano" })}
                                body={tamanoTemplate}
                                sortable
                                style={{ width: '10%' }}
                            />
                            <Column
                                header={intl.formatMessage({ id: "Acciones" })}
                                body={accionesTemplate}
                                exportable={false}
                                style={{ width: '20%', textAlign: 'left' }}
                            />
                        </DataTable>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default LogsIncorrectos;
