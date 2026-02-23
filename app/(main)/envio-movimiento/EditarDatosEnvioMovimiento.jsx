import React from "react";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useIntl } from "react-intl";
import { FileUpload } from "primereact/fileupload";
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

    const opcionesEnvioPallet = envios.map((envioPallet) => ({
        label: `${envioPallet.id} - ${envioPallet.origenRuta || "Sin ruta"}${envioPallet.codigo ? ` - ${envioPallet.codigo}` : ""}${envioPallet.alias ? ` (${envioPallet.alias})` : ""}`,
        value: envioPallet.id,
    }));

    // De los Tipos de Sensor solo mostramos los activos y el que esté seleccionado (para poder editar un registro inactivo)
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
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: "Datos para el movimiento de envÃ­o" })}>
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
                        max={99999}
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
                            placeholder={intl.formatMessage({ id: "Selecciona un envÃ­o pallet" })}
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
                    {envioMovimiento.imagen && <Image src={envioMovimiento.imagen} alt="Imagen" width="200" preview />}

                    <label>{intl.formatMessage({ id: "Cambiar imagen por" })}</label>
                    <FileUpload
                        name="imagen"
                        accept="image/*"
                        onSelect={onSelectImagen}
                        mode="basic"
                        chooseLabel="Seleccionar nueva imagen"
                        className="p-button-outlined pt-2"
                    />

                    {previewImagen && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">Imagen seleccionada: {envioMovimiento.imagenNombre}</small>
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarImagen}
                                    tooltip="Quitar imagen"
                                />
                            </div>
                            <Image src={previewImagen} alt="Preview" width="200" preview />
                        </div>
                    )}
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioMovimiento;
