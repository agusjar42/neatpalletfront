import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useState, useRef } from "react";
import { Password } from "primereact/password";
import { useIntl } from 'react-intl'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { convertirArchivoABase64 } from "@/app/utility/Utils";
const EditarDatosEmpresa = ({ empresa, setEmpresa, estadoGuardando }) => {
    const intl = useIntl()
    const toast = useRef(null);
    
    // Estados para el preview de las imágenes
    const [previewImagen, setPreviewImagen] = useState(empresa.imagenBase64 || null);
    const [previewLogo, setPreviewLogo] = useState(empresa.logoBase64 || null);
    const [imagenInputRef, setImagenInputRef] = useState(null);
    const [logoInputRef, setLogoInputRef] = useState(null);

    // Función para manejar la selección de la imagen
    const onSelectImagen = async (e) => {
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
                setPreviewImagen(base64);
                
                // Guardamos el base64 en el estado de la empresa
                setEmpresa({ 
                    ...empresa, 
                    imagenBase64: base64,
                    imagenNombre: file.name,
                    imagenTipo: file.type
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

    // Función para manejar la selección del logo
    const onSelectLogo = async (e) => {
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
                setPreviewLogo(base64);
                
                // Guardamos el base64 en el estado de la empresa
                setEmpresa({ 
                    ...empresa, 
                    logoBase64: base64,
                    logoNombre: file.name,
                    logoTipo: file.type
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

    // Función para limpiar la imagen
    const limpiarImagen = () => {
        setPreviewImagen(null);
        setEmpresa({ 
            ...empresa, 
            imagenBase64: null,
            imagenNombre: null,
            imagenTipo: null
        });
    };

    // Función para limpiar el logo
    const limpiarLogo = () => {
        setPreviewLogo(null);
        setEmpresa({ 
            ...empresa, 
            logoBase64: null,
            logoNombre: null,
            logoTipo: null
        });
    };

    const manejarCambioInputNumber = (e, nombreInput) => {
        let valor = e.value || 0;
        //Evitamos que el valor sea mayor al maximo permitido, por algun motivo el maximo no se aplica en el input si se escriben muchos numeros de golpe
        const maximo = parseInt(e.originalEvent.target.max)
        if(valor > maximo){
            valor = maximo;
            e.originalEvent.target.value = maximo.toLocaleString('es-ES');
        }
        let _empresa = { ...empresa };
        _empresa[`${nombreInput}`] = valor;
        setEmpresa(_empresa);
    };

    const manejarFocusInputNumber = (e) => {
        if (e.target.value === '0') {
            e.target.value = "";
        }
    };

    const manejarBlurInputNumber = (e) => {
        if (e.target.value === '') {
            e.target.value = 0;
        }
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la empresa' })}>
            <Toast ref={toast} position="top-right" />
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaOrden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={empresa.orden}
                        placeholder={intl.formatMessage({ id: 'Orden de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, orden: e.value })}
                        className={`${(estadoGuardando && (empresa.orden === "" || empresa.orden === null || empresa.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaCodigo"><b>{intl.formatMessage({ id: 'Código' })}*</b></label>
                    <InputText value={empresa.codigo}
                        placeholder={intl.formatMessage({ id: 'Código de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, codigo: e.target.value })}
                        className={`${(estadoGuardando && empresa.codigo === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={20} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaNombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={empresa.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                        className={`${(estadoGuardando && empresa.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50} />
                </div>                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email"><b>{intl.formatMessage({ id: 'Email' })}*</b></label>
                    <InputText value={empresa.email}
                        placeholder={intl.formatMessage({ id: 'Email de la empresa' })}
                        autoComplete='off'
                        onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                        //className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={120} />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Dirección de la cuenta de email que se va a usar para enviar correos automatizados' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Contraseña del email' })}</label>
                    <Password
                        value={empresa.password}
                        id="password"
                        //className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        type="text"
                        onChange={(e) => setEmpresa({ ...empresa, password: e.target.value })}
                        placeholder={intl.formatMessage({ id: 'Contraseña del email' })}
                        toggleMask
                        autoComplete="new-password" //Pone new password en vez de off y si que funciona, 0 idea de como o porque
                        inputClassName="w-full"
                        feedback={false}
                        maxLength={100}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Contraseña de la cuenta de email que se va a usar para enviar correos automatizados' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Servicio de email' })}</label>
                    <InputText value={empresa.servicio}
                        placeholder={intl.formatMessage({ id: 'Servicio de email' })}
                        autoComplete='off'
                        onChange={(e) => setEmpresa({ ...empresa, servicio: e.target.value })}
                        //className={`${(estadoGuardando && (empresa.servicio === "" || empresa.servicio === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={45}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'El servicio que utiliza la cuenta de email, ejemplo: "smtp.gmail.com"' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tiempoInactividad" className="block">{intl.formatMessage({ id: 'Minutos de inactividad' })}</label>
                    <InputNumber
                        id="tiempoInactividad"
                        value={empresa.tiempoInactividad || 0 }
                        onChange={(e) => manejarCambioInputNumber(e, "tiempoInactividad")}
                        onFocus={manejarFocusInputNumber}
                        onBlur={manejarBlurInputNumber}
                        maxFractionDigits={0}
                        min={0}
                        max={99999999}
                        inputStyle={{ textAlign: 'right' }}
                        //className={`${(estadoGuardando && gastoCancelacion.diasParaEvento === "") ? "p-invalid" : ""}`}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'La cantidad de tiempo en minutos que tardará en cerrar la sesión por inactividad al usuario' })}</i> </small>
                </div>

                {/* Sección de la Imagen - Imagen actual */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="imagen" className="pb-2">{intl.formatMessage({ id: 'Imagen' })}</label>
                    {empresa.imagen && (
                        <Image
                            src={empresa.imagen}
                            alt="Imagen de la empresa"
                            width="150"
                            height="150"
                            className="border-round"
                            preview
                        />
                    )}   
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectImagen({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={(ref) => setImagenInputRef(ref)}
                    />
                    <Button
                        label="Cambiar imagen por:"
                        icon="pi pi-upload"
                        className="p-button-outlined"
                        onClick={() => imagenInputRef?.click()}
                    />
                    
                    {previewImagen && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">
                                    Imagen seleccionada: {empresa.imagenNombre}
                                </small>
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarImagen}
                                    tooltip="Quitar imagen"
                                />
                            </div>
                            <div className="flex justify-content-center">
                                <Image 
                                    src={previewImagen} 
                                    alt="Preview imagen" 
                                    width="200" 
                                    height="200"
                                    className="border-round"
                                    preview 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección del Logo - Logo actual */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="logo" className="pb-2">{intl.formatMessage({ id: 'Logo' })}</label>
                    {empresa.logo && (
                        <Image
                            src={empresa.logo}
                            alt="Logo de la empresa"
                            width="150"
                            height="150"
                            className="border-round"
                            preview
                        />
                    )}   
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectLogo({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={(ref) => setLogoInputRef(ref)}
                    />
                    <Button
                        label="Cambiar logo por:"
                        icon="pi pi-upload"
                        className="p-button-outlined"
                        onClick={() => logoInputRef?.click()}
                    />
                    
                    {previewLogo && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">
                                    Logo seleccionado: {empresa.logoNombre}
                                </small>
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarLogo}
                                    tooltip="Quitar logo"
                                />
                            </div>
                            <div className="flex justify-content-center">
                                <Image 
                                    src={previewLogo} 
                                    alt="Preview logo" 
                                    width="200" 
                                    height="200"
                                    className="border-round"
                                    preview 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-12">
                <label htmlFor="descripcion">{intl.formatMessage({ id: 'Descripción' })}</label>
                <InputTextarea value={empresa.descripcion} autoreresize
                    placeholder={intl.formatMessage({ id: 'Descripción de la empresa' })}
                    onChange={(e) => setEmpresa({ ...empresa, descripcion: e.target.value })}
                    //className={`${(estadoGuardando && empresa.descripcion === "") ? "p-invalid" : ""}`}
                    rows={5} cols={30} maxLength={500} />
            </div>
        </Fieldset>
    );
};

export default EditarDatosEmpresa;