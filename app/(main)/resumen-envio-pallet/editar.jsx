"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { getResumenEnvioPallet } from "@/app/api-endpoints/envio";
import 'primeicons/primeicons.css';
import EditarDatosResumenEnvioPallet from "./EditarDatosResumenEnvioPallet";
import { useIntl } from 'react-intl';

const EditarResumenEnvioPallet = ({ idEditar, setIdEditar, rowData, emptyRegistro, setRegistroResult, seccion, editable }) => {
    const toast = useRef(null);
    const [resumenEnvioPallet, setResumenEnvioPallet] = useState(emptyRegistro);
    const [estadoGuardando, setEstadoGuardando] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fetchData = async () => {
            if (idEditar !== 0) {
                try {
                    const registro = await getResumenEnvioPallet(idEditar);
                    setResumenEnvioPallet(registro);
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
            <div className="grid ResumenEnvioPallet">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} position="top-right" />
                        <h2>{header} {(intl.formatMessage({ id: 'Resumen Envío Pallet' })).toLowerCase()}</h2>
                        <EditarDatosResumenEnvioPallet
                            resumenEnvioPallet={resumenEnvioPallet}
                            setResumenEnvioPallet={setResumenEnvioPallet}
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

export default EditarResumenEnvioPallet;
