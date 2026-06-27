import React, { useState, useRef, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { convertirArchivoABase64, getUsuarioSesion } from "@/app/utility/Utils";
import { getProducto } from "@/app/api-endpoints/empresa-producto";
import { getPallet } from "@/app/api-endpoints/pallet";
import { getEmpresaPallet } from "@/app/api-endpoints/empresa-pallet";

const EditarDatosEnvioContenido = ({ envioContenido, setEnvioContenido, estadoGuardando, envios, estoyDentroDeUnTab, empresaId }) => {
    const intl = useIntl();
    const toast = useRef(null);

    const [previewFotoProducto, setPreviewFotoProducto] = useState(null);
    const [previewFotoPallet, setPreviewFotoPallet] = useState(null);
    const fotoProductoInputRef = useRef(null);
    const fotoPalletInputRef = useRef(null);
    const [productos, setProductos] = useState([]);
    const [pallets, setPallets] = useState([]);
    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));

    useEffect(() => {
        setPreviewFotoProducto(envioContenido.fotoProductoBase64 || null);
        setPreviewFotoPallet(envioContenido.fotoPalletBase64 || null);
    }, [envioContenido.id, envioContenido.fotoProductoBase64, envioContenido.fotoPalletBase64]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const empresaContexto = Number(empresaId ?? envioContenido?.empresaId ?? getUsuarioSesion()?.empresaId);
                if (!empresaContexto) {
                    setProductos([]);
                    return;
                }

                const filtroProductos = JSON.stringify({ where: { and: { empresaId: empresaContexto, estado: 'Activo' } } });
                const dataProductos = await getProducto(filtroProductos);
                setProductos(dataProductos || []);
            } catch (error) {
                console.error('Error cargando productos:', error);
                setProductos([]);
            }
        };
        cargarProductos();
    }, [empresaId, envioContenido?.empresaId]);

    useEffect(() => {
        const cargarPallets = async () => {
            try {
                setPallets([]);
                const empresaContexto = Number(empresaId ?? getUsuarioSesion()?.empresaId);
                if (!empresaContexto) {
                    setPallets([]);
                    return;
                }

                const dataEmpresaPallet = await getEmpresaPallet(JSON.stringify({}));
                const asignacionesEmpresa = (dataEmpresaPallet || []).filter(
                    (asignacion) => Number(asignacion?.empresaId) === empresaContexto
                );

                const palletIds = [...new Set(asignacionesEmpresa
                    .map((asignacion) => asignacion?.palletId)
                    .filter((id) => id !== undefined && id !== null))];

                if (palletIds.length === 0) {
                    setPallets([]);
                    return;
                }

                const dataPallets = await getPallet(
                    JSON.stringify({
                        order: ["orden ASC", "codigo ASC"]
                    })
                );
                const palletIdsSet = new Set(palletIds.map((id) => String(id)));
                const palletsEmpresa = (dataPallets || []).filter((pallet) =>
                    palletIdsSet.has(String(pallet?.id))
                );
                const palletsFormateados = palletsEmpresa?.map(pallet => ({
                    ...pallet,
                    label: `${pallet.codigo} - ${pallet.alias || 'Sin alias'}`
                })) || [];
                setPallets(palletsFormateados);
            } catch (error) {
                console.error('Error cargando pallets:', error);
                setPallets([]);
            }
        };
        cargarPallets();
    }, [empresaId]);

    useEffect(() => {
        const peso = envioContenido.pesoKgs || 0;
        const cantidad = envioContenido.cantidad || 0;
        const pesoTotalCalculado = peso * cantidad;

        if (pesoTotalCalculado !== envioContenido.pesoTotal) {
            setEnvioContenido(prev => ({
                ...prev,
                pesoTotal: pesoTotalCalculado
            }));
        }
    }, [envioContenido.pesoKgs, envioContenido.cantidad, envioContenido.pesoTotal, setEnvioContenido]);

    const handleProductoChange = (e) => {
        const productoSeleccionado = productos.find(p => p.id === e.value);
        if (productoSeleccionado) {
            setEnvioContenido({
                ...envioContenido,
                productoId: e.value,
                producto: productoSeleccionado.nombre,
                referencia: productoSeleccionado.referencia,
                pesoKgs: productoSeleccionado.pesoKgs || 0
            });
        }
    };

    const handlePalletChange = (e) => {
        setEnvioContenido({
            ...envioContenido,
            palletId: e.value
        });
    };

    const onSelectFotoProducto = async (e) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
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
            fotoProducto: null,
            fotoProductoBase64: null,
            fotoProductoNombre: null,
            fotoProductoTipo: null
        });
        if (fotoProductoInputRef.current) {
            fotoProductoInputRef.current.value = '';
        }
    };

    const limpiarFotoPallet = () => {
        setPreviewFotoPallet(null);
        setEnvioContenido({
            ...envioContenido,
            fotoPallet: null,
            fotoPalletBase64: null,
            fotoPalletNombre: null,
            fotoPalletTipo: null
        });
        if (fotoPalletInputRef.current) {
            fotoPalletInputRef.current.value = '';
        }
    };

    return (
        <>
            <Toast ref={toast} position="top-right" />
            <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
                <div className="catalogo-edit-field">
                    <label htmlFor="orden" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Orden' })}*</label>
                    <InputNumber
                        value={envioContenido.orden === '' || envioContenido.orden === undefined ? null : envioContenido.orden}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, orden: e.value })}
                        className={`${(estadoGuardando && (envioContenido.orden === "" || envioContenido.orden === null || envioContenido.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: 'right' }}
                    />
                </div>

                {!estoyDentroDeUnTab && (
                    <div className="catalogo-edit-field">
                        <label htmlFor="envioId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Origen Ruta' })}*</label>
                        <Dropdown
                            value={envioContenido.envioId || ""}
                            onChange={(e) => setEnvioContenido({ ...envioContenido, envioId: e.value })}
                            options={opcionesEnvio}
                            className={`p-column-filter ${(estadoGuardando && (envioContenido.envioId == null || envioContenido.envioId === "")) ? "p-invalid" : ""}`}
                            showClear
                            placeholder={intl.formatMessage({ id: 'Selecciona un envio' })}
                        />
                    </div>
                )}

                <div className="catalogo-edit-field">
                    <label htmlFor="palletId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Pallet' })}*</label>
                    <Dropdown
                        value={envioContenido.palletId}
                        options={pallets}
                        onChange={handlePalletChange}
                        optionLabel="label"
                        optionValue="id"
                        placeholder={intl.formatMessage({ id: 'Seleccione un pallet' })}
                        className={`${(estadoGuardando && (envioContenido.palletId === "" || envioContenido.palletId === null || envioContenido.palletId === undefined)) ? "p-invalid" : ""}`}
                        filter
                        showClear
                    />
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="productoId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Producto' })}*</label>
                    <Dropdown
                        value={envioContenido.productoId}
                        options={productos}
                        onChange={handleProductoChange}
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder={intl.formatMessage({ id: 'Seleccione un producto' })}
                        className={`${(estadoGuardando && (envioContenido.productoId === "" || envioContenido.productoId === null || envioContenido.productoId === undefined)) ? "p-invalid" : ""}`}
                        filter
                        showClear
                        disabled={!Number(empresaId ?? envioContenido?.empresaId ?? getUsuarioSesion()?.empresaId)}
                    />
                    {!Number(empresaId ?? envioContenido?.empresaId ?? getUsuarioSesion()?.empresaId) && (
                        <small className="text-orange-600">
                            {intl.formatMessage({ id: 'Debe seleccionar una empresa en el envio para ver los productos disponibles' })}
                        </small>
                    )}
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="pesoKgs">{intl.formatMessage({ id: 'Peso (Kg)' })}</label>
                    <InputNumber
                        value={envioContenido.pesoKgs}
                        placeholder={intl.formatMessage({ id: 'Peso en kilogramos' })}
                        onValueChange={(e) => setEnvioContenido({ ...envioContenido, pesoKgs: e.value })}
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        min={0}
                        inputStyle={{ textAlign: 'right' }}
                    />
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="cantidad">{intl.formatMessage({ id: 'Cantidad' })}</label>
                    <InputNumber
                        value={envioContenido.cantidad || 0}
                        placeholder={intl.formatMessage({ id: 'Cantidad del producto' })}
                        onValueChange={(e) => setEnvioContenido({ ...envioContenido, cantidad: e.value })}
                        minFractionDigits={0}
                        maxFractionDigits={0}
                        min={0}
                        inputStyle={{ textAlign: 'right' }}
                    />
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="pesoTotal">{intl.formatMessage({ id: 'Peso Total (Kg)' })}</label>
                    <InputNumber
                        value={envioContenido.pesoTotal || 0}
                        placeholder={intl.formatMessage({ id: 'Peso total calculado automaticamente' })}
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        min={0}
                        disabled
                        inputStyle={{ textAlign: 'right', backgroundColor: '#f8f9fa' }}
                        tooltip={intl.formatMessage({ id: 'Campo calculado automaticamente: Peso por Cantidad' })}
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="medidas">{intl.formatMessage({ id: 'Medidas' })}</label>
                    <InputText
                        value={envioContenido.medidas || ''}
                        placeholder={intl.formatMessage({ id: 'Medidas del producto' })}
                        onChange={(e) => setEnvioContenido({ ...envioContenido, medidas: e.target.value })}
                        maxLength={50}
                    />
                </div>
                <div className="catalogo-edit-field"></div>

                <div className="catalogo-edit-field">
                    <label htmlFor="fotoProducto" className="pb-2">{intl.formatMessage({ id: 'Foto del producto' })}</label>
                    <div className="p-3 border-1 border-round surface-border">
                        <div className="flex justify-content-center align-items-center border-round surface-100 p-2" style={{ minHeight: '150px' }}>
                            {(previewFotoProducto || envioContenido.fotoProducto) ? (
                                <Image
                                    src={previewFotoProducto || envioContenido.fotoProducto}
                                    alt="Foto del producto"
                                    width="220"
                                    imageStyle={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary">Sin imagen cargada</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewFotoProducto ? "text-green-600" : "text-color-secondary"}>
                                {previewFotoProducto
                                    ? `Nueva imagen seleccionada${envioContenido.fotoProductoNombre ? `: ${envioContenido.fotoProductoNombre}` : ''}`
                                    : (envioContenido.fotoProducto ? 'Imagen actual' : 'No hay imagen cargada')}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label={previewFotoProducto || envioContenido.fotoProducto ? "Cambiar imagen" : "Seleccionar imagen"}
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => fotoProductoInputRef.current?.click()}
                            />
                            {(previewFotoProducto || envioContenido.fotoProducto) && (
                                <Button
                                    label="Quitar"
                                    icon="pi pi-times"
                                    className="p-button-text p-button-sm"
                                    onClick={limpiarFotoProducto}
                                />
                            )}
                        </div>
                    </div>
                    <input
                        id="fotoProducto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectFotoProducto({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={fotoProductoInputRef}
                    />
                </div>

                <div className="catalogo-edit-field">
                    <label htmlFor="fotoPallet" className="pb-2">{intl.formatMessage({ id: 'Foto del pallet' })}</label>
                    <div className="p-3 border-1 border-round surface-border">
                        <div className="flex justify-content-center align-items-center border-round surface-100 p-2" style={{ minHeight: '150px' }}>
                            {(previewFotoPallet || envioContenido.fotoPallet) ? (
                                <Image
                                    src={previewFotoPallet || envioContenido.fotoPallet}
                                    alt="Foto del pallet"
                                    width="220"
                                    imageStyle={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary">Sin imagen cargada</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewFotoPallet ? "text-green-600" : "text-color-secondary"}>
                                {previewFotoPallet
                                    ? `Nueva imagen seleccionada${envioContenido.fotoPalletNombre ? `: ${envioContenido.fotoPalletNombre}` : ''}`
                                    : (envioContenido.fotoPallet ? 'Imagen actual' : 'No hay imagen cargada')}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label={previewFotoPallet || envioContenido.fotoPallet ? "Cambiar imagen" : "Seleccionar imagen"}
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => fotoPalletInputRef.current?.click()}
                            />
                            {(previewFotoPallet || envioContenido.fotoPallet) && (
                                <Button
                                    label="Quitar"
                                    icon="pi pi-times"
                                    className="p-button-text p-button-sm"
                                    onClick={limpiarFotoPallet}
                                />
                            )}
                        </div>
                    </div>
                    <input
                        id="fotoPallet"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectFotoPallet({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: 'none' }}
                        ref={fotoPalletInputRef}
                    />
                </div>
            </div>
        </>
    );
};

export default EditarDatosEnvioContenido;
