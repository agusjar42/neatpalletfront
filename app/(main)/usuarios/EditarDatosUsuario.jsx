import React, { useState, useRef, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl'
import { Button } from "primereact/button";
import 'react-phone-input-2/lib/bootstrap.css'
import { convertirArchivoABase64 } from "@/app/utility/Utils";
import { Toast } from "primereact/toast";
import { tieneUsuarioPermiso } from "@/app/components/shared/componentes";

//
//Generamos las iniciales para la previsualizacion del avatar
//
const obtenerInicialesUsuario = (nombre = "") => {
    const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) {
        return "--";
    }
    if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
    }
    return `${partes[0][0] ?? ""}${partes[1][0] ?? ""}`.toUpperCase();
};

const EditarDatosUsuario = ({ usuario, setUsuario, listaIdiomas, idiomaSeleccionado, setIdiomaSeleccionado, estadoGuardando,
    listaRoles, rolSeleccionado, setRolSeleccionado
}) => {
    const intl = useIntl()
    const toast = useRef(null);

    const [puedeSeleccionarRol, setPuedeSeleccionarRol] = useState(false);
    const [puedeSeleccionarEstado, setPuedeSeleccionarEstado] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(usuario.avatarBase64 || null);
    const [dropdownAbiertoRol, setDropdownAbiertoRol] = useState(false);
    const avatarInputRef = useRef(null);

    const optionsRol = dropdownAbiertoRol ? listaRoles.map(registro => registro.nombre) : [rolSeleccionado || '', ...listaRoles.map(registro => registro.nombre)];
    const optionsIdioma = listaIdiomas.map(registro => registro.nombre);

    useEffect(() => {
        const verificarPermiso = async () => {
            try {
                const [permisoRol, permisoEstado] = await Promise.all([
                    tieneUsuarioPermiso('Neatpallet', 'Usuarios', 'SeleccionarRol'),
                    tieneUsuarioPermiso('Neatpallet', 'Usuarios', 'SeleccionarEstado'),
                ]);
                setPuedeSeleccionarRol(Boolean(permisoRol));
                setPuedeSeleccionarEstado(Boolean(permisoEstado));
            } catch (error) {
                console.error("Error verificando permisos de Usuarios:", error);
                setPuedeSeleccionarRol(false);
                setPuedeSeleccionarEstado(false);
            }
        };
        verificarPermiso();
    }, []);

    useEffect(() => {
        setPreviewAvatar(usuario.avatarBase64 || null);
    }, [usuario.id, usuario.avatarBase64]);

    //
    //Convertimos la imagen seleccionada en base64 para conservar el flujo actual
    //
    const onSelectAvatar = async (e) => {
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
                setPreviewAvatar(base64);

                setUsuario({
                    ...usuario,
                    avatarBase64: base64,
                    avatarNombre: file.name,
                    avatarTipo: file.type
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

    return (
        <div className="usuario-edit-modal-body">
            <Toast ref={toast} position="top-right" />

            <div className="usuario-edit-avatar-panel">
                <div className="usuario-edit-avatar-circle">
                    {(previewAvatar || usuario.avatar) ? (
                        <img src={previewAvatar || usuario.avatar} alt="Avatar del usuario" />
                    ) : (
                        <span>{obtenerInicialesUsuario(usuario.nombre)}</span>
                    )}
                </div>

                <div className="usuario-edit-avatar-copy">
                    <Button
                        label="Subir foto"
                        className="p-button-outlined p-button-sm"
                        onClick={() => avatarInputRef.current?.click()}
                    />
                    <small>PNG o JPG. Cuadrada, 1:1 recomendado.</small>
                </div>

                <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            onSelectAvatar({ files: [e.target.files[0]] });
                        }
                    }}
                    style={{ display: 'none' }}
                    ref={avatarInputRef}
                />
            </div>

            <div className="usuario-edit-form-grid">
                <div className="usuario-edit-field">
                    <label htmlFor="nombre" style={{ color: 'black' }}><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText
                        value={usuario.nombre || ""}
                        onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                        className={`${(estadoGuardando && usuario.nombre === "") ? "p-invalid" : ""}`}
                        maxLength={50}
                    />
                </div>

                <div className="usuario-edit-field">
                    <label htmlFor="mail">{intl.formatMessage({ id: 'Email' })}</label>
                    <InputText
                        value={usuario.mail || ""}
                        autoComplete='off'
                        onChange={(e) => setUsuario({ ...usuario, mail: e.target.value })}
                        maxLength={100}
                    />
                </div>

                <div className="usuario-edit-field">
                    <label htmlFor="telefono">{intl.formatMessage({ id: 'Telefono' })}</label>
                    <InputText
                        value={usuario.telefono || ""}
                        onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        className={`${(estadoGuardando && usuario.telefono === "") ? "p-invalid" : ""}`}
                        maxLength={50}
                    />
                </div>

                <div className="usuario-edit-field">
                    <label htmlFor="idiomaId">{intl.formatMessage({ id: 'Idioma' })}</label>
                    <Dropdown
                        value={idiomaSeleccionado || ""}
                        onChange={(e) => setIdiomaSeleccionado(e.value)}
                        options={optionsIdioma}
                        className={`${(estadoGuardando && (idiomaSeleccionado == null || idiomaSeleccionado === "")) ? "p-invalid" : ""}`}
                        placeholder={intl.formatMessage({ id: 'Selecciona un idioma' })}
                    />
                </div>

                <div className="usuario-edit-field">
                    <label htmlFor="usuRol">{intl.formatMessage({ id: 'Rol' })}</label>
                    <Dropdown
                        value={rolSeleccionado || ""}
                        onChange={(e) => setRolSeleccionado(e.value)}
                        options={optionsRol}
                        onClick={() => setDropdownAbiertoRol(true)}
                        disabled={!puedeSeleccionarRol}
                        className={`${(estadoGuardando && (rolSeleccionado == null || rolSeleccionado === "")) ? "p-invalid" : ""}`}
                        placeholder={intl.formatMessage({ id: 'Selecciona un rol' })}
                    />
                </div>

                <div className="usuario-edit-field">
                    <label htmlFor="activoSn">{intl.formatMessage({ id: 'Estado' })}</label>
                    <div className="flex align-items-center gap-2">
                        <InputSwitch
                            inputId="usuario-estado"
                            checked={(usuario.activoSn || "S") === "S"}
                            onChange={(e) => setUsuario({ ...usuario, activoSn: e.value ? "S" : "N" })}
                            disabled={!puedeSeleccionarEstado}
                        />
                        <label htmlFor="usuario-estado">{intl.formatMessage({ id: 'Activo' })}</label>
                    </div>
                </div>
            </div>
        </div>
   );
};
export default EditarDatosUsuario;
