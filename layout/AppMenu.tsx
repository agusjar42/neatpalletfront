import type { MenuModel } from "@/types";
import AppSubMenu from "./AppSubMenu";
import React, { useContext, useEffect, useState } from 'react';
import { AbilityContext } from '@/app/utility/Can'
import { tieneUsuarioPermiso } from "@/app/components/shared/componentes";
import { Menu } from 'primereact/menu';
import { useIntl } from 'react-intl'
const AppMenu = () => {
    const intl = useIntl();
    const ability = useContext(AbilityContext);
    const [permisos, setPermisos] = useState<{ [key: string]: boolean }>({}); 

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const _permisos: { [key: string]: boolean } = {}

                const permisoEmpresas = await tieneUsuarioPermiso("Neatpallet", "Empresas", "Acceder");
                _permisos['empresas'] = permisoEmpresas ? true : false;
                
                const permisoIdiomas = await tieneUsuarioPermiso("Neatpallet", "Idiomas", "Acceder");
                _permisos['idiomas'] = permisoIdiomas ? true : false;
                
                const permisoLogsUsuarios = await tieneUsuarioPermiso("Neatpallet", "Logs de usuarios", "Acceder");
                _permisos['logs_usuarios'] = permisoLogsUsuarios ? true : false;

                const permisoTiposArchivo = await tieneUsuarioPermiso("Neatpallet", "Tipos de archivo", "Acceder");
                _permisos['tipos_archivo'] = permisoTiposArchivo ? true : false;
                
                const permisoSecciones = await tieneUsuarioPermiso("Neatpallet", "Secciones", "Acceder");
                _permisos['secciones'] = permisoSecciones ? true : false;
                
                const permisoArchivos = await tieneUsuarioPermiso("Neatpallet", "Archivos", "Acceder");
                _permisos['archivos'] = permisoArchivos ? true : false;
                
                const permisoTraducciones = await tieneUsuarioPermiso("Neatpallet", "Traducciones", "Acceder");
                _permisos['traducciones'] = permisoTraducciones ? true : false;
               
                const permisoRoles = await tieneUsuarioPermiso("Neatpallet", "Roles", "Acceder");
                _permisos['roles'] = permisoRoles ? true : false;
                
                const permisoPermisos = await tieneUsuarioPermiso("Neatpallet", "Permisos", "Acceder");
                _permisos['permisos'] = permisoPermisos ? true : false;
   
                const permisoUsuarios = await tieneUsuarioPermiso("Neatpallet", "Usuarios", "Acceder");
                _permisos['usuarios'] = permisoUsuarios ? true : false;

                setPermisos(_permisos);
                
            } catch (error) {
                console.error('Error checking permission:', error);
            }
        };

        checkPermission();
    }, [ability]);
    //Segun el entorno se carga un menu u otro
    let model: MenuModel[] = [];    
        model = [
            {
                label: intl.formatMessage({ id: 'Administracion' }),
                icon: "pi pi-home",
                items: ([
                    {
                        label: intl.formatMessage({ id: 'Tablas de sistema' }),
                        icon: "pi pi-fw pi-cog",
                        items: [
                            permisos['empresas'] ? {
                                "label": intl.formatMessage({ id: 'Empresa' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/empresa"
                            } : null,
                            permisos['secciones'] ? {
                                "label": intl.formatMessage({ id: 'Seccion' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/seccion"
                            } : null,
                            permisos['tipos_archivo'] ? {
                                "label": intl.formatMessage({ id: 'Tipo de archivo' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/tipo_archivo"
                            } : null,
                            permisos['archivos'] ? {
                                "label": intl.formatMessage({ id: 'Archivos' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/archivo"
                            } : null,                           
                            permisos['roles'] ? {
                                label: intl.formatMessage({ id: 'Rol' }),
                                icon: 'pi pi-fw pi-minus',
                                to: '/tablas-maestras/rol'
                            } : null,
                            permisos['logs_usuarios'] ? {
                                "label": intl.formatMessage({ id: 'Log de usuarios' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/log_usuario"
                            } : null,
                            permisos['permisos'] ? {
                                "label": intl.formatMessage({ id: 'Permiso' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/permiso"
                            } : null,
                            permisos['idiomas'] ? {
                                "label": intl.formatMessage({ id: 'Idioma' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/idioma"
                            } : null,
                            permisos['traducciones'] ? {
                                "label": intl.formatMessage({ id: 'Traduccion' }),
                                "icon": "pi pi-fw pi-minus",
                                "to": "/tablas-maestras/traduccion"
                            } : null
                        ].filter(item => item !== null)
                    },                        
                ] as MenuModel[]).filter(item => item !== null) // Filtra los elementos null
            },                         
        ];
    return <AppSubMenu model={model} />;
};

export default AppMenu;
