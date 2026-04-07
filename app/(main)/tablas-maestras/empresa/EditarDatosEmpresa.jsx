import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import React, { useState, useRef, useEffect } from "react";
import { useIntl } from 'react-intl'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
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
    const imagenInputRef = useRef(null);
    const logoInputRef = useRef(null);

    useEffect(() => {
        setPreviewImagen(empresa.imagenBase64 || null);
        setPreviewLogo(empresa.logoBase64 || null);
    }, [empresa.id, empresa.imagenBase64, empresa.logoBase64]);

    // Función para manejar la selección de la imagen
    const procesarSeleccionArchivo = async (file, tipo) => {
        if (!file) return;

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
            if (tipo === 'imagen') {
                setPreviewImagen(base64);
                setEmpresa((prevEmpresa) => ({
                    ...prevEmpresa,
                    imagenBase64: base64,
                    imagenNombre: file.name,
                    imagenTipo: file.type
                }));
            } else {
                setPreviewLogo(base64);
                setEmpresa((prevEmpresa) => ({
                    ...prevEmpresa,
                    logoBase64: base64,
                    logoNombre: file.name,
                    logoTipo: file.type
                }));
            }
        } catch (error) {
            console.error('Error convirtiendo archivo a base64:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Error procesando la imagen' }),
                life: 3000,
            });
        }
    };

    const onSelectImagen = async (e) => {
        if (e.target.files && e.target.files[0]) {
            await procesarSeleccionArchivo(e.target.files[0], 'imagen');
        }
    };

    const onSelectLogo = async (e) => {
        if (e.target.files && e.target.files[0]) {
            await procesarSeleccionArchivo(e.target.files[0], 'logo');
        }
    };

    const limpiarImagen = () => {
        setPreviewImagen(null);
        setEmpresa((prevEmpresa) => ({
            ...prevEmpresa,
            imagen: null,
            imagenBase64: null,
            imagenNombre: null,
            imagenTipo: null
        }));
        if (imagenInputRef.current) {
            imagenInputRef.current.value = '';
        }
    };

    const limpiarLogo = () => {
        setPreviewLogo(null);
        setEmpresa((prevEmpresa) => ({
            ...prevEmpresa,
            logo: null,
            logoBase64: null,
            logoNombre: null,
            logoTipo: null
        }));
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const manejarCambioInputNumber = (e, nombreInput) => {
        let valor = e.value;
        if (valor === undefined) {
            valor = null;
        }

        //Evitamos que el valor sea mayor al maximo permitido, por algun motivo el maximo no se aplica en el input si se escriben muchos numeros de golpe
        if (e.originalEvent?.target?.max && valor !== null) {
            const maximo = parseInt(e.originalEvent.target.max)
            if(valor > maximo){
                valor = maximo;
                e.originalEvent.target.value = maximo.toLocaleString('es-ES');
            }
        }
        let _empresa = { ...empresa };
        _empresa[`${nombreInput}`] = valor;
        setEmpresa(_empresa);
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la empresa' })} toggleable collapsed>
            <Toast ref={toast} position="top-right" />
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaOrden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={empresa.orden === '' || empresa.orden === undefined ? null : empresa.orden}
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
                { /*<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
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
                */}
                {/*<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
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
                */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tiempoInactividad" className="block">{intl.formatMessage({ id: 'Minutos de inactividad' })}</label>
                    <InputNumber
                        id="tiempoInactividad"
                        value={empresa.tiempoInactividad ?? 60}
                        onChange={(e) => manejarCambioInputNumber(e, "tiempoInactividad")}
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
                    <div className="p-3 border-1 border-round surface-border">
                        <div className="flex justify-content-center align-items-center border-round surface-100 p-2" style={{ minHeight: '220px' }}>
                            {(previewImagen || empresa.imagen) ? (
                                <Image
                                    src={previewImagen || empresa.imagen}
                                    alt="Imagen de la empresa"
                                    width="220"
                                    className="border-round"
                                    imageStyle={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary">Sin imagen cargada</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewImagen ? "text-green-600" : "text-color-secondary"}>
                                {previewImagen
                                    ? `Nueva imagen seleccionada${empresa.imagenNombre ? `: ${empresa.imagenNombre}` : ''}`
                                    : (empresa.imagen ? 'Imagen actual' : 'No hay imagen cargada')}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label="Seleccionar imagen"
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => imagenInputRef.current?.click()}
                            />
                            {(previewImagen || empresa.imagen) && (
                                <Button
                                    label="Quitar"
                                    icon="pi pi-times"
                                    className="p-button-text p-button-sm"
                                    onClick={limpiarImagen}
                                />
                            )}
                        </div>
                    </div>
                    <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={onSelectImagen}
                        style={{ display: 'none' }}
                        ref={imagenInputRef}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="logo" className="pb-2">{intl.formatMessage({ id: 'Logo' })}</label>
                    <div className="p-3 border-1 border-round surface-border">
                        <div className="flex justify-content-center align-items-center border-round surface-100 p-2" style={{ minHeight: '220px' }}>
                            {(previewLogo || empresa.logo) ? (
                                <Image
                                    src={previewLogo || empresa.logo}
                                    alt="Logo de la empresa"
                                    width="220"
                                    className="border-round"
                                    imageStyle={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary">Sin logo cargado</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewLogo ? "text-green-600" : "text-color-secondary"}>
                                {previewLogo
                                    ? `Nuevo logo seleccionado${empresa.logoNombre ? `: ${empresa.logoNombre}` : ''}`
                                    : (empresa.logo ? 'Logo actual' : 'No hay logo cargado')}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label="Seleccionar logo"
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => logoInputRef.current?.click()}
                            />
                            {(previewLogo || empresa.logo) && (
                                <Button
                                    label="Quitar"
                                    icon="pi pi-times"
                                    className="p-button-text p-button-sm"
                                    onClick={limpiarLogo}
                                />
                            )}
                        </div>
                    </div>
                    <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={onSelectLogo}
                        style={{ display: 'none' }}
                        ref={logoInputRef}
                    />
                </div>
            </div>
            <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-12">
                <label htmlFor="descripcion">{intl.formatMessage({ id: 'Descripción' })}</label>
                <InputTextarea value={empresa.descripcion} autoreresize
                    placeholder={intl.formatMessage({ id: 'Descripción de la empresa' })}
                    onChange={(e) => setEmpresa({ ...empresa, descripcion: e.target.value })}
                    //className={`${(estadoGuardando && empresa.descripcion === "") ? "p-invalid" : ""}`}
                    rows={5} cols={30} maxLength={500} />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Máximo 500 caracteres' })}</i> </small>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEmpresa;
