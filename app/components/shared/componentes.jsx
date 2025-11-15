"use client";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from "primereact/toast";
import React, { useState, useRef } from "react";
import { parse } from 'json2csv';
import {  getUsuarioSesion } from "../../utility/Utils";
import { useIntl } from 'react-intl'
import { compruebaPermiso } from "../../api-endpoints/permisos";
import { Tooltip } from 'primereact/tooltip';
import { getVistaEmpresaRolPermiso } from "@/app/api-endpoints/permisos";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const templateGenerico = (campo, cabecera) => (rowData) => {
    if (rowData[campo]?.length > 30) {
        return (
            <>
                <span className="p-column-title">{cabecera}</span>
                <Tooltip target=".templateGenerico"></Tooltip>
                {/* 30 - 1 caracteres de limite porque el '...' cuenta como un caracter */}
                <span style={{ width: '100%', display: 'block', maxWidth: '29ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="templateGenerico" data-pr-tooltip={rowData[campo]}>{rowData[campo]}</span>

            </>
        );
    }
    else {
        return (
            <>
                <span className="p-column-title">{cabecera}</span>
                <span>{rowData[campo]}</span>

            </>
        );
    }
};

const comprobarImagen = (campo, cabecera) => (rowData) => {
    if (rowData[campo] !== null && !esUrlImagen(rowData[campo])) {
        return (
            <>
                <a style={{ color: 'black' }} href={`${rowData[campo]}`} target="_blank">
                    <i className="pi pi-file text-7xl"></i>
                </a>
                <span className="p-column-title">{cabecera}</span>
            </>
        );
    }
    return (
        <>
            <a href={`${rowData[campo] || "/multimedia/sistemaNP/imagen-no-disponible.jpeg"}`} target="_blank">
                <img src={`${rowData[campo] || "/multimedia/sistemaNP/imagen-no-disponible.jpeg"}`} alt="Imagen" style={{ width: '100px', height: 'auto' }} />
            </a>
            <span className="p-column-title">{cabecera}</span>
        </>
    );

};

//Funcion para comprobar a traves de solo el url si un archivo es una imagen
const esUrlImagen = (url) => {
    if (!url) return false;
    // Extraer la extensión del archivo buscando el último punto
    const extension = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

    // Devolver el tipo basado en la extensión
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'tiff' || extension === 'avif';
}

const manejarCambioImagen = (event) => {
    return event.target.files[0];
};

const tieneUsuarioPermiso = async (modulo, controlador, permiso) => {
    const usuario = getUsuarioSesion();
    return await compruebaPermiso(usuario.rolId, modulo, controlador, permiso);
}

const obtenerTodosLosPermisos = async (accion) => {
    const usuario = getUsuarioSesion();
    const permisos = await getVistaEmpresaRolPermiso(JSON.stringify({
        where: {
            and: {
                rolId: usuario.rolId,
                permisoAccion: accion,
                empresaId: getUsuarioSesion().empresaId
            }
        }
    }));
    return permisos
};

const ErrorDetail = () => {
    const intl = useIntl();
    return (
        <div>
            {intl.formatMessage({ id: 'No ha sido posible eliminar el registro ya que tiene dependencias.' })}
        </div>
    )
};

const botonesDeAccionTemplate = (rowData, editar, confirmarEliminar) => {
    return (
        <>
            <Button
                icon="pi pi-pencil"
                className="mr-2"
                rounded
                severity="success"
                onClick={() => editar(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                severity="warning"
                onClick={() => confirmarEliminar(rowData)}
            />
        </>
    );
};

const eliminarDialogFooter = (ocultarEliminarDialog, eliminar) => {
    return (
        <>
            <Button
                label={intl.formatMessage({ id: 'NO' })}
                icon="pi pi-times"
                text
                onClick={ocultarEliminarDialog}
            />
            <Button
                label={intl.formatMessage({ id: 'SI' })}
                icon="pi pi-check"
                text
                onClick={eliminar}
            />
        </>
    );
};

const Header = ({ crearNuevo, generarCSV, importarCSVPallets, generarGrafico, mostrarQR, enviarCorreo, limpiarFiltros, valorDeFiltroGlobal, manejarCambioFiltroGlobal, nombre, manejarBusquedaFiltroGlobal,
    operadorSeleccionado, setOperadorSeleccionado, listaOperadores,
}) => {
    const intl = useIntl()
    return <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex items-center mb-2 md:mb-0 md:mr-auto md:align-items-center">
            <h5 className="m-0 mr-2">{nombre}</h5>
            {(crearNuevo !== null && crearNuevo !== undefined) &&     //Si no se envia la funcion de crearNuevo, no muestra el boton
                (
                    <Button
                        label={intl.formatMessage({ id: 'Nuevo' })}
                        icon="pi pi-plus"
                        severity="success"
                        onClick={crearNuevo}
                        className="mr-2"
                    />
                )
            }
            {(generarCSV !== null && generarCSV !== undefined) &&     //Si no se envia la funcion de generarCSV, no muestra el boton
                (
                    <Button
                        label={`${intl.formatMessage({ id: 'Descargar' })} CSV`}
                        icon="pi pi-download"
                        severity="success"
                        onClick={generarCSV}
                        className="mr-2"
                    />
                )
            }
            {(importarCSVPallets !== null && importarCSVPallets !== undefined) &&     //Si no se envia la funcion de importarCSVPallets, no muestra el boton
                (
                    <Button
                        label={`${intl.formatMessage({ id: 'Importar' })} CSV Pallets`}
                        icon="pi pi-upload"
                        severity="warning"
                        onClick={importarCSVPallets}
                        className="mr-2"
                    />
                )
            }
            {(generarGrafico !== null && generarGrafico !== undefined) &&     //Si no se envia la funcion de generarGrafico, no muestra el boton
                (
                    <Button
                        label={`${intl.formatMessage({ id: 'Generar Gráfico' })}`}
                        icon="pi pi-chart-bar"
                        severity="info"
                        onClick={generarGrafico}
                        className="mr-2"
                    />
                )
            }
            {(mostrarQR !== null && mostrarQR !== undefined) &&     //Si no se envia la funcion de generarCSV, no muestra el boton
                (
                    <Button
                        label={`${intl.formatMessage({ id: 'Mostrar' })} QR`}
                        icon="pi pi-download"
                        severity="success"
                        onClick={mostrarQR}
                    />
                )
            }
            {(enviarCorreo !== null && enviarCorreo !== undefined) &&     //Si no se envia la funcion de generarCSV, no muestra el boton
                (
                    <Button
                        label={`${intl.formatMessage({ id: 'Enviar correos' })}`}
                        icon="pi pi-download"
                        severity="success"
                        onClick={enviarCorreo}
                    />
                )
            }
        </div>
        <div className="flex flex-wrap gap-2">
            <Dropdown
                value={operadorSeleccionado || 'or'}
                options={listaOperadores}
                onChange={(e) => setOperadorSeleccionado(e.value)}
                placeholder={intl.formatMessage({ id: 'Seleccionar operador' })}
                className="p-column-filter"
            //showClear
            />
            <span className="p-input-icon-left ml-2">
                <i className="pi pi-search" />
                <InputText value={valorDeFiltroGlobal} onChange={manejarCambioFiltroGlobal}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            manejarBusquedaFiltroGlobal()
                        }
                    }}
                    placeholder={intl.formatMessage({ id: 'Buscar por palabra clave' })} />
            </span>
            <Button className="p-button p-component mr-2 ml-2" type="button" icon="pi pi-search" label={intl.formatMessage({ id: 'Buscar' })} onClick={manejarBusquedaFiltroGlobal}>

            </Button>
            <Button type="button" icon="pi pi-filter-slash" label={intl.formatMessage({ id: 'Limpiar filtros' })} outlined onClick={limpiarFiltros} />
        </div>
    </div>
};

{/* B O T O N E S - D E - L A S - M O D A L E S */ }
const dialogFooter = (ocultarDialog, guardar) => {
    const intl = useIntl()
    return (
        <>
            <Button
                label={intl.formatMessage({ id: 'Cancelar' }).toUpperCase()}
                icon="pi pi-times"
                text
                onClick={ocultarDialog}
            />
            <Button
                label={intl.formatMessage({ id: 'Guardar' }).toUpperCase()}
                icon="pi pi-check"
                text
                onClick={guardar}
            />
        </>
    )
};

const EliminarDialog = ({ visible, ocultarEliminarDialog, eliminarRegisrtro, tabla, nombreAMostrar }) => {
    const intl = useIntl()
    return (
        <Dialog
            visible={visible}
            style={{ width: "450px" }}
            header={`${intl.formatMessage({ id: '¿Eliminar' })} ${nombreAMostrar}?`}
            modal
            footer={
                <>
                    <Button
                        label={intl.formatMessage({ id: 'NO' })}
                        icon="pi pi-times"
                        text
                        onClick={ocultarEliminarDialog}
                    />
                    <Button
                        label={intl.formatMessage({ id: 'SI' })}
                        icon="pi pi-check"
                        text
                        onClick={eliminarRegisrtro}
                    />
                </>
            }
            onHide={ocultarEliminarDialog}
        >
            <div className="flex align-items-center justify-content-center">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {tabla && (
                    <span>

                        {intl.formatMessage({ id: '¿Esta seguro de que desea eliminar el siguiente registro' })}: {" "}
                        <b>{tabla.nombre}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    )
};

const filtroActivoSnTemplate = (options, opcionesActivoSn, opcionesActivoSnTemplate) => {
    const intl = useIntl()
    return (
        <Dropdown
            value={options.value}
            options={opcionesActivoSn}
            onChange={(e) => {
                options.filterCallback(e.value, options.index);
            }}
            itemTemplate={opcionesActivoSnTemplate}
            placeholder={intl.formatMessage({ id: 'Opciones' })}
            className="p-column-filter"
            showClear
        />
    );
};

const formatearBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
};

const opcionesActivoSnTemplate = (option, obtenerSeverity) => {
    return <Badge value={option} severity={obtenerSeverity(option)} />;
};
/**
 * Genera y descarga un archivo CSV.
 * @param {Array} registros - Los datos a incluir en el archivo CSV.
 * @param {Array} encabezados - Los encabezados para las columnas del CSV.
 * @param {string} nombreArchivo - Nombre del archivo CSV a descargar.
 */
const generarYDescargarCSV = (registros, encabezados, nombreArchivo) => {
    try {
        const csv = parse(registros, { fields: encabezados, header: true });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el archivo CSV:', error);
        throw error;
    }
};

/**
 * Prepara los registros para exportarlos como CSV.
 * @param {Array} registros - Los registros originales.
 * @param {Array} columnas - Las columnas a incluir en el CSV.
 * @param {Function} [procesarDatosParaCSV] - Función opcional para transformar los datos.
 * @returns {Array} Registros transformados.
 */
const prepararRegistrosParaCSV = async (registros, columnas, procesarDatosParaCSV) => {
    if (procesarDatosParaCSV) {
        const resultados = await procesarDatosParaCSV(registros);
        return resultados
    } else {
        return registros.map(record => {
            const registroTransformado = {};
            columnas.forEach(columna => {
                registroTransformado[columna.header] = record[columna.campo];
            });
            return registroTransformado;
        });
    }
};

// Función para obtener el idioma desde localStorage
const getIdiomaDefecto = () => {
    if (typeof localStorage === 'undefined') {
        return 'es'; // Idioma por defecto si localStorage no está disponible
    }
    let idioma = localStorage.getItem('idioma');
    if (!idioma) {
        idioma = 'es'; // Idioma por defecto
        localStorage.setItem('idioma', idioma);
    }
    return idioma;
};

const descargarCSV = async (registros = [], columnas, procesarDatosParaCSV, getRegistros, setDescargarCSVDialog, nombreArchivo) => {
    try {
        let registrosTransformados = [];
        let archivoNombre;
        let registrosAdescargar = [];
        if (registros.length > 0) {
            registrosAdescargar = registros
            archivoNombre = `${nombreArchivo}-mostrados.csv`;
        } else {
            registrosAdescargar = await getRegistros(JSON.stringify({}));
            archivoNombre = `${nombreArchivo}-todos.csv`;
        }

        registrosTransformados = await Promise.resolve(
            prepararRegistrosParaCSV(registrosAdescargar, columnas, procesarDatosParaCSV)
        );

        const encabezados = Object.keys(registrosTransformados[0] || {});
        generarYDescargarCSV(registrosTransformados, encabezados, archivoNombre);
    } catch (err) {
        console.error('Error al descargar los registros:', err);
    }
    setDescargarCSVDialog(false);
};

const DescargarCSVDialog = ({
    visible,
    onHide,
    header = intl.formatMessage({ id: 'Descargar archivo CSV' }),
    labelMostrados = intl.formatMessage({ id: 'Registros mostrados' }),
    labelTodos = intl.formatMessage({ id: 'Todos los registros' }),
    registros,
    getRegistros,
    setDescargarCSVDialog,
    nombreArchivo,
    procesarDatosParaCSV,
    columnas
}) => {
    const footer = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button
                label={labelMostrados}
                icon="pi pi-download"
                text
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => descargarCSV(registros, columnas, procesarDatosParaCSV, getRegistros, setDescargarCSVDialog, nombreArchivo)}
            />
            <Button
                label={labelTodos}
                icon="pi pi-download"
                text
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => descargarCSV([], columnas, procesarDatosParaCSV, getRegistros, setDescargarCSVDialog, nombreArchivo)}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: "450px" }}
            header={header}
            modal
            footer={footer}
            onHide={onHide}
        >
        </Dialog>
    );
};

