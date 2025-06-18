import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import EditarDatosUsuario from "./EditarDatosUsuario";

import { useIntl } from 'react-intl';
import { getEmpresas } from "@/app/api-endpoints/empresa";
import { getRol, obtenerRolDashboard } from "@/app/api-endpoints/rol";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { getVistaUsuarios, patchUsuario, postUsuario } from "@/app/api-endpoints/usuario";
import { Dropdown } from "primereact/dropdown";
import { getUsuarioSesion } from "@/app/utility/Utils";
import { borrarFichero, postSubirAvatar, postSubirFichero, postSubirImagen } from "@/app/api-endpoints/ficheros";
import { deleteArchivo, postArchivo } from "@/app/api-endpoints/archivo";
import { esUrlImagen } from "@/app/components/shared/componentes";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const EditarUsuario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion,
    editable, setRegistroEditarFlag, tipo, rol, crudDerivado }) => {
    const intl = useIntl();
    const toast = useRef(null);
    const router = useRouter();
    const [usuario, setUsuario] = useState(emptyRegistro);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [listaRoles, setListaRoles] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [listaIdiomas, setListaIdiomas] = useState([]);
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState(null);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [listaTipoArchivosAntiguos, setListaTipoArchivosAntiguos] = useState([]);
    const [idEditarDerivado, setIdEditarDerivado] = useState(idEditar);

    useEffect(() => {
        const fetchData = async () => {
            //
            //****************************************************************************************************
            //
            // Obtenemos todas las empresas
            //
            const registrosEmpresas = await getEmpresas();
            const jsonEmpresas = registrosEmpresas.map(empresa => ({
                nombre: empresa.nombre,
                id: empresa.id,
                activoSn: empresa.activoSn
            }));
            //Quitamos los registros inactivos y ordenamos
            const jsonEmpresasActivas = jsonEmpresas
                .filter(registro => registro.activoSn === 'S')
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
            setListaEmpresas(jsonEmpresasActivas);
            //
            //****************************************************************************************************
            //
            // Obtenemos todos los roles
            //
            const registrosRoles = await getRol();
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
            if (idEditar !== 0 && rowData !== 0) {
                //Si usuarioId esta declarado significa que estamos accediendo a la pantalla desde otro crud, por ejemplo centros escolares, por lo que
                // el id de editar si tiene que cambiar para que se vea el del usuario y no el del registro del crud

                // Obtenemos el registro a editar
                let registro = rowData.find((element) => element.id === idEditarDerivado);
                //Es posible que accedamos a un usuario a traves del url, lo que significa que muy posiblemente no este dentro del rowData,
                // por lo que hay que llamar a la bbdd
                if (!registro) {
                    const filtroUsuario = JSON.stringify({
                        where: {
                            and: {
                                id: idEditarDerivado
                            }
                        }
                    })
                    let registro = await getVistaUsuarios(filtroUsuario);
                    registro = registro[0]
                }
                if (crudDerivado) {
                    const filtroUsuarioDerivado = JSON.stringify({
                        where: {
                            and: {
                                id: registro.usuario_id
                            }
                        }
                    })
                    registro = await getVistaUsuarios(filtroUsuarioDerivado);
                    registro = registro[0]
                    await obtenerArchivosSeccion(registro, 'Usuario')
                }

                //Modificamos el idEditar
                idEditar = registro.id;
                setIdEditar(idEditar);
                setUsuario(registro);
                
                //Guardamos los archivos para luego poder compararlos
                const _listaArchivosAntiguos = {}
                for (const tipoArchivo of listaTipoArchivos) {
                    _listaArchivosAntiguos[tipoArchivo['nombre']] = registro[(tipoArchivo.nombre).toLowerCase()]
                }
                setListaTipoArchivosAntiguos(_listaArchivosAntiguos);

                // Obtenemos el nombre del idioma seleccionado
                const registroIdioma = registrosIdiomas.find((element) => element.id === registro.idiomaId).nombre;
                setIdiomaSeleccionado(registroIdioma);
                // Obtenemos el nombre del rol
                const registroRol = registrosRoles.find((element) => element.id === registro.rolId).nombre;
                setRolSeleccionado(registroRol);
                const filtro = JSON.stringify({
                    where: {
                        and: {
                            usuario_id: idEditar
                        }
                    }
                });
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validacionesImagenes = () => {
        for (const tipoArchivo of listaTipoArchivos) {
            //Comprueba si el tipo de archivo es una imagen para validar su extension
            if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                //Comprueba que el input haya sido modificado
                if (usuario[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                    //Comprueba que la imagen es del tipo valido
                    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff", "image/avif"];
                    if (!(allowedTypes.includes(usuario[(tipoArchivo.nombre).toLowerCase()].type))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const validaciones = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //Valida que los campos no esten vacios
        const validaNombre = usuario.nombre === undefined || usuario.nombre === "";
        const validaTelefono = usuario.telefono === undefined || usuario.telefono === "";
        const validaIdioma = idiomaSeleccionado == null || idiomaSeleccionado.codigo === "";
        const validaRol = rolSeleccionado == null || rolSeleccionado.codigo === "";
        const validaImagenes = validacionesImagenes();
        const validaEmail = usuario.mail === undefined || usuario.mail === "";

        if (validaNombre || validaTelefono /* || validaEmpresa */ || validaIdioma || validaRol || validaEmail ) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        if (validaImagenes) {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Las imagenes deben de tener el formato correcto' }),
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
        return (!validaNombre && !validaImagenes && !validaTelefono // && !validaEmpresa 
            && !validaIdioma && !validaRol && !validaEmail && regexEmail.test(usuario.mail));
    }

    const cancelarEdicion = () => {
        setIdEditar(null)
        //setAccion("consulta");
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

                        //Sube las imagenes al servidor
                        for (const tipoArchivo of listaTipoArchivos) {
                            //Comprueba que el input haya sido modificado
                            if (usuario[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                                await insertarArchivo(usuario[(tipoArchivo.nombre).toLowerCase()], nuevoRegistro.id, tipoArchivo, seccion, usuarioCreacion)
                            }
                        }
                        
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
                    //Si se edita un examen existente Hacemos el patch del examen
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
                    //Compara los archivos existentes con los de la subida para borrar o añadir en caso de que sea necesario
                    await editarArchivos(usuario, objGuardar.id, seccion, usuarioCreacion, listaTipoArchivos, listaTipoArchivosAntiguos)

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
//Compara los archivos del registro antes de ser editado para actualizar los archivos
    const editarArchivos = async (registro, id, seccion, usuario, listaTipoArchivos, listaTipoArchivosAntiguos) => {
        for (const tipoArchivo of listaTipoArchivos) {
            if (Array.isArray(registro[(tipoArchivo.nombre).toLowerCase()])) {
                await editarArchivosMultiples(registro, id, seccion, listaTipoArchivos, listaTipoArchivosAntiguos, usuario);
                return
            }
            //Comprueba que si ha añadido una imagen
            if (registro[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                //Si ya existia antes una imagen, hay que eliminarla junto a su version redimensionada
                if (listaTipoArchivosAntiguos[tipoArchivo['nombre']] != null) {
                    await borrarFichero(listaTipoArchivosAntiguos[tipoArchivo['nombre']]);
                    await deleteArchivo(registro[`${(tipoArchivo.nombre).toLowerCase()}Id`]);
                    //Tambien borra la version sin redimensionar
                    if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                        let url = (listaTipoArchivosAntiguos[tipoArchivo['nombre']]).replace(/(\/[^\/]+\/)1250x850_([^\/]+\.\w+)$/, '$1$2');
                        await borrarFichero(url);

                        //Borra el avatar
                        url = url.replace(/(\/[^\/]+\/)([^\/]+\.\w+)$/, '$132x32_$2');
                        await borrarFichero(url);
                    }

                }
                //Se inserta la imagen modificada
                await insertarArchivo(registro[(tipoArchivo.nombre).toLowerCase()], id, tipoArchivo, seccion, usuario)
            }
            else {
                //Si ya existia antes una imagen y se ha borrado, hay que eliminarla junto a su version redimensionada
                if (listaTipoArchivosAntiguos[tipoArchivo['nombre']] !== null && registro[(tipoArchivo.nombre).toLowerCase()] === null) {
                    await borrarFichero(listaTipoArchivosAntiguos[tipoArchivo['nombre']]);
                    await deleteArchivo(registro[`${(tipoArchivo.nombre).toLowerCase()}Id`]);
                    //Tambien borra la version sin redimensionar
                    if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                        let url = (listaTipoArchivosAntiguos[tipoArchivo['nombre']]).replace(/(\/[^\/]+\/)1250x850_([^\/]+\.\w+)$/, '$1$2');
                        await borrarFichero(url);

                        //Borra el avatar
                        url = url.replace(/(\/[^\/]+\/)([^\/]+\.\w+)$/, '$132x32_$2');
                        await borrarFichero(url);
                    }
                }
            }
        }
    };

    
    const insertarArchivo = async (archivo, id, tipoArchivo, seccion, usuario) => {
        //Comprueba que el input haya sido modificado
        if (archivo?.type !== undefined) {
            //Comprueba si el tipo de archivo es una imagen para la subida
            let response = null;
            if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                if (seccion === 'Usuario') {
                    response = await postSubirAvatar(seccion, archivo.name, archivo);
                }
                response = await postSubirImagen(seccion, archivo.name, archivo);
            }
            else {
                response = await postSubirFichero(seccion, archivo.name, archivo);
            }
            //Hace el insert en la tabla de archivos
            const objArchivo = {}
            objArchivo['usuCreacion'] = usuario;
            objArchivo['empresaId'] = JSON.parse(localStorage.getItem('userDataNeatpallet')).id
            objArchivo['tipoArchivoId'] = tipoArchivo.id;
            objArchivo['url'] = response.originalUrl;
            objArchivo['idTabla'] = id;
            objArchivo['tabla'] = seccion.toLowerCase();
            await postArchivo(objArchivo);
        }
    }

    //Compara los archivos del registro antes de ser editado para actualizar los archivos
    const editarArchivosMultiples = async (registro, id, seccion, listaTipoArchivos, listaTipoArchivosAlumnoAntiguos, usuario) => {
        for (const tipoArchivo of listaTipoArchivos) {
            if (listaTipoArchivosAlumnoAntiguos[tipoArchivo.nombre]) {
                //Recorre los archivos antiguos para eliminarlos en caso de que sea necesario
                for (const archivoAntiguo of listaTipoArchivosAlumnoAntiguos[tipoArchivo.nombre]) {
                    //Obtiene el nombre del archivo para compararlo
                    const archivoAntiguoNombre = archivoAntiguo.url.split('/').pop();
                    //Comprueba si el archivo antiguo existe en el registro
                    const archivoExisteEnRegistro = registro[(tipoArchivo.nombre).toLowerCase()].find(item => item.name === archivoAntiguoNombre || item.url === archivoAntiguo.url);

                    //Si es undefined, significa que no existe en el array de registro por lo que se ha eliminado
                    if (archivoExisteEnRegistro === undefined) {
                        await borrarFichero(archivoAntiguo.url);
                        await deleteArchivo(archivoAntiguo.id);
                        //Tambien borra la version sin redimensionar
                        //Funcion provisional porque no tengo manera de saber si x archivo de x tipo de input es imagen o no solo con el url
                        if (esUrlImagen(archivoAntiguo.url)) {
                            const url = (archivoAntiguo.url).replace(/(\/[^\/]+\/)1250x850_([^\/]+\.\w+)$/, '$1$2');
                            await borrarFichero(url);
                        }
                    }
                }
            }
            if (registro[(tipoArchivo.nombre).toLowerCase()]) {
                for (const archivoNuevo of registro[(tipoArchivo.nombre).toLowerCase()]) {
                    //Comprueba si el archivo antiguo existe en el registro
                    if (listaTipoArchivosAlumnoAntiguos[tipoArchivo.nombre]) {
                        const archivoExisteEnArchivosAntiguos = listaTipoArchivosAlumnoAntiguos[tipoArchivo.nombre].find(item => item.url.split('/').pop() === archivoNuevo.name || item.url === archivoNuevo.url);
                        //Si es undefined, significa que no existe en el array de los archivos antiguos por lo que se ha insertado
                        if (archivoExisteEnArchivosAntiguos === undefined) {
                            await insertarArchivo(archivoNuevo, id, tipoArchivo, seccion, usuario);
                        }
                    }
                    else {
                        //Si antes no existia ni un solo archivo, no nos molestamos en comprobar si existe o no en el registro
                        await insertarArchivo(archivoNuevo, id, tipoArchivo, seccion, usuario);
                    }
                }
            }
        }
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
                            listaEmpresas={listaEmpresas}
                            empresaSeleccionada={empresaSeleccionada}
                            setEmpresaSeleccionada={setEmpresaSeleccionada}
                            listaRoles={listaRoles}
                            rolSeleccionado={rolSeleccionado}
                            setRolSeleccionado={setRolSeleccionado}
                            listaIdiomas={listaIdiomas}
                            idiomaSeleccionado={idiomaSeleccionado}
                            setIdiomaSeleccionado={setIdiomaSeleccionado}
                            estadoGuardando={estadoGuardando}
                            listaTipoArchivos={listaTipoArchivos}
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