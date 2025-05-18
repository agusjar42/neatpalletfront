"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { patchUsuario, postUsuario, getUsuarioTiposUsuario } from "@/app/api-endpoints/usuario";
import { postUsuarioTipos, deleteUsuarioTipos, getUsuarioTipos } from "@/app/api-endpoints/usuario_tipos";
import { getRol } from "@/app/api-endpoints/rol";
import { useIntl } from 'react-intl'
import { TabView, TabPanel } from 'primereact/tabview';
import { getIdiomas } from "@/app/api-endpoints/idioma";
import { getEmpresas } from "@/app/api-endpoints/empresa";
import { getVistaTipoIvaPais } from "@/app/api-endpoints/tipo_iva";
import { borrarFichero, postSubirImagen, postSubirFichero, postSubirAvatar } from "@/app/api-endpoints/ficheros"
import { postArchivo, deleteArchivo } from "@/app/api-endpoints/archivo"
import { getCentrosEscolares, postCentroEscolar, patchCentroEscolar, deleteCentroEscolar } from "@/app/api-endpoints/centro_escolar";
import ArchivosUsuario from "./archivosUsuario";
import PasswordHistorico from "./passwordHistorico";
import CuentaBancariaUsuario from "./cuenta_bancaria/cuentaBancariaUsuario";
import DatosParaFacutras from "./datos_facturas/datosParaFacturas";
import FacturasEmitidas from "./facturas_emitidas/facturaEmitida";
import EditarCentroEscolar from "./centro_escolar/EditarDatosCentroEscolar";
import Cobros from "./cobros/page";
import Incidencias from "./incidencias/incidenciasUsuario";

