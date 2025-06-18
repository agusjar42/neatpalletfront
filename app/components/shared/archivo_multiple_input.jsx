import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { esUrlImagen, formatearBytes } from "@/app/components/shared/componentes";
import { devuelveBasePath } from "@/app/utility/Utils"
import { useIntl } from "react-intl";
const ArchivoMultipleInput = ({ registro, setRegistro, campoNombre, archivoTipo, espacioMaximo }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const [totalEspacio, setTotalEspacio] = useState(0);
    const subidaArchivosRef = useRef(null);
    const [cargarUrlImagenes, setCargarUrlImagenes] = useState(true);

    // Convertir la URL de la imagen en un Blob y cargarlo en el componente
    const cargarArchivoDesdeUrl = async (url, name) => {
        const respuesta = await fetch(url);
        const blob = await respuesta.blob();
        const archivo = new File([blob], name, { type: blob.type });
        if ((archivo.type).includes('image/')) {
            archivo.objectURL = URL.createObjectURL(archivo); // Generar la URL manualmente
        }
        // Simulamos que el archivo se cargó en el componente
        if (subidaArchivosRef.current) {
            const archivosExistentes = subidaArchivosRef.current.getFiles();
            const archivosActualizados = [...archivosExistentes, archivo];
            // Establece los archivos actualizados
            subidaArchivosRef.current.setFiles(archivosActualizados);
            setTotalEspacio(getTotalEspacioActual(archivosActualizados));
        }

    };

    useEffect(() => {
        if (registro[campoNombre] && registro[campoNombre].length > 0 && registro.id > 0) {
            //If para que solo se carguen las imagenes 1 vez
            if (cargarUrlImagenes) {
                cargarImagenesRegistro();
            }
        }
        //El use effect se actualiza cuando el registro se termine de cargar con sus datos, porque la primera carga de todas
        //siempre recibe el registro vacio y luego con los datos
    }, [registro.id]);

    // 2. NUEVO useEffect: si el registro no tiene archivos, limpiar FileUpload y espacio
    useEffect(() => {
        const archivosEnRegistro = registro[campoNombre] || [];
        if (Array.isArray(archivosEnRegistro) && archivosEnRegistro.length === 0) {
            // Vaciar totalEspacio
            setTotalEspacio(0);
            setCargarUrlImagenes(true)
            // Si el FileUpload está montado, limpiamos sus archivos internos
            if (subidaArchivosRef.current) {
                // PrimeReact FileUpload tiene el método clear() que borra todos los archivos
                // Si la versión que usas no tiene clear(), puedes usar setFiles([])
                if (typeof subidaArchivosRef.current.clear === 'function') {
                    subidaArchivosRef.current.clear();
                } else if (typeof subidaArchivosRef.current.setFiles === 'function') {
                    subidaArchivosRef.current.setFiles([]);
                }
            }
        }
    }, [registro[campoNombre]]);

    //Trozo del codigo del useEffect que se ha extraido hacia una funcion asincrona para que no hayan problemas de tiempos de ejecucion
    const cargarImagenesRegistro = async () => {
        for (const archivo of registro[campoNombre]) {
            await cargarArchivoDesdeUrl(`${devuelveBasePath()}${archivo.url}`, archivo.url.split('/').pop())
        }
        setCargarUrlImagenes(false)

    }

    //Guarda el archivo cuando se selecciona
    const customSubidaArchivos = async (event) => {
        await setRegistro({ ...registro, [campoNombre]: event.files });
    };

    //Cuando se selecciona un archivo actualiza el espacio que ocupan por si queremos marcar un limite de tamaño
    const manejarArchivoSeleccionado = (e) => {
        let archivos = e.files;
        const _archivos = [...archivos]
            ;
        //Crea una copia para que se pueda recorrer los archivos sin miedo a que cambie el array con sus modificaciones
        let totalNuevoEspacio = 0;

        //Revisa los archivos insertados
        //Comprueba que los archivos sean imagenes
        for (const archivo of _archivos) {
            let valido = true;
            totalNuevoEspacio += archivo.size || 0;
            if (!archivo.type.includes('image/') && archivoTipo.toLowerCase() === 'imagen') {
                // Notificar al usuario si el tipo de archivo no es valido
                toast.current.show({
                    severity: 'error',
                    summary: 'Archivo invalido',
                    detail: intl.formatMessage({ id: 'Solo se pueden insertar imagenes en el campo' }),
                    life: 3000,
                });
                valido = false
            }
            if (espacioMaximo && totalNuevoEspacio > espacioMaximo) {
                // Notificar al usuario si el tamaño total excede el límite
                toast.current.show({
                    severity: 'error',
                    summary: 'Límite excedido',
                    detail: `${intl.formatMessage({ id: 'El tamaño total de los archivos seleccionados excede el limite de' })} ${formatearBytes(espacioMaximo)}.`,
                    life: 3000,
                });
                valido = false
            }
            if (!valido) {
                //Borra el archivo
                const index = archivos.indexOf(archivo);
                if (index !== -1) {
                    archivos.splice(index, 1);
                }
                totalNuevoEspacio -= archivo.size || 0;

            }

        }
        // Actualizar la lista de archivos en el componente
        if (subidaArchivosRef.current) {
            subidaArchivosRef.current.setFiles(archivos);
        }
        //Acutaliza el total del espacio
        setTotalEspacio(totalNuevoEspacio);
        //return;
        // Si el tamaño es válido, actualizamos el total y los archivos
        //setTotalEspacio(totalNuevoEspacio);
    };

    const getTotalEspacioActual = (archivos) => {
        let _totalEspacio = 0;
        Object.keys(archivos).forEach((key) => {
            _totalEspacio += archivos[key].size || 0;
        });
        return _totalEspacio;
    };

    //Quita el archivo que se ha borrado
    const manejarArchivoBorrado = async (file, callback) => {
        setTotalEspacio(totalEspacio - file.size);
        //callback(); Esta linea no es necesaria pero la he dejado porque es del propio primeReact y puede ser util en un futuro
        //Elimina el archivo del registro
        const archivosExistentes = subidaArchivosRef.current.getFiles();
        archivosExistentes.splice(archivosExistentes.findIndex(obj => obj === file), 1);
        await setRegistro({ ...registro, [campoNombre]: archivosExistentes });

    };

    const headerTemplate = (options) => {
        const { className, chooseButton } = options;
        const progreso = espacioMaximo ? (totalEspacio / espacioMaximo) * 100 : 0;
        const espacioFormateado = formatearBytes(totalEspacio);

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {espacioMaximo && (
                    <div className="flex align-items-center gap-3 ml-auto">
                        <span>{espacioFormateado} / {formatearBytes(espacioMaximo)}</span>
                        <ProgressBar value={progreso} showValue={false} style={{ width: "10rem", height: "12px" }} />
                    </div>
                )}
            </div>
        );
    };

    //Template de como se muestra cada archivo en el componente
    const archivoTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap ">
                <div className=" flex align-items-center flex-wrap col-12 lg:col-8">
                    {file.objectURL && (
                        <img alt={file.name} className="col-12 lg:col-2" role="presentation" src={file.objectURL} width={100} style={{ maxWidth: "300px" }} />
                    )}
                    <span width={100} style={{ wordBreak: "break-word" }} className="text-left lg:ml-3 col-12 lg:col-8">
                        {file.name}
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2 col-12 lg:col-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => manejarArchivoBorrado(file, props.onRemove)} />
            </div>
        );
    };

    //Boton de elegir archivos
    const botonSubida = {
        span: 'pi pi-fw pi-images', className: 'p-button p-component p-fileupload-choose', label: intl.formatMessage({ id: 'Elegir' })
    };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            {/* <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" /> Boton para vaciar todos los archivos*/}

            <FileUpload multiple={true} ref={subidaArchivosRef} name="demo[]" accept={archivoTipo.toLowerCase() === 'imagen' ? "image/*" : "*/*"}
                //maxFileSize={espacioMaximo}  //Propiedad para marcar el tamaño maximo que pueden ocupar los archivos del input en total
                onSelect={manejarArchivoSeleccionado}
                headerTemplate={headerTemplate} itemTemplate={archivoTemplate}
                chooseOptions={botonSubida} customUpload={true}
                uploadHandler={customSubidaArchivos} auto
            />
        </div>
    );
};

export default ArchivoMultipleInput;
