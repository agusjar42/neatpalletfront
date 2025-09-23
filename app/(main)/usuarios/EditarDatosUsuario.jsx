import React, { useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl'
import { FileUpload } from "primereact/fileupload";
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import 'react-phone-input-2/lib/bootstrap.css'
import { convertirArchivoABase64 } from "@/app/utility/Utils";

const EditarDatosUsuario = ({ usuario, setUsuario, listaIdiomas, idiomaSeleccionado, setIdiomaSeleccionado, estadoGuardando,
    listaRoles, rolSeleccionado, setRolSeleccionado, listaTipoArchivos
}) => {
    const intl = useIntl()
    
    // Estado para el preview del avatar
    const [previewAvatar, setPreviewAvatar] = useState(usuario.avatarBase64 || null);
    const [dropdownAbiertoIdioma, setDropdownAbiertoIdioma] = useState(false);
    const [dropdownAbiertoRol, setDropdownAbiertoRol] = useState(false);
    //Para que el dropdown muestre el registro seleccionado aunque no este en la lista
    const optionsIdioma = dropdownAbiertoIdioma ? listaIdiomas.map(registro => registro.nombre) : [idiomaSeleccionado || '', ...listaIdiomas.map(registro => registro.nombre)];
    const optionsRol = dropdownAbiertoRol ? listaRoles.map(registro => registro.nombre) : [rolSeleccionado || '', ...listaRoles.map(registro => registro.nombre)];

    const manejarCambioInputSwitch = (e, nombreInputSwitch) => {
        const valor = (e.target && e.target.value) || "";
        let _usuario = { ...usuario };
        const esTrue = valor === true ? 'S' : 'N';
        _usuario[`${nombreInputSwitch}`] = esTrue;
        setUsuario(_usuario);
    };

    // Función para manejar la selección del avatar
    const onSelectAvatar = async (e) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            try {
                const base64 = await convertirArchivoABase64(file);
                setPreviewAvatar(base64);
                
                // Guardamos el base64 en el estado del usuario
                setUsuario({ 
                    ...usuario, 
                    avatarBase64: base64,
                    avatarNombre: file.name,
                    avatarTipo: file.type
                });
            } catch (error) {
                console.error('Error convirtiendo archivo a base64:', error);
            }
        }
    };

    // Función para limpiar el avatar
    const limpiarAvatar = () => {
        setPreviewAvatar(null);
        setUsuario({
            ...usuario,
            avatarBase64: null,
            avatarNombre: null,
            avatarTipo: null
        });
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el Usuario' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="usuRol"><b>{intl.formatMessage({ id: 'Rol' })}*</b> </label>
                    <Dropdown value={rolSeleccionado || ""}
                        onChange={(e) => setRolSeleccionado(e.value)}
                        options={optionsRol}
                        onClick={() => setDropdownAbiertoRol(true)}
                        className={`p-column-filter ${(estadoGuardando && (rolSeleccionado == null || rolSeleccionado === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un rol' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="examenIdioma"><b>{intl.formatMessage({ id: 'Idioma' })}*</b> </label>
                    <Dropdown value={idiomaSeleccionado || ""}
                        onChange={(e) => setIdiomaSeleccionado(e.value)}
                        options={optionsIdioma}
                        onClick={() => setDropdownAbiertoIdioma(true)}
                        className={`p-column-filter ${(estadoGuardando && (idiomaSeleccionado == null || idiomaSeleccionado === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un idioma' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="nombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={usuario.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre' })}
                        onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                        className={`${(estadoGuardando && usuario.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="mail"><b>{intl.formatMessage({ id: 'Mail' })}*</b></label>
                    <InputText value={usuario.mail}
                        placeholder={intl.formatMessage({ id: 'Mail' })}
                        autoComplete='off'
                        onChange={(e) => setUsuario({ ...usuario, mail: e.target.value })}
                        rows={5} cols={30} maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={usuario.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="telefono"><b>{intl.formatMessage({ id: 'Teléfono' })}*</b></label>
                    <InputText value={usuario.telefono}
                        onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        className={`${(estadoGuardando && usuario.telefono === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50}
                        style={{textAlign:"right"}} />
                </div>

                {/* Sección del Avatar - Imagen actual */}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="avatar" className="pb-2">{intl.formatMessage({ id: 'Avatar' })}</label>
                    {usuario.avatar && (
                        <Image
                            src={usuario.avatar}
                            alt="Avatar del usuario"
                            width="150"
                            height="150"
                            className="border-circle"
                            preview
                        />
                    )}   
                    <FileUpload
                        name="avatar"
                        accept="image/*"
                        maxFileSize={2000000} // 2MB
                        onSelect={onSelectAvatar}
                        mode="basic"
                        chooseLabel="Cambiar imagen por: "
                        className="p-button-outlined pt-2"
                    />
                    
                    {previewAvatar && (
                        <div className="mt-2">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <small className="text-green-600">
                                    Avatar seleccionado: {usuario.avatarNombre}
                                </small>
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-sm"
                                    onClick={limpiarAvatar}
                                    tooltip="Quitar imagen"
                                />
                            </div>
                            <div className="flex justify-content-center">
                                <Image 
                                    src={previewAvatar} 
                                    alt="Preview avatar" 
                                    width="200" 
                                    height="200"
                                    className="border-circle"
                                    preview 
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </Fieldset>
   );
};
export default EditarDatosUsuario;