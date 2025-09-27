import React, { useContext, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { getIdiomas } from '@/app/api-endpoints/idioma';
import { Dropdown } from 'primereact/dropdown';
import { getVistaTipoArchivoEmpresaSeccion } from "@/app/api-endpoints/tipo_archivo";
import { getVistaArchivoEmpresa } from "@/app/api-endpoints/archivo";
import { getEmpresa } from "@/app/api-endpoints/empresa";
import { getVistaEmpresaRol } from "@/app/api-endpoints/rol";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getUsuarioAvatar } from "@/app/api-endpoints/usuario";
import AppBreadcrumb from './AppBreadCrumb';
import { devuelveBasePath, getUsuarioSesion } from "@/app/utility/Utils";
import { set } from 'date-fns';

const AppTopbar = React.forwardRef((props, ref) => {
    const { onMenuToggle, showProfileSidebar, showConfigSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const [avatar, setAvatar] = useState(null);

    const onConfigButtonClick = () => {
        showConfigSidebar();
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
    }));

    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownValues, setDropdownValues] = useState([]);
    const [empresaNombre, setEmpresaNombre] = useState('');
    useEffect(() => {

        const fetchData = async () => {
            await obtenerListaIdiomas();
            setAvatar(getUsuarioSesion()?.avatar);
            //Si el rol del usuario tiene permisos para ver la empresa
            if (await obtenerRolUsuario()) {
                obtenerNombreEmpresa();
                //obtenerLogoEmpresa()
            }

        }
        fetchData();
    }, []);

    const obtenerListaIdiomas = async () => {
        // const filtro = {
        //     where: {
        //         and: {
        //             activo_sn: 'S'
        //         }
        //     }
        // }
        // const registrosIdiomas = await getIdiomas(JSON.stringify(filtro));
        const registrosIdiomas = await getIdiomas();
        const jsonDeIdiomas = registrosIdiomas.map((idioma) => ({
            name: idioma.nombre,
            code: idioma.iso
        })).sort((a, b) => a.name.localeCompare(b.name));;
        const idiomaGuardado = localStorage.getItem("idioma");
        if (idiomaGuardado) {
            const idiomaEncontrado = jsonDeIdiomas.find((idioma) => idioma.code === idiomaGuardado);
            if (idiomaEncontrado) {
                setDropdownValue(idiomaEncontrado);
            }
        }
        setDropdownValues(jsonDeIdiomas);
    }

    const obtenerRolUsuario = async () => {
        const usuario = getUsuarioSesion();
        const queryParamsRol = {
            where: {
                and: {
                    id: usuario.rolId
                }
            },
        };
        const rol = await getVistaEmpresaRol(JSON.stringify(queryParamsRol));
        //setMuestraEmpresa(rol[0].muestraEmpresa === 'S')
        return rol[0].muestraEmpresa === 'S'
    }

    const obtenerNombreEmpresa = async () => {
        const empresa = await getEmpresa(Number(localStorage.getItem('empresa')));
        setEmpresaNombre(empresa.nombre)
    }



    const cambiarIdioma = (idioma) => {
        setDropdownValue(idioma);
        localStorage.setItem("idioma", idioma.code);
        window.location.reload();
    }

    return (
        <div className="layout-topbar">
            <div className="topbar-start">
                <button
                    ref={menubuttonRef}
                    type="button"
                    className="topbar-menubutton p-link p-trigger"
                    onClick={onMenuToggle}
                >
                    <i className="pi pi-bars"></i>
                </button>

                {/* <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb> */}
            </div>

            <div className="topbar-end">
                <ul className="topbar-menu">
                    {false && (
                        //Uso esta para "comentar" esta etiqueta html
                        <li className="topbar-search">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search"></i>
                                <InputText
                                    type="text"
                                    placeholder="Search"
                                    className="w-12rem sm:w-full"
                                />
                            </span>
                        </li>
                    )}
                    {false && (
                        <li className="ml-3">
                            <Button
                                type="button"
                                icon="pi pi-cog"
                                text
                                rounded
                                severity="secondary"
                                className="flex-shrink-0"
                                onClick={onConfigButtonClick}
                            ></Button>
                        </li>
                    )}
                    <li className="ml-3">

                        
                        <h5 className="m-0 mr-2">{empresaNombre}</h5>
                    </li>
                    <li className="ml-3">
                        <Dropdown
                            value={dropdownValue}
                            onChange={(e) => cambiarIdioma(e.value)}
                            options={dropdownValues}
                            optionLabel="name"
                            placeholder="Select"
                        />
                    </li>
                    <li className="topbar-profile">
                        <button
                            type="button"
                            className="p-link"
                            onClick={showProfileSidebar}
                        >
                            <img
                                src={avatar}
                                alt="Profile"
                            />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default AppTopbar;