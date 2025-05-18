import React, { useContext, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { getIdiomas } from '@/app/api-endpoints/idioma';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AppBreadcrumb from './AppBreadCrumb';

const AppTopbar = React.forwardRef((props, ref) => {
    const { onMenuToggle, showProfileSidebar, showConfigSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);

    const onConfigButtonClick = () => {
        showConfigSidebar();
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
    }));

    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownValues, setDropdownValues] = useState([]);
    useEffect(() => {
        obtenerListaIdiomas();
    }, []);

    const obtenerListaIdiomas = async () => {
        const registrosIdiomas = await getIdiomas();
        const jsonDeIdiomas = registrosIdiomas.map((idioma) => ({
            name: idioma.nombre,
            code: idioma.iso
        }));
        const idiomaGuardado = localStorage.getItem("idioma");
        if (idiomaGuardado) {
            const idiomaEncontrado = jsonDeIdiomas.find((idioma) => idioma.code === idiomaGuardado);
            if (idiomaEncontrado) {
                setDropdownValue(idiomaEncontrado);
            }
        }
        setDropdownValues(jsonDeIdiomas);
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

                <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
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
                                src="/layout/images/avatar/avatar.png"
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