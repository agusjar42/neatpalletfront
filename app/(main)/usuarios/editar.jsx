import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import EditarDatosUsuario from "./EditarDatosUsuario";

import { useIntl } from 'react-intl';
import { getEmpresas } from "@/app/api-endpoints/empresa";
import { getRol, obtenerRolDashboard } from "@/app/api-endpoints/rol";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import { Button } from "primereact/button";
import { getVistaUsuarios, patchUsuario, postUsuario } from "@/app/api-endpoints/usuario";
import { getUsuarioSesion } from "@/app/utility/Utils";
import { tieneUsuarioPermiso } from "@/app/components/shared/componentes";

import { useRouter } from 'next/navigation';

const EditarUsuario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, editable }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const router = useRouter();
    const [usuario, setUsuario] = useState(emptyRegistro);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [listaRoles, setListaRoles] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [listaIdiomas, setListaIdiomas] = useState([]);
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState(null);
    const [estadoGuardando, setEstadoGuardando] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            //
            //****************************************************************************************************
            //
            // Obtenemos todos los roles
            //
            let empresaFiltrar = null;
            if (idEditar === 0) {
                empresaFiltrar = getUsuarioSesion()?.empresaId || null;
            } else {
                const usuarioEditar = rowData.find((element) => element.id === idEditar);
                empresaFiltrar = usuarioEditar?.empresaId || null;
            }
            const filtroRol = { where: { and: { empresaId: empresaFiltrar } } };
            const registrosRoles = await getRol(JSON.stringify(filtroRol));

            const jsonRoles = registrosRoles.map(rol => ({
                nombre: rol.nombre,
                id: rol.id,
                activoSn: rol.activoSn
            }));
            //Quitamos los registros inactivos y ordenamos
            const jsonRolesActivos = jsonRoles
                .filter(registro => registro.activoSn === 'S')
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
            setListaRoles(jsonRolesActivos);

            //
            //****************************************************************************************************
            //
            // Obtenemos todos los idiomas
            //
            const registrosIdiomas = await getIdiomas();
            const jsonIdiomas = registrosIdiomas.map(idioma => ({
                nombre: idioma.nombre,
                id: idioma.id,
                activoSn: idioma.activoSn
            })).sort((a, b) => a.nombre.localeCompare(b.nombre));
            //Quitamos los registros inactivos y ordenamos
            const jsonIdiomasActivos = jsonIdiomas
                .filter(registro => registro.activoSn === 'S')
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
            setListaIdiomas(jsonIdiomasActivos);

            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0) {

                // Obtenemos el registro a editar
                let registro = rowData.find((element) => element.id === idEditar);
                setUsuario(registro);

                // Convertir IDs a nombres para los dropdowns
                if (registro.idiomaId) {
                    const idiomaEncontrado = jsonIdiomasActivos.find(idioma => idioma.id === registro.idiomaId);
                    if (idiomaEncontrado) {
                        setIdiomaSeleccionado(idiomaEncontrado.nombre);
                    }
                }

                if (registro.rolId) {
                    const rolEncontrado = jsonRolesActivos.find(rol => rol.id === registro.rolId);
                    if (rolEncontrado) {
                        setRolSeleccionado(rolEncontrado.nombre);
                    }
                }

            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //Valida que los campos no esten vacios
        const validaNombre = usuario.nombre === undefined || usuario.nombre === "";
        const validaTelefono = usuario.telefono === undefined || usuario.telefono === "";
        const validaIdioma = idiomaSeleccionado == null || idiomaSeleccionado.codigo === "";
        const validaRol = rolSeleccionado == null || rolSeleccionado.codigo === "";
        const validaEmail = usuario.mail === undefined || usuario.mail === "";

        if (validaNombre || validaTelefono /* || validaEmpresa */ || validaIdioma || validaRol || validaEmail ) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        
        if (!regexEmail.test(usuario.mail)) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                life: 3000,
            });
        }
        //Validar que el mail es unico
        const filtroUsuario = JSON.stringify({
            where: {
                and: {
                    mail: usuario.mail,
                }
            }

        })
        const usuarioExistente = await getVistaUsuarios(filtroUsuario);
        let limite = 0
        let condicion = true
        //Si el usuario se esta editando, no contamos su propio email
        if (idEditar !== undefined && idEditar !== null && idEditar !== "" && idEditar > 0) {
            limite++;
            if (usuarioExistente.length > 0) {
                condicion = usuarioExistente[0].id !== idEditar
            }
        }
        if (usuarioExistente.length > 0 && condicion) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'El email no debe estar registrado en el sistema.' }),
                life: 3000,
            });
            return false
        }
        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaNombre && !validaTelefono // && !validaEmpresa 
            && !validaIdioma && !validaRol && !validaEmail && regexEmail.test(usuario.mail));
    }

    const cancelarEdicion = async () => {
        //
        // Verificar si el usuario tiene permisos para acceder a Usuarios
        //
        setIdEditar(null);
        const tienePermiso = await tieneUsuarioPermiso('Neatpallet', 'Usuarios', 'Acceder');
        //
        // Si no tiene permisos, redirigir a la página principal del rol. Sino continuar con la cancelación normal
        //
        if (!tienePermiso) {            
            router.push(await obtenerRolDashboard());
        }
    };
    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    const guardarUsuario = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el examen actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...usuario };
            if (objGuardar.nombre && objGuardar) {
                const usuarioCreacion = getUsuarioSesion()?.id;
                const usuarioGuardar = {
                    nombre: objGuardar.nombre,
                    mail: objGuardar.mail,
                    activoSn: objGuardar.activoSn,
                    empresaId: getUsuarioSesion()?.empresaId,
                    avatarBase64: objGuardar.avatarBase64,
                    avatarNombre: objGuardar.avatarNombre,
                    avatarTipo: objGuardar.avatarTipo,
                    usuarioAdmin: objGuardar.usuarioAdmin
                }
                // Si estoy insertando uno nuevo
                if (idEditar === 0) {
                    usuarioGuardar['usuCreacion'] = usuarioCreacion;

                    if (idiomaSeleccionado) {
                        usuarioGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado)?.id;
                    }
                    if (rolSeleccionado) {
                        usuarioGuardar['rolId'] = listaRoles.find(rol => rol.nombre === rolSeleccionado)?.id;
                    }

                    if (objGuardar.telefono && objGuardar.telefono.length > 0) {
                        usuarioGuardar.telefono = objGuardar.telefono;
                    }
                    else {
                        usuarioGuardar.telefono = null;
                    }
                    if (objGuardar.activoSn == '') {
                        usuarioGuardar.activoSn = 'N';
                    }

                    // Hacemos el insert del usuario
                    const nuevoRegistro = await postUsuario(usuarioGuardar);
                    if (nuevoRegistro?.id) {
                        
                        setRegistroResult("insertado");
                        setIdEditar(null);

                    } else {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'ERROR',
                            detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                            life: 3000,
                        });
                    }
                } else {
                    //Si se edita 
                    usuarioGuardar['usuModificacion'] = usuarioCreacion;
                    if (idiomaSeleccionado) {
                        usuarioGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado)?.id;
                    }

                    if (rolSeleccionado) {
                        usuarioGuardar['rolId'] = listaRoles.find(rol => rol.nombre === rolSeleccionado)?.id;
                    }
                    usuarioGuardar.id = objGuardar.id;

                    usuarioGuardar['empresaId'] = getUsuarioSesion()?.empresaId;

                    if (objGuardar.telefono && objGuardar.telefono.length > 0) {
                        usuarioGuardar.telefono = objGuardar.telefono;
                    }
                    else {
                        usuarioGuardar.telefono = null;
                    }
                    if (objGuardar.activoSn === '' || objGuardar.activoSn == null) {
                        usuarioGuardar.activoSn = 'N';
                    }

                    await patchUsuario(objGuardar.id, usuarioGuardar);

                    setIdEditar(null)
                    setRegistroResult("editado");
                }
            }
        }
        else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                life: 3000,
            });
        }
        setEstadoGuardandoBoton(false);
    };
    
    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Usuario' })).toLowerCase()}</h2>
                        <EditarDatosUsuario
                            usuario={usuario}
                            setUsuario={setUsuario}
                            empresaSeleccionada={empresaSeleccionada}
                            setEmpresaSeleccionada={setEmpresaSeleccionada}
                            listaRoles={listaRoles}
                            rolSeleccionado={rolSeleccionado}
                            setRolSeleccionado={setRolSeleccionado}
                            listaIdiomas={listaIdiomas}
                            idiomaSeleccionado={idiomaSeleccionado}
                            setIdiomaSeleccionado={setIdiomaSeleccionado}
                            estadoGuardando={estadoGuardando}
                        />
                        <div className="flex justify-content-end mt-2">
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarUsuario}
                                    className="mr-2"
                                    disabled={estadoGuardandoBoton}
                                />
                            )}
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default EditarUsuario;