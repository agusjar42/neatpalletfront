"use client";

import React, { useEffect, useRef, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import Calendario from "../../../components/shared/calendario";

const CalendarioEjemplo = () => {

    const [calendario, setCalendario] = useState([]);
    const referenciaDataTable = useRef(null);
    const [showCalendario, setShowCalendario] = useState(false);

    useEffect(() => {
        const jsonCalendario =
            [
                {
                    "anio": "2025",
                    "mes": "05",
                    "dia": "05",
                    "tipo": 'evento'
                },
                {
                    "anio": "2025",
                    "mes": "05",
                    "dia": "04",
                    "tipo": 'evento'
                },
                {
                    "anio": "2025",
                    "mes": "05",
                    "dia": "03",
                    "tipo": 'evento'
                },


            ];
        setCalendario(jsonCalendario);

    }, []);


    const abrirCalendario = () => {
        setShowCalendario(!showCalendario);
    };

    {/* E N C A B E Z A D O - T A B L A */ }
    const header = (
        <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-2 md:mb-0 md:mr-auto md:align-items-center">
                <h5 className="m-0 mr-2">Ejemplo calendario</h5>
                <Button
                    label="Calendario"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={abrirCalendario}
                />
            </div>

        </div>
    );
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    {/* ENCABEZADO PRINCIPAL */}
                    {/* <Toolbar className="mb-4" left={barraDeHerramientasIzquierda}></Toolbar> */}

                    {/* TABLA DE REGISTROS */}
                    <DataTable
                        className="datatable-responsive"
                        ref={referenciaDataTable}
                        header={header}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                    >
                    </DataTable>
                </div>
                {showCalendario ? (
                    <Calendario
                        calendario={calendario}
                        setCalendario={setCalendario}
                    />
                ) : null}
            </div>
        </div>
    );
};
export default CalendarioEjemplo;
