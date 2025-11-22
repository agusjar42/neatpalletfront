"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { getResumenEnvio } from "@/app/api-endpoints/envio";
import 'primeicons/primeicons.css';
import { getUsuarioSesion } from "@/app/utility/Utils";
import EditarDatosResumenEnvio from "./EditarDatosResumenEnvio";
import { useIntl } from 'react-intl';

const EditarResumenEnvio = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, seccion, editable }) => {
    const toast = useRef(null);
    const [resumenEnvio, setResumenEnvio] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                try {
                    const registro = await getResumenEnvio(idEditar);
                    setResumenEnvio(registro);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'Error al cargar el resumen' }),
                        life: 3000,
                    });
                }
            }
        };
        fetchData();
    }, [idEditar, intl]);

    const cancelarEdicion = () => {
        setIdEditar(null)
    };

    const header = intl.formatMessage({ id: 'Ver' });

    return (
        <div>
            <div className="grid ResumenEnvio">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Resumen Envío' })).toLowerCase()}</h2>
                        <EditarDatosResumenEnvio
                            resumenEnvio={resumenEnvio}
                            setResumenEnvio={setResumenEnvio}
                            estadoGuardando={estadoGuardando}
                        />

                        <div className="flex justify-content-end mt-2">
                            <Button
                                label={intl.formatMessage({ id: 'Cancelar' })}
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={cancelarEdicion}
                            />
                        </div>
                        <Divider />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarResumenEnvio;