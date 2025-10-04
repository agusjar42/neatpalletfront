import React, { useState, useRef } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { FileUpload } from "primereact/fileupload";
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { convertirArchivoABase64 } from "@/app/utility/Utils";

const EditarDatosEnvioContenido = ({ envioContenido, setEnvioContenido, estadoGuardando, envios, estoyDentroDeUnTab }) => {
    const intl = useIntl();
    const toast = useRef(null);
    
    // Estados para los previews
    const [previewFotoProducto, setPreviewFotoProducto] = useState(null);
    const [previewFotoPallet, setPreviewFotoPallet] = useState(null);
    const [fotoProductoInputRef, setFotoProductoInputRef] = useState(null);
    const [fotoPalletInputRef, setFotoPalletInputRef] = useState(null);
    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));


    const onSelectFotoProducto = async (e) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            
            // Validar el tamaño del archivo (2MB = 2 * 1024 * 1024 bytes)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'La imagen no puede ser mayor a 2 MB' }),
                    life: 3000,
                });
                return;
            }
            
            try {
                const base64 = await convertirArchivoABase64(file);
                setPreviewFotoProducto(base64);
                
                // Guardamos el base64 en el estado
                setEnvioContenido({ 
                    ...envioContenido, 
                    fotoProductoBase64: base64,
                    fotoProductoNombre: file.name,
                    fotoProductoTipo: file.type
                });
            } catch (error) {
                console.error('Error convirtiendo archivo a base64:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'Error procesando la imagen' }),
                    life: 3000,
                });
            }
        }
    };

    const onSelectFotoPallet = async (e) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            
            // Validar el tamaño del archivo (2MB = 2 * 1024 * 1024 bytes)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'La imagen no puede ser mayor a 2 MB' }),
                    life: 3000,
                });
                return;
            }
            
            try {
                const base64 = await convertirArchivoABase64(file);
                setPreviewFotoPallet(base64);
                
                // Guardamos el base64 en el estado
                setEnvioContenido({ 
                    ...envioContenido, 
                    fotoPalletBase64: base64,
                    fotoPalletNombre: file.name,
                    fotoPalletTipo: file.type
                });
            } catch (error) {
                console.error('Error convirtiendo archivo a base64:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'Error procesando la imagen' }),
                    life: 3000,
                });
            }
        }
    };

    const limpiarFotoProducto = () => {
        setPreviewFotoProducto(null);
        setEnvioContenido({
            ...envioContenido,
            fotoProductoBase64: null,
            fotoProductoNombre: null,
            fotoProductoTipo: null
        });
    };

    const limpiarFotoPallet = () => {
        setPreviewFotoPallet(null);
        setEnvioContenido({
            ...envioContenido,
            fotoPalletBase64: null,
            fotoPalletNombre: null,
            fotoPalletTipo: null
        });
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el contenido' })}>
            <Toast ref={toast} position="top-right" />
            <div className="formgrid grid">
                {!estoyDentroDeUnTab && (<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Origen Ruta' })}*</b></label>
                    <Dropdown value={envioContenido.envioId || ""}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioContenido.envioId == null || envioContenido.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>)}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="producto">{intl.formatMessage({ id: 'Producto' })}</label>
                    <InputText value={envioContenido.producto || ''}
                        placeholder={intl.formatMessage({ id: 'Nombre del producto' })}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, producto: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="referencia">{intl.formatMessage({ id: 'Referencia' })}</label>
                    <InputText value={envioContenido.referencia || ''}
                        placeholder={intl.formatMessage({ id: 'Referencia del producto' })}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, referencia: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="pesoKgs">{intl.formatMessage({ id: 'Peso (Kg)' })}</label>
                    <InputNumber value={envioContenido.pesoKgs}
                        placeholder={intl.formatMessage({ id: 'Peso en kilogramos' })}
                        onValueChange={(e) => setEnvioContenido({ ...envioContenido, pesoKgs: e.value })}
                        minFractionDigits={2} maxFractionDigits={2} min={0}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="pesoTotal">{intl.formatMessage({ id: 'Peso Total (Kg)' })}</label>
                    <InputNumber value={envioContenido.pesoTotal}
                        placeholder={intl.formatMessage({ id: 'Peso total en kilogramos' })}
                        onValueChange={(e) => setEnvioContenido({ ...envioContenido, pesoTotal: e.value })}
                        minFractionDigits={2} maxFractionDigits={2} min={0}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="medidas">{intl.formatMessage({ id: 'Medidas' })}</label>
                    <InputText value={envioContenido.medidas || ''}
                        placeholder={intl.formatMessage({ id: 'Medidas del producto' })}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, medidas: e.target.value })}
                        maxLength={50} />
                </div>

                {/* Campos de rutas para mostrar las imágenes guardadas */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fotoProducto" className="pb-2">{intl.formatMessage({ id: 'Foto del producto' })}</label>
                    {envioContenido.fotoProducto && (
                        <Image
                            src={envioContenido.fotoProducto}
                            alt="Foto del Producto"
                            width="200"
                            preview
                        />
                    )}
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectFotoProducto({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={(ref) => setFotoProductoInputRef(ref)}
                    />
                    <Button
                        label="Cambiar foto por:"
                        icon="pi pi-upload"
                        className="p-button-outlined"
                        onClick={() => fotoProductoInputRef?.click()}
                    />
                    
                    {previewFotoProducto && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">
                                    Imagen seleccionada: {envioContenido.fotoProductoNombre}
                                </small>
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarFotoProducto}
                                    tooltip="Quitar imagen"
                                />
                            </div>
                            <Image 
                                src={previewFotoProducto} 
                                alt="Preview producto" 
                                width="200" 
                                preview 
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fotoPallet" className="pb-2">{intl.formatMessage({ id: 'Foto del pallet' })}</label>
                    {envioContenido.fotoPallet && (
                        <Image
                            src={envioContenido.fotoPallet}
                            alt="Foto del pallet"
                            width="200"
                            preview
                        />
                    )}
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectFotoPallet({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={(ref) => setFotoPalletInputRef(ref)}
                    />
                    <Button
                        label="Cambiar foto por:"
                        icon="pi pi-upload"
                        className="p-button-outlined"
                        onClick={() => fotoPalletInputRef?.click()}
                    />

                    {previewFotoPallet && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">
                                    Imagen seleccionada: {envioContenido.fotoPalletNombre}
                                </small>
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarFotoPallet}
                                    tooltip="Quitar imagen"
                                />
                            </div>
                            <Image 
                                src={previewFotoPallet} 
                                alt="Preview pallet" 
                                width="200" 
                                preview 
                            />
                        </div>
                    )}
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioContenido;