"use client";
import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { devuelveBasePath } from "@/app/utility/Utils";
import axios from 'axios';

const LogsIncorrectos = () => {
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    summary: "Error",
                    detail: "Error al cargar los archivos de logs",
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al cargar archivos:', error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Error al conectar con el servidor",
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

            // Crear un blob con el contenido del archivo
            const blob = new Blob([response.data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace temporal y hacer clic en él
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();

            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Archivo descargado correctamente",
                life: 3000,
            });
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Error al descargar el archivo",
                life: 3000,
            });
        }
    };

    const borrarArchivo = (nombreArchivo) => {
        confirmDialog({
            message: `¿Estás seguro de que quieres borrar el archivo "${nombreArchivo}"? Esta acción no se puede deshacer.`,
            header: 'Confirmación de borrado',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, borrar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const backendUrl = devuelveBasePath();
                    const response = await axios.delete(`${backendUrl}/log-usuarios/borrar-log/${nombreArchivo}`);

                    if (response.data.success) {
                        toast.current?.show({
                            severity: "success",
                            summary: "Éxito",
                            detail: "Archivo borrado correctamente",
                            life: 3000,
                        });
                        // Recargar la lista de archivos
                        cargarArchivos();
                    } else {
                        toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: response.data.message || "Error al borrar el archivo",
                            life: 3000,
                        });
                    }
                } catch (error) {
                    console.error('Error al borrar archivo:', error);
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Error al conectar con el servidor",
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

    const formatearTamaño = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const accionesTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-download"
                    rounded
                    outlined
                    severity="success"
                    tooltip="Descargar"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => descargarArchivo(rowData.nombre)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    tooltip="Borrar"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => borrarArchivo(rowData.nombre)}
                />
            </div>
        );
    };

    const fechaTemplate = (rowData) => {
        return formatearFecha(rowData.fecha);
    };

    const tamañoTemplate = (rowData) => {
        return formatearTamaño(rowData.tamaño);
    };

    return (
        <div className="grid">
            <ConfirmDialog />
            <Toast ref={toast} position="top-right" />

            <div className="col-12">
                <Card title="Logs de Intentos de Login Incorrectos">
                    <div className="mb-3">
                        <p className="text-600 mb-3">
                            Aquí puedes visualizar y gestionar los archivos de logs de intentos de login fallidos.
                            Cada archivo contiene los registros de un mes específico.
                        </p>
                        <Button
                            label="Actualizar"
                            icon="pi pi-refresh"
                            onClick={cargarArchivos}
                            className="mb-3"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            <ProgressSpinner />
                        </div>
                    ) : archivos.length === 0 ? (
                        <div className="text-center p-5">
                            <i className="pi pi-inbox" style={{ fontSize: '3rem', color: 'var(--text-color-secondary)' }}></i>
                            <p className="text-600 mt-3">No hay archivos de logs disponibles</p>
                        </div>
                    ) : (
                        <DataTable
                            value={archivos}
                            paginator
                            rows={10}
                            dataKey="nombre"
                            emptyMessage="No se encontraron archivos"
                            className="datatable-responsive"
                        >
                            <Column
                                field="nombre"
                                header="Nombre del Archivo"
                                sortable
                                style={{ width: '40%' }}
                            />
                            <Column
                                field="fecha"
                                header="Fecha de Modificación"
                                body={fechaTemplate}
                                sortable
                                style={{ width: '25%' }}
                            />
                            <Column
                                field="tamaño"
                                header="Tamaño"
                                body={tamañoTemplate}
                                sortable
                                style={{ width: '15%' }}
                            />
                            <Column
                                header="Acciones"
                                body={accionesTemplate}
                                exportable={false}
                                style={{ width: '20%' }}
                            />
                        </DataTable>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default LogsIncorrectos;
