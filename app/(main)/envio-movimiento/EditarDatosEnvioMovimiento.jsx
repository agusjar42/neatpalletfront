import React from "react";
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
    pallets,
    tiposSensor,
    estoyDentroDeUnTab,
}) => {
    const intl = useIntl();
    const [previewImagen, setPreviewImagen] = React.useState(envioMovimiento.imagenBase64 || null);
    const imagenInputRef = React.useRef(null);

    React.useEffect(() => {
        setPreviewImagen(envioMovimiento.imagenBase64 || null);
    }, [envioMovimiento.id, envioMovimiento.imagenBase64]);

    //
    //Mostramos los mismos pallets que se usan en la pestana de contenido
    //
    const opcionesEnvioPallet = pallets.map((pallet) => ({
        label: pallet.label || `${pallet.codigo} - ${pallet.alias || pallet.modelo || "Sin alias"}`,
        value: pallet.id,
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
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" className="catalogo-edit-label-required">{intl.formatMessage({ id: "Orden" })}*</label>
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

            <div className="catalogo-edit-field">
                <label htmlFor="palletId" className="catalogo-edit-label-required">{intl.formatMessage({ id: "Pallet" })}*</label>
                <Dropdown
                    value={envioMovimiento.palletId || ""}
                    onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, palletId: e.value })}
                    options={opcionesEnvioPallet}
                    className={`p-column-filter ${estadoGuardando && (envioMovimiento.palletId == null || envioMovimiento.palletId === "") ? "p-invalid" : ""}`}
                    showClear
                    filter
                    placeholder={intl.formatMessage({ id: "Selecciona un pallet" })}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="tipoSensorId" className="catalogo-edit-label-required">{intl.formatMessage({ id: "Tipo de Sensor" })}*</label>
                <Dropdown
                    value={envioMovimiento.tipoSensorId || ""}
                    onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, tipoSensorId: e.value })}
                    options={opcionesTipoSensor}
                    className={`p-column-filter ${estadoGuardando && (envioMovimiento.tipoSensorId == null || envioMovimiento.tipoSensorId === "") ? "p-invalid" : ""}`}
                    showClear
                    placeholder={intl.formatMessage({ id: "Selecciona un tipo de sensor" })}
                />
            </div>

            <div className="catalogo-edit-field">
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

            <div className="catalogo-edit-field">
                <label htmlFor="gps">{intl.formatMessage({ id: "GPS" })}</label>
                <InputText
                    value={envioMovimiento.gps}
                    placeholder={intl.formatMessage({ id: "Coordenadas GPS" })}
                    onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, gps: e.target.value })}
                    maxLength={50}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="valor">{intl.formatMessage({ id: "Valor" })}</label>
                <InputText
                    value={envioMovimiento.valor}
                    placeholder={intl.formatMessage({ id: "Valor del sensor" })}
                    onChange={(e) => setEnvioMovimiento({ ...envioMovimiento, valor: e.target.value })}
                    maxLength={50}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="imagen" className="pb-2">{intl.formatMessage({ id: "Imagen" })}</label>
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
    );
};

export default EditarDatosEnvioMovimiento;
