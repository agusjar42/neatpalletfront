import React, { useState, useRef, useEffect } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useIntl } from 'react-intl'
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import 'react-phone-input-2/lib/bootstrap.css'
import { convertirArchivoABase64 } from "@/app/utility/Utils";
import { Toast } from "primereact/toast";
import { tieneUsuarioPermiso } from "@/app/components/shared/componentes";
import { getUsuarios } from "@/app/api-endpoints/usuario";

const EditarDatosUsuario = ({ usuario, setUsuario, listaIdiomas, idiomaSeleccionado, setIdiomaSeleccionado, estadoGuardando,
    listaRoles, rolSeleccionado, setRolSeleccionado, listaTipoArchivos
}) => {
    const intl = useIntl()
    const toast = useRef(null);

    const [puedeSeleccionarRol, setPuedeSeleccionarRol] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(usuario.avatarBase64 || null);
    const [dropdownAbiertoIdioma, setDropdownAbiertoIdioma] = useState(false);
    const [dropdownAbiertoRol, setDropdownAbiertoRol] = useState(false);
    const avatarInputRef = useRef(null);

    const optionsIdioma = dropdownAbiertoIdioma ? listaIdiomas.map(registro => registro.nombre) : [idiomaSeleccionado || '', ...listaIdiomas.map(registro => registro.nombre)];
    const optionsRol = dropdownAbiertoRol ? listaRoles.map(registro => registro.nombre) : [rolSeleccionado || '', ...listaRoles.map(registro => registro.nombre)];

    useEffect(() => {
        const verificarPermiso = async () => {
            try {
                const tienePermiso = await tieneUsuarioPermiso('Neatpallet', 'Usuarios', 'SeleccionarRol');
                setPuedeSeleccionarRol(Boolean(tienePermiso));
            } catch (error) {
                console.error("Error verificando permiso SeleccionarRol:", error);
                setPuedeSeleccionarRol(false);
            }
        };
        verificarPermiso();
    }, []);

    useEffect(() => {
        setPreviewAvatar(usuario.avatarBase64 || null);
    }, [usuario.id, usuario.avatarBase64]);

    const manejarCambioInputSwitch = async (e, nombreInputSwitch) => {
        let permiteDesactivar = true;
        if (nombreInputSwitch === "usuarioAdmin" && e.target && e.target.value === false) {
            const usuariosAdmin = await getUsuarios(JSON.stringify({ where: { and: { empresaId: usuario.empresaId, usuarioAdmin: 'S' } } }));
            if (usuariosAdmin.length === 1 && usuariosAdmin[0].id === usuario.id) {
                permiteDesactivar = false;
                toast.current?.show({
                    severity: 'warn',
                    summary: 'ADVERTENCIA',
                    detail: intl.formatMessage({ id: 'No puede desactivar este switch, porque no existe ningún otro usuario con privilegios de administrador. Actívelo en otro si quiere desactivar este' }),
                    life: 3000,
                });
            }
        }
        if (permiteDesactivar) {
            const valor = (e.target && e.target.value) || "";
            let _usuario = { ...usuario };
            const esTrue = valor === true ? 'S' : 'N';
            _usuario[`${nombreInputSwitch}`] = esTrue;
            setUsuario(_usuario);
        }
    };

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

    const limpiarAvatar = () => {
        setPreviewAvatar(null);
        setUsuario({
            ...usuario,
            avatar: null,
            avatarBase64: null,
            avatarNombre: null,
            avatarTipo: null
        });
        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el Usuario' })}>
            <Toast ref={toast} position="top-right" />
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="usuRol"><b>{intl.formatMessage({ id: 'Rol' })}*</b> </label>
                    <Dropdown value={rolSeleccionado || ""}
                        onChange={(e) => setRolSeleccionado(e.value)}
                        options={optionsRol}
                        onClick={() => setDropdownAbiertoRol(true)}
                        disabled={!puedeSeleccionarRol}
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
                    <label htmlFor="telefono"><b>{intl.formatMessage({ id: 'Teléfono' })}*</b></label>
                    <InputText value={usuario.telefono}
                        onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        className={`${(estadoGuardando && usuario.telefono === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50}
                        style={{ textAlign: "right" }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="activoSN" className="font-bold block">{intl.formatMessage({ id: 'Activo' })}</label>
                    <InputSwitch
                        checked={usuario.activoSn === 'S'}
                        onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    />
                </div>
                {(JSON.parse(localStorage.getItem('userDataNeatpallet'))?.["usuarioAdmin"] || "N") === "S" && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                        <label htmlFor="usuarioAdmin" className="font-bold block">{intl.formatMessage({ id: 'Usuario Admin' })}</label>
                        <InputSwitch
                            checked={usuario.usuarioAdmin === 'S'}
                            onChange={(e) => manejarCambioInputSwitch(e, "usuarioAdmin")}
                        />
                    </div>
                )}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="avatar" className="pb-2">{intl.formatMessage({ id: 'Avatar' })}</label>
                    <div className="p-3 border-1 border-round surface-border">
                        <div
                            className="flex justify-content-center align-items-center border-circle surface-100 mx-auto overflow-hidden"
                            style={{ width: '150px', height: '150px' }}
                        >
                            {(previewAvatar || usuario.avatar) ? (
                                <Image
                                    src={previewAvatar || usuario.avatar}
                                    alt="Avatar del usuario"
                                    width="150"
                                    height="150"
                                    className="border-circle"
                                    imageStyle={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    preview
                                />
                            ) : (
                                <small className="text-color-secondary text-center px-2">Sin avatar</small>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <small className={previewAvatar ? "text-green-600" : "text-color-secondary"}>
                                {previewAvatar
                                    ? `Nuevo avatar seleccionado${usuario.avatarNombre ? `: ${usuario.avatarNombre}` : ''}`
                                    : (usuario.avatar ? 'Avatar actual' : 'No hay avatar cargado')}
                            </small>
                        </div>
                        <div className="flex justify-content-center gap-2 mt-3 flex-wrap">
                            <Button
                                label={usuario.avatar || previewAvatar ? "Cambiar avatar" : "Seleccionar avatar"}
                                icon="pi pi-upload"
                                className="p-button-outlined p-button-sm"
                                onClick={() => avatarInputRef.current?.click()}
                            />
                            {(previewAvatar || usuario.avatar) && (
                                <Button
                                    label="Quitar"
                                    icon="pi pi-times"
                                    className="p-button-text p-button-sm"
                                    onClick={limpiarAvatar}
                                />
                            )}
                        </div>
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
            </div>
        </Fieldset>
   );
};
export default EditarDatosUsuario;