const EditarUsuario = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const intl = useIntl()
    const toast = useRef(null);
    const [usuario, setUsuario] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [listaIdiomas, setListaIdiomas] = useState([]);
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState(null);
    const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
    const [tiposSeleccionadosAntiguo, setTiposSeleccionadosAntiguo] = useState([]);
    const [listaTiposIva, setListaTiposIva] = useState([]);
    const [tipoIvaSeleccionado, setTipoIvaSeleccionado] = useState(null);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [listaRoles, setListaRoles] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [codigoPaisSeleccionado, setCodigoPaisSeleccionado] = useState(null);
    const [codigoPaisSeleccionadoCentroEscolar, setCodigoPaisSeleccionadoCentroEscolar] = useState(null);
    const [listaTipoArchivosAntiguos, setListaTipoArchivosAntiguos] = useState([]);
    const [pestanyasTipoUsuario, setPestanyasTipoUsuario] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const emptyRegistroCentro = {
        id: 0,
        nombre: "",
        horario: "",
        personaContacto: "",
        emailPersonaContacto: "",
        activoSn: "N",
    }
    const [centroEscolar, setCentroEscolar] = useState(emptyRegistroCentro);

    const codigoPaises = [
        { pais: `${intl.formatMessage({ id: 'Argentina' })} (+54)`, codigo: "+54" },
        { pais: `${intl.formatMessage({ id: 'Brasil' })} (+55)`, codigo: "+55" },
        { pais: `${intl.formatMessage({ id: 'Canada' })} (+1)`, codigo: "+1" },
        { pais: `${intl.formatMessage({ id: 'Chile' })} (+56)`, codigo: "+56" },
        { pais: `${intl.formatMessage({ id: 'Colombia' })} (+57)`, codigo: "+57" },
        { pais: `${intl.formatMessage({ id: 'Costa Rica' })} (+506)`, codigo: "+506" },
        { pais: `${intl.formatMessage({ id: 'Cuba' })} (+53)`, codigo: "+53" },
        { pais: `${intl.formatMessage({ id: 'Ecuador' })} (+593)`, codigo: "+593" },
        { pais: `${intl.formatMessage({ id: 'Estados Unidos' })} (+1)`, codigo: "+1" },
        { pais: `${intl.formatMessage({ id: 'Espana' })} (+34)`, codigo: "+34" },
        { pais: `${intl.formatMessage({ id: 'Francia' })} (+33)`, codigo: "+33" },
        { pais: `${intl.formatMessage({ id: 'Guatemala' })} (+502)`, codigo: "+502" },
        { pais: `${intl.formatMessage({ id: 'Honduras' })} (+504)`, codigo: "+504" },
        { pais: `${intl.formatMessage({ id: 'Italia' })} (+39)`, codigo: "+39" },
        { pais: `${intl.formatMessage({ id: 'Jamaica' })} (+1-876)`, codigo: "+1-876" },
        { pais: `${intl.formatMessage({ id: 'Mexico' })} (+52)`, codigo: "+52" },
        { pais: `${intl.formatMessage({ id: 'Nicaragua' })} (+505)`, codigo: "+505" },
        { pais: `${intl.formatMessage({ id: 'Panama' })} (+507)`, codigo: "+507" },
        { pais: `${intl.formatMessage({ id: 'Paraguay' })} (+595)`, codigo: "+595" },
        { pais: `${intl.formatMessage({ id: 'Peru' })} (+51)`, codigo: "+51" },
        { pais: `${intl.formatMessage({ id: 'Portugal' })} (+351)`, codigo: "+351" },
        { pais: `${intl.formatMessage({ id: 'Republica Dominicana' })} (+1-809)`, codigo: "+1-809" },
        { pais: `${intl.formatMessage({ id: 'Uruguay' })} (+598)`, codigo: "+598" },
        { pais: `${intl.formatMessage({ id: 'Venezuela' })} (+58)`, codigo: "+58" },
        { pais: `${intl.formatMessage({ id: 'Reino Unido' })} (+44)`, codigo: "+44" }
    ];

    const tipos = [
        { nombre: intl.formatMessage({ id: 'Profesor' }), id: 1 },
        { nombre: intl.formatMessage({ id: 'Familia acogida' }), id: 2 },
        { nombre: intl.formatMessage({ id: 'Profesor nativo' }), id: 3 },
        { nombre: intl.formatMessage({ id: 'Acompañante' }), id: 4 },
        { nombre: intl.formatMessage({ id: 'Tutor' }), id: 5 },
        { nombre: intl.formatMessage({ id: 'Agente' }), id: 6 },
        { nombre: intl.formatMessage({ id: 'Centro escolar' }), id: 7 },
        { nombre: intl.formatMessage({ id: 'Alumno' }), id: 8 },
    ]

    useEffect(() => {
        //
        //Lo marcamos aquí como saync ya que useEffect no permite ser async porque espera que la función que le pases devueva undefined o una función para limpiar el efecto. 
        //Una función async devuelve una promesa, lo cual no es compatible con el comportamiento esperado de useEffect.
        //
        const fetchData = async () => {
            // Obtenemos todos los idiomas
            const registrosIdiomas = await getIdiomas();
            const jsonIdiomas = registrosIdiomas.map(idioma => ({
                nombre: idioma.nombre,
                id: idioma.id
            }));
            setListaIdiomas(jsonIdiomas);

            // Obtenemos todas las empresas
            const registrosEmpresas = await getEmpresas();
            const jsonEmpresas = registrosEmpresas.map(empresa => ({
                nombre: empresa.nombre,
                id: empresa.id
            }));
            setListaEmpresas(jsonEmpresas);

            // Obtenemos todas las empresas
            const registrosRoles = await getRol();
            const jsonRoles = registrosRoles.map(rol => ({
                nombre: rol.nombre,
                id: rol.id
            }));
            setListaRoles(jsonRoles);

            // Obtenemos todos los tipos de iva
            const registroIvas = await getVistaTipoIvaPais();
            const jsonIvas = registroIvas.map(iva => ({
                nombre: iva.nombrePais,
                id: iva.id
            }));
            setListaTiposIva(jsonIvas);

            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0 && rowData !== 0) {
                const filtro = JSON.stringify({
                    where: {
                        and: {
                            usuario_id: idEditar
                        }
                    }
                });
                // Obtenemos el centro escolar
                const registroCentroEscolar = await getCentrosEscolares(filtro);
                if (registroCentroEscolar.length > 0) {
                    if (registroCentroEscolar[0].telefono) {
                        const codigoSplit = (registroCentroEscolar[0].telefono).split("-");
                        const code = codigoPaises.find(cod => cod.codigo === codigoSplit[0]);
                        if (code) {
                            setCodigoPaisSeleccionadoCentroEscolar(code)
                        }
                        registroCentroEscolar[0].telefono = codigoSplit[1];
                    }
                    setCentroEscolar(registroCentroEscolar[0]);
                }
                // Obtenemos el registro a editar
                const registro = rowData.find((element) => element.id === idEditar);
                if (registro.telefono) {
                    const codigoSplit = (registro.telefono).split("-");
                    const code = codigoPaises.find(cod => cod.codigo === codigoSplit[0]);
                    if (code) {
                        setCodigoPaisSeleccionado(code)
                    }
                    registro.telefono = codigoSplit[1];
                }
                setUsuario(registro);
                // Obtenemos los tipos de usuario
                const tiposFiltros = {
                    where: {
                        usuarioId: registro.id
                    }
                }
                const registrosTipos = await getUsuarioTiposUsuario(JSON.stringify(tiposFiltros));
                const jsonTipos = registrosTipos.map(tipo => ({
                    nombre: intl.formatMessage({ id: tipo.nombre }),
                    id: tipo.id
                }));
                setTiposSeleccionados(jsonTipos);
                setTiposSeleccionadosAntiguo(registrosTipos);
                // //Generamos las pestañas
                // const pestanyasTipos = [];
                // for (const tipo of registrosTipos) {
                //     if (tipo.nombre === 'Centro escolar') {
                //         pestanyasTipos.push({
                //             title: tipo.nombre,
                //             content: <EditarCentroEscolar 
                //             usuarioId={idEditar} 
                //             centroEscolar={centroEscolar} 
                //             setCentroEscolar={setCentroEscolar} 
                //             codigoPaisSeleccionado={codigoPaisSeleccionadoCentroEscolar}
                //             setCodigoPaisSeleccionado={setCodigoPaisSeleccionadoCentroEscolar}
                //             codigoPaises={codigoPaises}
                //             />,
                //         });
                //     }
                //     else {
                //         pestanyasTipos.push({
                //             title: tipo.nombre,
                //             content: 'contenido',
                //         });
                //     }

                // }
                // setPestanyasTipoUsuario(pestanyasTipos);

                //Guardamos los archivos para luego poder compararlos
                const _listaArchivosAntiguos = {}
                for (const tipoArchivo of listaTipoArchivos) {
                    _listaArchivosAntiguos[tipoArchivo['nombre']] = registro[(tipoArchivo.nombre).toLowerCase()]
                }
                setListaTipoArchivosAntiguos(_listaArchivosAntiguos);

                // Obtenemos el nombre de la empresa
                const registroEmpresa = registrosEmpresas.find((element) => element.id === registro.empresaId).nombre;
                setEmpresaSeleccionada(registroEmpresa);
                // Obtenemos el nombre del tipo de iva
                const registroIva = registroIvas.find((element) => element.id === registro.tipo_iva_id).nombrePais;
                setTipoIvaSeleccionado(registroIva);
                // Obtenemos el nombre del idioma
                const registroIdioma = registrosIdiomas.find((element) => element.id === registro.idiomaId).nombre;
                setIdiomaSeleccionado(registroIdioma);
                // Obtenemos el nombre del rol
                const registroRol = registrosRoles.find((element) => element.id === registro.rolId).nombre;
                setRolSeleccionado(registroRol);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    useEffect(() => {
        const fetchData = async () => {

            // Si el idEditar es diferente de nuevo, entonces se va a editar
            if (idEditar !== 0 && rowData !== 0) {
                // Obtenemos los tipos de usuario
                const tiposFiltros = {
                    where: {
                        usuarioId: idEditar
                    }
                }
                const registrosTipos = await getUsuarioTiposUsuario(JSON.stringify(tiposFiltros));
                const jsonTipos = registrosTipos.map(tipo => ({
                    nombre: intl.formatMessage({ id: tipo.nombre }),
                    id: tipo.id
                }));
                setTiposSeleccionados(jsonTipos);
                setTiposSeleccionadosAntiguo(registrosTipos);
                //Generamos las pestañas
                const pestanyasTipos = [];
                for (const tipo of registrosTipos) {
                    if (tipo.nombre === 'Centro escolar') {
                        pestanyasTipos.push({
                            title: tipo.nombre,
                            content: <EditarCentroEscolar
                                usuarioId={idEditar}
                                centroEscolar={centroEscolar}
                                setCentroEscolar={setCentroEscolar}
                                codigoPaisSeleccionadoCentroEscolar={codigoPaisSeleccionadoCentroEscolar}
                                setCodigoPaisSeleccionadoCentroEscolar={setCodigoPaisSeleccionadoCentroEscolar}
                                codigoPaises={codigoPaises}
                            />,
                        });
                    }
                    else {
                        pestanyasTipos.push({
                            title: tipo.nombre,
                            content: 'contenido',
                        });
                    }

                }
                setPestanyasTipoUsuario(pestanyasTipos);
            }
        };
        fetchData();
    }, [centroEscolar, codigoPaisSeleccionadoCentroEscolar]);

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
        const validaCodigoPais = codigoPaisSeleccionado == null || codigoPaisSeleccionado.codigo === "";
        const validaTipoIva = tipoIvaSeleccionado == null || tipoIvaSeleccionado.codigo === "";
        const validaEmpresa = empresaSeleccionada == null || empresaSeleccionada.codigo === "";
        const validaIdioma = idiomaSeleccionado == null || idiomaSeleccionado.codigo === "";
        const validaRol = rolSeleccionado == null || rolSeleccionado.codigo === "";
        const validaImagenes = validacionesImagenes();
        const validaEmail = usuario.mail === undefined || usuario.mail === "";

        //Validaciones centro escolar
        if (tiposSeleccionadosAntiguo.find(tipo => tipo.nombre === 'Centro escolar')) {
            const validaNombre = centroEscolar.nombre === undefined || centroEscolar.nombre === "";
            const validaTelefono = centroEscolar.telefono === undefined || centroEscolar.telefono === "";
            const validaCodigoPaisEscolar = codigoPaisSeleccionadoCentroEscolar == null || codigoPaisSeleccionadoCentroEscolar.codigo === "";
            const validaPersonaContacto = centroEscolar.persona_contacto === undefined || centroEscolar.persona_contacto === "";
            const validaEmailContacto = centroEscolar.email_persona_contacto === undefined || centroEscolar.email_persona_contacto === "";
            const validaHorario = centroEscolar.horario === undefined || centroEscolar.horario === "";
            if (!regexEmail.test(centroEscolar.email_persona_contacto)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'El email debe de tener el formato correcto' }),
                    life: 3000,
                });
                setActiveIndex(6);
                return false;
            }
            if (validaNombre || validaTelefono || validaCodigoPaisEscolar || validaPersonaContacto || validaEmailContacto || validaHorario) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                    life: 3000,
                });
                setActiveIndex(6);
                return false;
            }
        }
        if (validaNombre || validaTelefono || validaCodigoPais || validaEmpresa || validaIdioma || validaRol || validaEmail || validaTipoIva) {
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
        //
        //Si existe algún bloque vacio entonces no se puede guardar
        //
        return (!validaNombre && !validaImagenes && !validaTelefono && !validaCodigoPais && !validaEmpresa && !validaIdioma
            && !validaRol && !validaEmail && regexEmail.test(usuario.mail) && !validaTipoIva);
    }

    const guardarUsuario = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            // Obtenemos el examen actual y solo entramos si tiene nombre y contenido
            let objGuardar = { ...usuario };
            if (objGuardar.nombre && objGuardar) {
                const usuarioCreacion = getUsuarioSesion()?.id;

                // Si estoy insertando uno nuevo
                if (idEditar === 0) {
                    // Elimino y añado los campos que no se necesitan
                    for (const archivo of listaTipoArchivos) {
                        delete objGuardar[(archivo.nombre).toLowerCase()];
                        delete objGuardar[`${(archivo.nombre).toLowerCase()}Id`];

                    }
                    delete objGuardar.id;
                    delete objGuardar.nombreIdioma;
                    delete objGuardar.nombreEmpresa;
                    delete objGuardar.nombreRol;
                    objGuardar['usuCreacion'] = usuarioCreacion;
                    objGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado).id;
                    objGuardar['empresaId'] = listaEmpresas.find(empresa => empresa.nombre === empresaSeleccionada).id;
                    objGuardar['rolId'] = listaRoles.find(rol => rol.nombre === rolSeleccionado).id;
                    objGuardar['tipoIvaId'] = listaTiposIva.find(iva => iva.nombre === tipoIvaSeleccionado).id;

                    objGuardar.telefono = codigoPaisSeleccionado.codigo + "-" + objGuardar.telefono;
                    if (objGuardar.activoSn == '') {
                        objGuardar.activoSn = 'N';
                    }

                    // Hacemos el insert del usuario
                    const nuevoRegistro = await postUsuario(objGuardar);

                    // Si se crea el examen, entonces creamos los niveles de idiomas
                    if (nuevoRegistro?.id) {

                        //Sube las imagenes al servidor
                        for (const tipoArchivo of listaTipoArchivos) {
                            //Comprueba que el input haya sido modificado
                            if (usuario[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                                await insertarArchivo(usuario, nuevoRegistro.id, tipoArchivo, seccion, usuarioCreacion)
                            }
                        }

                        //Asigna los tipos del usuario
                        for (const tipo of tiposSeleccionados) {
                            postUsuarioTipos({ usuarioId: nuevoRegistro.id, tipoId: tipo.id });
                        }

                        //Guarda el centro escolar
                        guardarCentroEscolar(nuevoRegistro.id);

                        //Usamos una variable que luego se cargara en el useEffect de la pagina principal para mostrar el toast
                        setRegistroResult("insertado");
                        //setAccion("consulta");
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
                    for (const archivo of listaTipoArchivos) {
                        delete objGuardar[(archivo.nombre).toLowerCase()];
                        delete objGuardar[`${(archivo.nombre).toLowerCase()}Id`];

                    }
                    delete objGuardar.nombreIdioma;
                    delete objGuardar.nombreEmpresa;
                    delete objGuardar.nombreRol;
                    delete objGuardar.tipo_iva_id;
                    objGuardar['usuModificacion'] = usuarioCreacion;
                    objGuardar['idiomaId'] = listaIdiomas.find(idioma => idioma.nombre === idiomaSeleccionado).id;
                    objGuardar['tipoIvaId'] = listaTiposIva.find(iva => iva.nombre === tipoIvaSeleccionado).id;
                    objGuardar['empresaId'] = listaEmpresas.find(empresa => empresa.nombre === empresaSeleccionada).id;
                    objGuardar['rolId'] = listaRoles.find(rol => rol.nombre === rolSeleccionado).id;
                    objGuardar.telefono = codigoPaisSeleccionado.codigo + "-" + objGuardar.telefono;
                    if (objGuardar.activoSn == '') {
                        objGuardar.activoSn = 'N';
                    }

                    await patchUsuario(objGuardar.id, objGuardar);
                    //Compara los archivos existentes con los de la subida para borrar o añadir en caso de que sea necesario
                    await editarArchivos(usuario, objGuardar.id, seccion, usuarioCreacion)
                    //Limpia los tipos del usuario
                    for (const tipo of tiposSeleccionadosAntiguo) {
                        const filtro = {
                            where: {
                                usuarioId: objGuardar.id,
                                tipoId: tipo.id
                            }
                        }
                        const tipoRegistro = await getUsuarioTipos(JSON.stringify(filtro))
                        await deleteUsuarioTipos(tipoRegistro[0].id);
                    }
                    //Asigna los tipos del usuario
                    for (const tipo of tiposSeleccionados) {
                        await postUsuarioTipos({ usuarioId: objGuardar.id, tipoUsuarioId: tipo.id });
                    }
                    //Guarda el centro escolar
                    guardarCentroEscolar(objGuardar.id);
                    //setAccion("consulta");
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

    const guardarCentroEscolar = async (usuarioId) => {
        let objGuardar = { ...centroEscolar };
        const centroEscolarGuardar = {
            usuarioId: usuarioId,
            nombre: objGuardar.nombre,
            horario: objGuardar.horario,
            personaContacto: objGuardar.persona_contacto,
            emailPersonaContacto: objGuardar.email_persona_contacto,
            activoSn: objGuardar.activo_sn,
            telefono: codigoPaisSeleccionado.codigo + "-" + objGuardar.telefono,
        }
        //Si existe el centro escolar y esta recien creado, lo inserta
        if (tiposSeleccionados.find(tipo => tipo.nombre === 'Centro escolar') && !tiposSeleccionadosAntiguo.find(tipo => tipo.nombre === 'Centro escolar')) {
            centroEscolarGuardar['usuCreacion'] = getUsuarioSesion()?.id;
            await postCentroEscolar(centroEscolarGuardar);
        }
        //Si existia antes se edita
        else if (tiposSeleccionadosAntiguo.find(tipo => tipo.nombre === 'Centro escolar') && tiposSeleccionados.find(tipo => tipo.nombre === 'Centro escolar')) {
            centroEscolarGuardar['usuModificacion'] = getUsuarioSesion()?.id;
            centroEscolarGuardar['id'] = objGuardar.id
            await patchCentroEscolar(centroEscolarGuardar.id, centroEscolarGuardar);
        }
        //Si existia antes y se ha eliminado, lo borra
        else if (
            tiposSeleccionadosAntiguo.find(tipo => tipo.nombre === 'Centro escolar') &&
            !tiposSeleccionados.find(tipo => tipo.nombre === 'Centro escolar')
        ) {
            await deleteCentroEscolar(objGuardar.id);
        }
    }



    //Compara los archivos del registro antes de ser editado para actualizar los archivos
    const editarArchivos = async (registro, id, seccion, usuario) => {
        for (const tipoArchivo of listaTipoArchivos) {
            //Comprueba que si ha añadido una imagen
            if (registro[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
                //Si ya existia antes una imagen, hay que eliminarla junto a su version redimensionada
                if (listaTipoArchivosAntiguos[tipoArchivo['nombre']] !== null) {
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
                await insertarArchivo(registro, id, tipoArchivo, seccion, usuario)
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

    const insertarArchivo = async (registro, id, tipoArchivo, seccion, usuario) => {
        //Comprueba que el input haya sido modificado
        if (registro[(tipoArchivo.nombre).toLowerCase()]?.type !== undefined) {
            //Comprueba si el tipo de archivo es una imagen para la subida
            let response = null;
            if ((tipoArchivo.tipo).toLowerCase() === 'imagen') {
                response = await postSubirImagen(seccion, registro[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
                response = await postSubirAvatar(seccion, registro[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
            }
            else {
                response = await postSubirFichero(seccion, registro[(tipoArchivo.nombre).toLowerCase()].name, registro[(tipoArchivo.nombre).toLowerCase()]);
            }
            //Hace el insert en la tabla de archivos
            const objArchivo = {}
            objArchivo['usuCreacion'] = usuario;
            objArchivo['empresaId'] = Number(localStorage.getItem('empresa'));
            objArchivo['tipoArchivoId'] = tipoArchivo.id;
            objArchivo['url'] = response.originalUrl;
            objArchivo['idTabla'] = id;
            objArchivo['tabla'] = seccion.toLowerCase();
            await postArchivo(objArchivo);
        }
    }


    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });
    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Usuario' })).toLowerCase()}</h2>
                        
                        <Divider type="solid" />
                        <TabView scrollable>
                            <TabPanel header={intl.formatMessage({ id: 'Informacion' })}>
                                <TabView activeIndex={activeIndex} scrollable onTabChange={(e) => setActiveIndex(e.index)}>
                                    {pestanyasTipoUsuario.map((tab) => {
                                        return (
                                            <TabPanel key={tab.title} header={tab.title}>
                                                {tab.content}
                                            </TabPanel>
                                        );
                                    })}
                                </TabView>
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Datos para facturas' })}>
                                <DatosParaFacutras usuarioId={idEditar} />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Facturas emitidas' })}>

                                <FacturasEmitidas usuarioId={idEditar} />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Mensajes' })}>

                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Cuenta bancaria' })}>
                                <CuentaBancariaUsuario usuarioId={idEditar} />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Incidencias' })}>
                                <Incidencias usuarioId={idEditar} />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Cobros' })}>
                                <Cobros usuarioId={idEditar} />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Historico de contraseñas' })}>
                                <PasswordHistorico
                                    usuarioId={idEditar}
                                />
                            </TabPanel>
                            <TabPanel header={intl.formatMessage({ id: 'Archivos' })}>
                                <ArchivosUsuario
                                    usuCreacion={idEditar}
                                />
                            </TabPanel>
                        </TabView>
                        <div className="flex justify-content-end mt-2">
                            <Button
                                label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : intl.formatMessage({ id: 'Guardar' })}
                                icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                onClick={guardarUsuario}
                                className="mr-2"
                                disabled={estadoGuardandoBoton}
                            />
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarUsuario;