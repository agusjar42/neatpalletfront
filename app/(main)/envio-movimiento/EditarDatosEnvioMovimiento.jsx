import React from "react";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useIntl } from "react-intl";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { convertirArchivoABase64 } from "@/app/utility/Utils";

const EditarDatosEnvioMovimiento = ({
    envioMovimiento,
    setEnvioMovimiento,
    estadoGuardando,
    envios,
    tiposSensor,
    estoyDentroDeUnTab,
    envioPalletId,
}) => {
    const intl = useIntl();
    const [previewImagen, setPreviewImagen] = React.useState(envioMovimiento.imagenBase64 || null);
    const imagenInputRef = React.useRef(null);

    React.useEffect(() => {
        setPreviewImagen(envioMovimiento.imagenBase64 || null);
    }, [envioMovimiento.id, envioMovimiento.imagenBase64]);

    const opcionesEnvioPallet = envios.map((envioPallet) => ({
        label: `${envioPallet.id} - ${envioPallet.origenRuta || "Sin ruta"}${envioPallet.codigo ? ` - ${envioPallet.codigo}` : ""}${envioPallet.alias ? ` (${envioPallet.alias})` : ""}`,
        value: envioPallet.id,
    }));

    const opcionesTipoSensor = tiposSensor
        .filter((tipo) => tipo.activoSn === "S" || tipo.id === envioMovimiento.tipoSensorId)
        .map((tipo) => ({
            label: tipo.nombre,
            value: tipo.id,
        }));

    const onSelectImagen = async (e) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            try {
                const base64 = await convertirArchivoABase64(file);
                setPreviewImagen(base64);
                setEnvioMovimiento({
                    ...envioMovimiento,
                    imagenBase64: base64,
                    imagenNombre: file.name,
                    imagenTipo: file.type,
                });
            } catch (error) {
                console.error("Error convirtiendo archivo a base64:", error);
            }
        }
    };

    const limpiarImagen = () => {
        setPreviewImagen(null);
        setEnvioMovimiento({
            ...envioMovimiento,
            imagen: null,
            imagenBase64: null,
            imagenNombre: null,
            imagenTipo: null,
        });
        if (imagenInputRef.current) {
            imagenInputRef.current.value = "";
        }
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: "Datos para el movimiento de envío" })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden">
                        <b>{intl.formatMessage({ id: "Orden" })}*</b>
                    </label>
                    <InputNumber
                        value={envioMovimiento.orden}
                        placeholder={intl.formatMessage({ id: "Orden del movimiento" })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, orden: e.value })}
                        className={`${estadoGuardando && (envioMovimiento.orden === "" || envioMovimiento.orden === null || envioMovimiento.orden === undefined) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        inputStyle={{ textAlign: "right" }}
                    />
                </div>

                {!(estoyDentroDeUnTab && envioPalletId) && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="envioPalletId">
                            <b>{intl.formatMessage({ id: "Envio Pallet" })}*</b>
                        </label>
                        <Dropdown
                            value={envioMovimiento.envioPalletId || ""}
                            onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, envioPalletId: e.value })}
                            options={opcionesEnvioPallet}
                            className={`p-column-filter ${estadoGuardando && (envioMovimiento.envioPalletId == null || envioMovimiento.envioPalletId === "") ? "p-invalid" : ""}`}
                            showClear
                            placeholder={intl.formatMessage({ id: "Selecciona un envío pallet" })}
                        />
                    </div>
                )}

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tipoSensorId">
                        <b>{intl.formatMessage({ id: "Tipo de Sensor" })}*</b>
                    </label>
                    <Dropdown
                        value={envioMovimiento.tipoSensorId || ""}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, tipoSensorId: e.value })}
                        options={opcionesTipoSensor}
                        className={`p-column-filter ${estadoGuardando && (envioMovimiento.tipoSensorId == null || envioMovimiento.tipoSensorId === "") ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: "Selecciona un tipo de sensor" })}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fecha">{intl.formatMessage({ id: "Fecha" })}</label>
                    <InputText
                        type="datetime-local"
                        value={envioMovimiento.fecha}
                        placeholder={intl.formatMessage({ id: "Fecha del movimiento" })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, fecha: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: "right" }}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="gps">{intl.formatMessage({ id: "GPS" })}</label>
                    <InputText
                        value={envioMovimiento.gps}
                        placeholder={intl.formatMessage({ id: "Coordenadas GPS" })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, gps: e.target.value })}
                        maxLength={50}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="valor">{intl.formatMessage({ id: "Valor" })}</label>
                    <InputText
                        value={envioMovimiento.valor}
                        placeholder={intl.formatMessage({ id: "Valor del sensor" })}
                        onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, valor: e.target.value })}
                        maxLength={50}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="imagen" className="pb-2">
                        {intl.formatMessage({ id: "Imagen" })}
                    </label>
                    <div className="p-3 border-1 border-round surface-border">
                        <div className="flex justify-content-center align-items-center border-round surface-100 p-2" style={{ minHeight: "150px" }}>
                            {(previewImagen || envioMovimiento.imagen) ? (
                                <Image
                                    src={previewImagen || envioMovimiento.imagen}
                                    alt="Imagen"
                                    width="220"
                                    imageStyle={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary">Sin imagen cargada</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewImagen ? "text-green-600" : "text-color-secondary"}>
                                {previewImagen
                                    ? `Nueva imagen seleccionada${envioMovimiento.imagenNombre ? `: ${envioMovimiento.imagenNombre}` : ""}`
                                    : (envioMovimiento.imagen ? "Imagen actual" : "No hay imagen cargada")}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label={previewImagen || envioMovimiento.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => imagenInputRef.current?.click()}
                            />
                            {(previewImagen || envioMovimiento.imagen) && (
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
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectImagen({ files: [e.target.files[0]] });
                            }
                        }}
                        style={{ display: "none" }}
                        ref={imagenInputRef}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioMovimiento;
