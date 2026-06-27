"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { postProducto, patchProducto } from "@/app/api-endpoints/empresa-producto/index.js";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosProducto from "./EditarDatosProducto";
import { useIntl } from 'react-intl';

const EditarProducto = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, listaTipoArchivos, seccion, editable, empresaId, estoyDentroDeUnTab, onDataChange }) => {
    const toast = useRef(null);
    const [producto, setProducto] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            //
            //Si el id es distinto de cero cargamos el registro a editar
            //
            if (idEditar !== 0) {
                const registro = rowData.find((element) => element.id === idEditar);
                setProducto(registro);
            } else {
                //
                //Si es un alta nueva inicializamos la empresa de contexto
                //
                const empresaContexto = empresaId ?? getUsuarioSesion()?.empresaId;
                setProducto({ ...emptyRegistro, empresaId: empresaContexto, activoSN: "S" });
            }
        };
        fetchData();
    }, [idEditar, rowData, empresaId, emptyRegistro]);

    const validaciones = async () => {
        //
        //Si estamos dentro de un tab y tenemos una empresa, la asignamos
        //
        if (estoyDentroDeUnTab && empresaId) {
            producto.empresaId = empresaId;
        }

        //
        //Validamos los campos obligatorios del registro
        //
        const validaOrden = producto.orden === undefined || producto.orden === null || producto.orden === "";
        const validaNombre = producto.nombre === undefined || producto.nombre === "";
        const validaEmpresaId = producto.empresaId === undefined || producto.empresaId === null;

        return (!validaOrden && !validaNombre && !validaEmpresaId);
    }

    //
    //Construimos un payload limpio solo con campos validos del modelo
    //
    const construirPayloadProducto = (productoActual, usuarioActual, esAlta) => {
        const ordenNormalizado = productoActual.orden === "" || productoActual.orden === undefined || productoActual.orden === null
            ? null
            : Number(productoActual.orden);

        const pesoNormalizado = productoActual.pesoKgs === "" || productoActual.pesoKgs === undefined || productoActual.pesoKgs === null
            ? null
            : Number(productoActual.pesoKgs);

        const payload = {
            empresaId: productoActual.empresaId,
            orden: ordenNormalizado,
            sku: productoActual.sku || null,
            nombre: productoActual.nombre || null,
            familia: productoActual.familia || null,
            rangoTemp: productoActual.rangoTemp || null,
            vidaUtil: productoActual.vidaUtil || null,
            activoSN: productoActual.activoSN || "S",
            pesoKgs: Number.isNaN(pesoNormalizado) ? null : pesoNormalizado,
        };

        //
        //Si el peso no viene informado no lo enviamos al backend
        //
        if (payload.pesoKgs === null) {
            delete payload.pesoKgs;
        }

        if (esAlta) {
            payload['usuCreacion'] = usuarioActual;
        } else {
            payload['usuModificacion'] = usuarioActual;
        }

        return payload;
    };

    const guardarProducto = async () => {
        setEstadoGuardando(true);
        setEstadoGuardandoBoton(true);

        if (await validaciones()) {
            //
            //Preparamos el objeto final antes de guardar
            //
            const usuarioActual = getUsuarioSesion()?.id;

            if (idEditar === 0) {
                //
                //En un alta enviamos solo campos validos del modelo
                //
                const objGuardar = construirPayloadProducto(producto, usuarioActual, true);
                const nuevoRegistro = await postProducto(objGuardar);

                if (nuevoRegistro?.id) {
                    setRegistroResult("insertado");
                    setIdEditar(null);
                    if (onDataChange) {
                        onDataChange();
                    }
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Ha ocurrido un error creando el registro' }),
                        life: 3000,
                    });
                }
            } else {
                //
                //En una edicion enviamos solo campos validos del modelo
                //
                const objGuardar = construirPayloadProducto(producto, usuarioActual, false);
                await patchProducto(idEditar, objGuardar);
                setIdEditar(null);
                setRegistroResult("editado");
                if (onDataChange) {
                    onDataChange();
                }
            }
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'ERROR',
                detail: intl.formatMessage({ id: 'Los campos obligatorios deben de ser rellenados' }),
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
            <div className="grid producto">
                <div className="col-12">
                    <div {...(!estoyDentroDeUnTab && { className: "card" })}>
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Producto' })).toLowerCase()}</h2>
                        <p className="catalogo-edit-description">Modifica el orden, sku, nombre, familia, rango de temperatura, vida util, peso y activo del producto.</p>
                        <EditarDatosProducto
                            producto={producto}
                            setProducto={setProducto}
                            estadoGuardando={estadoGuardando}
                            estoyDentroDeUnTab={estoyDentroDeUnTab}
                        />

                        <div className="flex justify-content-end align-items-center gap-2 mt-3">
                            <Button label={intl.formatMessage({ id: 'Cancelar' })} onClick={cancelarEdicion} className="p-button-secondary" />
                            {editable && (
                                <Button
                                    label={estadoGuardandoBoton ? `${intl.formatMessage({ id: 'Guardando' })}...` : 'Guardar cambios'}
                                    icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                                    onClick={guardarProducto}
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

export default EditarProducto;