const ImportarCSVPalletsDialog = ({
    visible,
    onHide,
    header = 'Importar archivo CSV',
    labelSeleccionar = 'Seleccionar archivo',
    labelProcesar = 'Procesar archivo',
    onCSVProcessed = null,
    empresaId = null
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [processResults, setProcessResults] = useState({ created: 0, updated: 0, errors: [] });
    const fileInputRef = useRef(null);
    const toast = useRef(null);

    // Función para parsear una línea de CSV a objeto Pallet
    const parseCSVLineToPallet = (line, lineIndex) => {
        try {
            // Dividir la línea por comas, manejando comillas
            const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
            
            if (fields.length < 4) {
                throw new Error(`Línea ${lineIndex + 1}: No tiene suficientes columnas (mínimo 4: código, alias, modelo, medidas)`);
            }

            const palletData = {
                empresaId: empresaId,
                codigo: fields[0] || '',
                alias: fields[1] || '',
                modelo: fields[2] || '',
                medidas: fields[3] || '',
                periodoEnvioMail: fields[4] ? parseInt(fields[4]) || 24 : 24,
                fechaImpresion: fields[5] || new Date().toISOString()
            };

            // Validaciones básicas
            if (!palletData.codigo) {
                throw new Error(`Línea ${lineIndex + 1}: Código es obligatorio`);
            }
            if (!palletData.alias) {
                throw new Error(`Línea ${lineIndex + 1}: Alias es obligatorio`);
            }
            if (!empresaId) {
                throw new Error(`Línea ${lineIndex + 1}: ID de empresa no proporcionado`);
            }

            return palletData;
        } catch (error) {
            throw error;
        }
    };

    // Función para validar si el archivo es CSV
    const isCSVFile = (file) => {
        // Verificar extensión
        const fileName = file.name.toLowerCase();
        const hasCSVExtension = fileName.endsWith('.csv');
        
        // Verificar tipo MIME (algunos navegadores pueden no detectarlo correctamente)
        const hasCSVMimeType = file.type === 'text/csv' || 
                               file.type === 'application/csv' || 
                               file.type === 'text/plain' ||
                               file.type === '';
        
        return hasCSVExtension && hasCSVMimeType;
    };

    // Función para leer y procesar el archivo CSV
    const readCSVFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                    resolve(lines);
                } catch (error) {
                    reject(new Error('Error al leer el archivo: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };
            
            reader.readAsText(file, 'UTF-8');
        });
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            setSelectedFile(null);
            setErrorMessage('');
            setCsvData([]);
            return;
        }

        // Validar que sea un archivo CSV
        if (!isCSVFile(file)) {
            setErrorMessage('Por favor, seleccione un archivo CSV válido');
            setSelectedFile(null);
            setCsvData([]);
            
            // Mostrar toast de error
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error de archivo',
                    detail: 'El archivo seleccionado no es un CSV válido',
                    life: 3000
                });
            }
            return;
        }

        // Validar tamaño del archivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setErrorMessage('El archivo es demasiado grande. Máximo permitido: 10MB');
            setSelectedFile(null);
            setCsvData([]);
            
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error de tamaño',
                    detail: 'El archivo excede el tamaño máximo permitido (10MB)',
                    life: 3000
                });
            }
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
        setCsvData([]);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleProcessFile = async () => {
        if (!selectedFile) {
            return;
        }

        if (!empresaId) {
            setErrorMessage('ID de empresa no proporcionado');
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error de configuración',
                    detail: 'ID de empresa no proporcionado',
                    life: 3000
                });
            }
            return;
        }
        
        setIsProcessing(true);
        setErrorMessage('');
        setProcessResults({ created: 0, updated: 0, errors: [] });
        
        try {
            // Importar la función upsert dinámicamente
            const { upsertPalletFromCSV } = await import('@/app/api-endpoints/pallet');
            
            // Leer y procesar el archivo CSV
            const lines = await readCSVFile(selectedFile);
            
            if (lines.length === 0) {
                throw new Error('El archivo CSV está vacío');
            }

            // Guardar las líneas en el estado
            setCsvData(lines);

            let dataLines = lines;
            let startIndex = 0;

            // Verificar si la primera línea es un header y saltarla
            const firstLine = lines[0].toLowerCase();
            if (firstLine.includes('codigo') || firstLine.includes('alias') || 
                firstLine.includes('empresa') || firstLine.includes('modelo')) {
                startIndex = 1;
                dataLines = lines.slice(1);
            }

            if (dataLines.length === 0) {
                throw new Error('No hay datos para procesar (solo header encontrado)');
            }

            const results = { created: 0, updated: 0, errors: [] };

            // Procesar cada línea del CSV
            for (let i = 0; i < dataLines.length; i++) {
                const line = dataLines[i];
                const lineNumber = startIndex + i + 1;

                try {
                    // Convertir línea a objeto pallet
                    const palletData = parseCSVLineToPallet(line, i + startIndex);
                    
                    // Enviar al backend para insertar o actualizar
                    const result = await upsertPalletFromCSV(palletData);
                    
                    if (result.action === 'created') {
                        results.created++;
                    } else if (result.action === 'updated') {
                        results.updated++;
                    }

                    console.log(`Línea ${lineNumber}: ${result.action} - ${palletData.codigo}`);
                    
                } catch (error) {
                    const errorMsg = `Línea ${lineNumber}: ${error.message}`;
                    results.errors.push(errorMsg);
                    console.error(errorMsg, error);
                }
            }

            setProcessResults(results);

            // Mostrar mensaje de éxito
            const totalProcessed = results.created + results.updated;
            if (toast.current) {
                if (results.errors.length === 0) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Procesamiento completado',
                        detail: `${totalProcessed} registros procesados: ${results.created} creados, ${results.updated} actualizados`,
                        life: 5000
                    });
                } else {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Procesamiento completado con errores',
                        detail: `${totalProcessed} registros procesados, ${results.errors.length} errores`,
                        life: 5000
                    });
                }
            }

            // Llamar callback si se proporciona
            if (onCSVProcessed) {
                onCSVProcessed(results);
            }
            
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            setErrorMessage(error.message);
            setCsvData([]);
            
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error de procesamiento',
                    detail: error.message,
                    life: 3000
                });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleHide = () => {
        setSelectedFile(null);
        setIsProcessing(false);
        setErrorMessage('');
        setCsvData([]);
        setProcessResults({ created: 0, updated: 0, errors: [] });
        onHide();
    };

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button
                label={labelSeleccionar}
                icon="pi pi-upload"
                text
                style={{ whiteSpace: 'nowrap' }}
                onClick={handleFileUpload}
                disabled={isProcessing}
            />
            <Button
                label={labelProcesar}
                icon="pi pi-cog"
                text
                style={{ whiteSpace: 'nowrap' }}
                onClick={handleProcessFile}
                disabled={!selectedFile || isProcessing}
                loading={isProcessing}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: "500px" }}
            header={header}
            modal
            footer={footer}
            onHide={handleHide}
        >
            <Toast ref={toast} />
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                
                {/* Mensaje de error */}
                {errorMessage && (
                    <div style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        <i className="pi pi-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                        {errorMessage}
                    </div>
                )}

                {/* Estado del archivo */}
                {selectedFile ? (
                    <div>
                        <i className="pi pi-file" style={{ fontSize: '3rem', color: '#4caf50', marginBottom: '10px' }}></i>
                        <p style={{ fontSize: '16px', margin: '10px 0' }}>
                            Archivo seleccionado: <strong>{selectedFile.name}</strong>
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                            Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        
                        {/* Información del procesamiento */}
                        {csvData.length > 0 && !isProcessing && (
                            <div>
                                <div style={{ 
                                    backgroundColor: '#e8f5e8', 
                                    color: '#2e7d32', 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    fontSize: '14px',
                                    marginTop: '10px'
                                }}>
                                    <i className="pi pi-check-circle" style={{ marginRight: '8px' }}></i>
                                    Archivo leído exitosamente: {csvData.length} líneas encontradas
                                </div>
                                
                                {/* Resultados del procesamiento */}
                                {(processResults.created > 0 || processResults.updated > 0 || processResults.errors.length > 0) && (
                                    <div style={{ marginTop: '15px' }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Resultados del Procesamiento:</h4>
                                        
                                        {/* Estadísticas */}
                                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>
                                                    {processResults.created}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Creados</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
                                                    {processResults.updated}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Actualizados</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>
                                                    {processResults.errors.length}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Errores</div>
                                            </div>
                                        </div>
                                        
                                        {/* Lista de errores */}
                                        {processResults.errors.length > 0 && (
                                            <div style={{
                                                backgroundColor: '#ffebee',
                                                border: '1px solid #ffcdd2',
                                                borderRadius: '4px',
                                                padding: '10px',
                                                marginTop: '10px',
                                                textAlign: 'left',
                                                maxHeight: '150px',
                                                overflowY: 'auto'
                                            }}>
                                                <div style={{ fontWeight: 'bold', color: '#c62828', marginBottom: '5px' }}>
                                                    Errores encontrados:
                                                </div>
                                                {processResults.errors.map((error, index) => (
                                                    <div key={index} style={{ fontSize: '12px', color: '#c62828', marginBottom: '3px' }}>
                                                        • {error}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <i className="pi pi-cloud-upload" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '10px' }}></i>
                        <p style={{ fontSize: '16px', color: '#666' }}>
                            Seleccione un archivo CSV para procesar
                        </p>
                        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                            Formatos soportados: .csv (máximo 10MB)
                        </p>
                    </div>
                )}

                {/* Estado de procesamiento */}
                {isProcessing && (
                    <div style={{ 
                        backgroundColor: '#fff3e0', 
                        color: '#ef6c00', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginTop: '15px',
                        fontSize: '14px'
                    }}>
                        <i className="pi pi-spinner pi-spin" style={{ marginRight: '8px' }}></i>
                        Procesando archivo...
                    </div>
                )}
            </div>
        </Dialog>
    );
};

const GenerarGraficoDialog = ({
    visible,
    onHide,
    header = 'Gráfico de Datos',
    registros,
    columnas
}) => {
    // Procesar los datos para el gráfico
    const procesarDatosPorSensor = () => {
        console.log('Registros recibidos en GenerarGraficoDialog:', registros);
        if (!registros || registros.length === 0) {
            console.log('No hay registros o la longitud es 0');
            return [];
        }

        // Agrupar registros por sensor
        const datosPorSensor = {};

        registros.forEach(registro => {
            const sensor = registro.nombreSensor || 'Sin sensor';
            const valor = registro.valor;

            // Usar fechaEspanol si existe, sino formatear fecha
            let fecha;
            if (registro.fechaEspanol) {
                fecha = registro.fechaEspanol;
            } else if (registro.fecha) {
                const fechaObj = new Date(registro.fecha);
                fecha = `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}/${fechaObj.getFullYear()} ${fechaObj.getHours().toString().padStart(2, '0')}:${fechaObj.getMinutes().toString().padStart(2, '0')}`;
            } else {
                fecha = 'Sin fecha';
            }

            if (!datosPorSensor[sensor]) {
                datosPorSensor[sensor] = {
                    nombre: sensor,
                    fechas: [],
                    valores: []
                };
            }

            datosPorSensor[sensor].fechas.push(fecha);
            datosPorSensor[sensor].valores.push(valor);
        });

        return Object.values(datosPorSensor);
    };

    const crearGraficoSensor = (datosSensor, color) => {
        // Detectar si los valores son numéricos
        const valorNumerico = parseFloat(datosSensor.valores[0]);
        const esNumerico = !isNaN(valorNumerico);

        const parseDate = (str) => {
            if (!str || str === 'Sin fecha') return null;

            // Manejar formato "DD/MM/YYYY HH:MM:SS" o "DD/MM/YYYY HH:MM" o "DD/MM/YYYY, HH:MM:SS" o "DD/MM/YYYY"
            const parts = str.includes(', ') ? str.split(', ') : str.split(' ');

            const datePart = parts[0];
            const timePart = parts[1] || '00:00'; // Si no hay hora, usar 00:00

            const [day, month, year] = datePart.split('/');
            const timeComponents = timePart.split(':');
            const hour = timeComponents[0] || '00';
            const minute = timeComponents[1] || '00';

            if (!day || !month || !year) return null;

            return new Date(year, month - 1, day, hour, minute);
        };

        if (esNumerico) {
            // Gráfico de línea/barras para valores numéricos
            const valores = datosSensor.valores.map(v => parseFloat(v));

            // Ordenar por fecha
            const datosOrdenados = datosSensor.fechas.map((fecha, i) => ({
                fecha,
                valor: valores[i],
                fechaObj: fecha
            }))
            .filter(d => d.fechaObj !== null)
            .sort((a, b) => a.fechaObj - b.fechaObj);

            const data = {
                labels: datosOrdenados.map(d => d.fecha),
                datasets: [{
                    label: datosSensor.nombre,
                    data: datosOrdenados.map(d => d.valor),
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    borderWidth: 2,
                    tension: 0.4,
                }]
            };

            const options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `${datosSensor.nombre} - Evolución`,
                    },
                },
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        display: true,
                        beginAtZero: true
                    }
                }
            };

            return <Bar data={data} options={options} />;
        } else {
            // Para sensores categóricos, mostrar evolución temporal también
            const datosOrdenados = datosSensor.fechas.map((fecha, i) => ({
                fecha,
                valor: datosSensor.valores[i],
                fechaObj: parseDate(fecha)
            }))
            .filter(d => d.fechaObj !== null)
            .sort((a, b) => a.fechaObj - b.fechaObj);

            // Convertir valores categóricos a números para el gráfico
            const valoresUnicos = [...new Set(datosOrdenados.map(d => d.valor))];
            const valorANumero = {};
            valoresUnicos.forEach((val, idx) => {
                valorANumero[val] = idx + 1;
            });

            const data = {
                labels: datosOrdenados.map(d => d.fecha),
                datasets: [{
                    label: datosSensor.nombre,
                    data: datosOrdenados.map(d => valorANumero[d.valor]),
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    borderWidth: 2,
                    tension: 0.4,
                }]
            };

            const options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `${datosSensor.nombre} - Estados en el Tiempo`,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valorOriginal = datosOrdenados[context.dataIndex].valor;
                                return `${datosSensor.nombre}: ${valorOriginal}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const valorTexto = Object.keys(valorANumero).find(k => valorANumero[k] === value);
                                return valorTexto || value;
                            }
                        }
                    }
                }
            };

            return <Bar data={data} options={options} />;
        }
    };

    const colores = [
        { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
        { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
        { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
        { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
        { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
        { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
        { bg: 'rgba(199, 199, 199, 0.6)', border: 'rgba(199, 199, 199, 1)' },
        { bg: 'rgba(83, 102, 255, 0.6)', border: 'rgba(83, 102, 255, 1)' },
        { bg: 'rgba(255, 99, 255, 0.6)', border: 'rgba(255, 99, 255, 1)' },
        { bg: 'rgba(99, 255, 132, 0.6)', border: 'rgba(99, 255, 132, 1)' },
    ];

    const sensores = procesarDatosPorSensor();

    return (
        <Dialog
            visible={visible}
            style={{ width: "95vw", maxWidth: "1400px" }}
            header={header}
            modal
            onHide={onHide}
        >
            <div style={{ padding: "20px" }}>
                {sensores.length > 0 ? (
                    <TabView>
                        {sensores.map((sensor, index) => (
                            <TabPanel key={sensor.nombre} header={sensor.nombre}>
                                <div style={{ height: "500px", padding: "20px" }}>
                                    {crearGraficoSensor(sensor, colores[index % colores.length])}
                                </div>
                            </TabPanel>
                        ))}
                    </TabView>
                ) : (
                    <p>No hay datos disponibles para mostrar</p>
                )}
            </div>
        </Dialog>
    );
};


export {
    comprobarImagen, manejarCambioImagen, templateGenerico, ErrorDetail,
    botonesDeAccionTemplate, eliminarDialogFooter, Header, dialogFooter,
    EliminarDialog, filtroActivoSnTemplate, opcionesActivoSnTemplate,
    generarYDescargarCSV, prepararRegistrosParaCSV, DescargarCSVDialog, ImportarCSVPalletsDialog,
    GenerarGraficoDialog, formatearBytes, esUrlImagen, getIdiomaDefecto, tieneUsuarioPermiso,
    obtenerTodosLosPermisos,

};