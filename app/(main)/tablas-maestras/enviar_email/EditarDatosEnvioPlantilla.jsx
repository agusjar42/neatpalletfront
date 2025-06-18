import React, { useState, useEffect, useRef, useCallback } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import ArchivoMultipleInput from "../../../components/shared/archivo_multiple_input";
import { MultiSelect } from 'primereact/multiselect';
import ArchivoInput from "../../../components/shared/archivo_input";
import { useIntl } from 'react-intl';

const EditarDatosEnvioPlantilla = ({ correoPlantilla, setCorreoPlantilla, contenidoWysiwyg, setContenidoWysiwyg,
    listaIdiomas, idiomaSeleccionado, setIdiomaSeleccionado, listaTipoArchivos,
    usuarios, estadoGuardando, plantillaSeleccionada, setPlantillaSeleccionada, listaPlantillas,
    usuariosSeleccionados, setUsuariosSeleccionados }) => {

    const intl = useIntl();
    const editorRef = useRef(null);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const options = dropdownAbierto ? listaIdiomas.map(registro => registro.nombre) : [idiomaSeleccionado || '', ...listaIdiomas.map(registro => registro.nombre)];

    const inputsDinamicos = [];
    for (const tipoArchivo of listaTipoArchivos) {
        if (tipoArchivo.multiple === 'S') {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label>{intl.formatMessage({ id: tipoArchivo.nombre })}</label>
                    <ArchivoMultipleInput
                        registro={correoPlantilla}
                        setRegistro={setCorreoPlantilla}
                        archivoTipo={tipoArchivo.tipo}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                        espacioMaximo={1000000}
                    />
                </div>
            );
        } else {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label>{intl.formatMessage({ id: tipoArchivo.nombre })}</label>
                    <ArchivoInput
                        registro={correoPlantilla}
                        setRegistro={setCorreoPlantilla}
                        archivoTipo={tipoArchivo.tipo}
                        archivoHeader={tipoArchivo.nombre}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (editorRef.current && editorRef.current.getQuill) {
                const quillInstance = editorRef.current.getQuill();
                if (quillInstance) {
                    const currentContent = quillInstance.root.innerHTML;
                    if (currentContent !== contenidoWysiwyg) {
                        quillInstance.clipboard.dangerouslyPasteHTML(contenidoWysiwyg);
                    }
                }
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [contenidoWysiwyg]);

    const manejarCambioWysiwyg = useCallback((e) => {
        const nuevoContenido = e.htmlValue;
        if (nuevoContenido !== contenidoWysiwyg) {
            setContenidoWysiwyg(nuevoContenido);
        }
    }, [contenidoWysiwyg, setContenidoWysiwyg]);

    return (
        <Fieldset>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="plantilla"><b>{intl.formatMessage({ id: 'Plantilla' })}*</b></label>
                    <Dropdown
                        value={plantillaSeleccionada || ""}
                        options={listaPlantillas.map(plantilla => ({ label: plantilla.nombre, value: plantilla.id }))}
                        onChange={(e) => setPlantillaSeleccionada(e.value)}
                        onClick={() => setDropdownAbierto(true)}
                        className={`p-column-filter ${(estadoGuardando && (plantillaSeleccionada == null || plantillaSeleccionada === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona una plantilla' })}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="idioma"><b>{intl.formatMessage({ id: 'Idioma' })}*</b></label>
                    <Dropdown
                        value={idiomaSeleccionado || ""}
                        onChange={(e) => setIdiomaSeleccionado(e.value)}
                        options={options}
                        onClick={() => setDropdownAbierto(true)}
                        className={`p-column-filter ${(estadoGuardando && (idiomaSeleccionado == null || idiomaSeleccionado === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un idioma' })}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="usuarios"><b>{intl.formatMessage({ id: 'Usuarios' })}*</b></label>
                    <MultiSelect value={usuariosSeleccionados} onChange={(e) => {
                        setUsuariosSeleccionados(e.value)
                    }} options={usuarios} optionLabel="nombre" display="chip"
                        style={{ overflow: 'hidden' }}
                        maxSelectedLabels={6}
                        className={`p-column-filter ${(estadoGuardando && (usuariosSeleccionados == null || usuariosSeleccionados.length === 0)) ? "p-invalid" : ""}`}
                        placeholder={intl.formatMessage({ id: 'Selecciona los usuarios' })} />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label htmlFor="titulo"><b>{intl.formatMessage({ id: 'Título del mail' })}*</b></label>
                    <InputText
                        value={correoPlantilla.titulo}
                        placeholder={intl.formatMessage({ id: 'Título del mail' })}
                        onChange={(e) => setCorreoPlantilla({ ...correoPlantilla, titulo: e.target.value })}
                        className={`${(estadoGuardando && (correoPlantilla?.titulo === "" || correoPlantilla.titulo == undefined)) ? "p-invalid" : ""}`}
                        rows={5}
                        cols={30}
                        maxLength={100}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label htmlFor="cuerpo"><b>{intl.formatMessage({ id: 'Cuerpo del mensaje' })}*</b></label>
                    <Editor
                        ref={editorRef}
                        onTextChange={manejarCambioWysiwyg}
                        style={{ height: '320px', borderColor: estadoGuardando && contenidoWysiwyg === null ? 'red' : undefined }}
                    />
                    <label>
                        {`${intl.formatMessage({ id: 'Palabras' })}: ${(((contenidoWysiwyg || '').replace(/<\/?[^>]+(>|$)/g, '')).replace(/\s/g, '')).length
                            }`}
                    </label>
                </div>
                {
                    ...inputsDinamicos
                }

            </div>

        </Fieldset>
    );
};

export default EditarDatosEnvioPlantilla;
