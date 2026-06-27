"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postRol, patchRol } from "@/app/api-endpoints/rol";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosRol from "./EditarDatosRol";
import { useIntl } from 'react-intl';

const EditarRol = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable }) => {
    const toast = useRef(null);
    const [rol, setRol] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const [pantallaDashboardSeleccionada, setPantallaDashboardSeleccionada] = useState(null);
    const intl = useIntl();

    const pantallasDashboard = [
        { nombre: intl.formatMessage({ id: 'Empresas' }), url: '/tablas-maestras/empresa/' },
        { nombre: intl.formatMessage({ id: 'Roles' }), url: '/tablas-maestras/rol/' },
        { nombre: intl.formatMessage({ id: 'Permisos' }), url: '/tablas-maestras/permiso/' },
        { nombre: intl.formatMessage({ id: 'PaÃ­ses' }), url: '/tablas-maestras/pais/' },
        { nombre: intl.formatMessage({ id: 'ParÃ¡metros' }), url: '/parametro/' },
        { nombre: intl.formatMessage({ id: 'Idiomas' }), url: '/tablas-maestras/idioma/' },
        { nombre: intl.formatMessage({ id: 'Traducciones' }), url: '/tablas-maestras/traduccion/' },
        { nombre: intl.formatMessage({ id: 'Tipo Sensor' }), url: '/tipo-sensor/' },
        { nombre: intl.formatMessage({ id: 'Tipo CarrocerÃ­a' }), url: '/tipo-carroceria/' },
        { nombre: intl.formatMessage({ id: 'Tipo Transporte' }), url: '/tipo-transporte/' },
        { nombre: intl.formatMessage({ id: 'ParÃ¡metros permitidos de Pallet' }), url: '/pallet-parametro/' },
        { nombre: intl.formatMessage({ id: 'Eventos Configuracion' }), url: '/eventos-configuracion/' },
        { nombre: intl.formatMessage({ id: 'Pallet global' }), url: '/pallet/' },
        { nombre: intl.formatMessage({ id: 'Pallets asignados' }), url: '/tablas-maestras/pallets-asignados/' },
        { nombre: intl.formatMessage({ id: 'Informes contenido' }), url: '/envio-contenido/' },
        { nombre: intl.formatMessage({ id: 'Informes movimientos' }), url: '/envio-movimiento/' },
        { nombre: intl.formatMessage({ id: 'Informes pallets' }), url: '/envio-pallet/' },
        { nombre: intl.formatMessage({ id: 'Logs de sistema' }), url: '/logs-incorrectos/' },
        { nombre: intl.formatMessage({ id: 'Logs de usuario' }), url: '/tablas-maestras/log_usuario/' },
    ];

    useEffect(() => {
        //
        //Lo marcamos aqui como saync ya que useEffect no permite ser async
        //
        const fetchData = async () => {
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                const pantallaDashboard = (pantallasDashboard.find(cod => cod.url === registro.dashboardUrl));
                if (pantallaDashboard) {
                    setPantallaDashboardSeleccionada(pantallaDashboard.nombre);
                }
                setRol(registro);
            }
        };
        fetchData();
    }, [idEditar, rowData]);

    const validaciones = async () => {
        const validaNombre = rol.nombre === undefined || rol.nombre === "";
        const validaPantallaInicio = pantallaDashboardSeleccionada === null || pantallaDashboardSeleccionada === "";
        const validaOrden = rol.orden === undefined || rol.orden === null || rol.orden === "";
        return (!validaNombre && !validaPantallaInicio && !validaOrden);
    };

    const guardarRol = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);
        if (await validaciones()) {
            let objGuardar = { ...rol };
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                delete objGuardar.id;
                delete objGuardar.nombreEmpresa;
                objGuardar['usuCreacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                if (pantallaDashboardSeleccionada) {
                    objGuardar['dashboardUrl'] = pantallasDashboard.find(dashboard => dashboard.nombre === pantallaDashboardSeleccionada).url;
                }

                const nuevoRegistro = await postRol(objGuardar);

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
                delete objGuardar.nombreEmpresa;
                objGuardar['usuModificacion'] = usuarioActual;
                objGuardar['empresaId'] = getUsuarioSesion()?.empresaId;
                if (pantallaDashboardSeleccionada) {
                    objGuardar['dashboardUrl'] = pantallasDashboard.find(dashboard => dashboard.nombre === pantallaDashboardSeleccionada).url;
                }
                await patchRol(objGuardar.id, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
            }
        }
        else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Todos los campos deben de ser rellenados' }),
                life: 3000,
            });
        }
        setEstadoGuardandoBoton(false);
    };

    const cancelarEdicion = () => {
        setIdEditar(null);
    };

    const header = idEditar > 0 ? (editable ? intl.formatMessage({ id: 'Editar' }) : intl.formatMessage({ id: 'Ver' })) : intl.formatMessage({ id: 'Nuevo' });

    return (
        <div>
            <div className="grid Empresa">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Rol' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Configura el orden, nombre, pantalla de inicio y estado del rol.</p>
                        <EditarDatosRol
                            rol={rol}
                            setRol={setRol}
                            estadoGuardando={estadoGuardando}
                            pantallasDashboard={pantallasDashboard}
                            pantallaDashboardSeleccionada={pantallaDashboardSeleccionada}
                            setPantallaDashboardSeleccionada={setPantallaDashboardSeleccionada}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarRol}
                                    disabled={estadoGuardandoBoton}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarRol;
