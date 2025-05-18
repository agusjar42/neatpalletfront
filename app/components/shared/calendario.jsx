import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import FullCalendar from "@fullcalendar/react";
// fullcalendar plugins imports
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendario = ({ calendario, setCalendario }) => {

    useEffect(() => {
        const tdPresentacion = document.querySelector('td[role="presentation"]');
        if (tdPresentacion !== null) {
            tdPresentacion.onclick = clickCalendario
        }
    }, []);

    const clickCalendario = (e) => {
        //Obtiene el elemento del dia seleccionado
        let diaTd = e.target
        if (diaTd !== null) {
            //Propaga el evento hacia el td
            if (diaTd.tagName !== 'TD' && !diaTd.classList.contains('fc-day')) {
                let i = 0;
                do {
                    if (diaTd.parentElement !== null) {
                        diaTd = diaTd.parentElement;
                    }
                    i++;
                    //Si propaga demasiado y no encuentra el td evitamos que ocurra un bucle infinito
                    if (i > 5) {
                        break;
                    }
                } while (diaTd.tagName !== 'TD' && !diaTd.classList.contains('fc-day'));
            }
            if (diaTd.tagName === 'TD' && diaTd.classList.contains('fc-day') && !diaTd.classList.contains('fc-day-other')) {
                const diaString = diaTd.getAttribute("data-date")
                const diaArr = diaString.split('-')
                const diaJSON = {
                    anio: diaArr[0],
                    mes: diaArr[1],
                    dia: diaArr[2],
                    tipo: ''
                }

                pintarDia(diaTd, diaJSON);
            }
        }
    }

    const cambiarMes = (propiedadesMes) => {
        const inicioString = propiedadesMes.startStr.slice(0, propiedadesMes.startStr.indexOf('T'));
        const finalString = propiedadesMes.endStr.slice(0, propiedadesMes.endStr.indexOf('T'));

        const _calendario = [...calendario]
        //Filtramos solo los dias del mes para no recorrer todo el calendario
        const calendarioFiltrado = _calendario.filter(dia => filtrarMes(inicioString, finalString, dia));
        limpiarMes();
        pintarMes(calendarioFiltrado);
    }

    const limpiarMes = () => {
        const dias = document.querySelectorAll('.fc-day');
        for (const dia of dias) {
            dia.style.backgroundColor = ''
        }
    }

    const pintarMes = (calendarioFiltrado) => {
        for (const diaJSON of calendarioFiltrado) {
            const diaTd = document.querySelector(`td[data-date="${diaJSON.anio}-${diaJSON.mes}-${diaJSON.dia}"]`);
            if(diaTd !== null){
                pintarDia(diaTd);
            }
        }
    }

    const pintarDia = (diaTd, diaJSON = null) => {
        if (diaTd.style.backgroundColor !== 'rgb(193, 247, 188)') {
            diaTd.style.backgroundColor = 'rgb(193, 247, 188';
        }
        else if (diaTd.style.backgroundColor === 'rgb(193, 247, 188)') {
            diaTd.style.backgroundColor = ''
        }

        if(diaJSON !== null){
            const diaIndex = calendario.findIndex(dia => dia.anio === diaJSON.anio && dia.mes === diaJSON.mes && dia.dia === diaJSON.dia);
            if( diaIndex < 0){
                calendario.push(diaJSON);
            }
            else{
                calendario.splice(diaIndex, 1);
            }
        }
    }

    const filtrarMes = (startStr, endStr, dia) => {
        let startDate = new Date(startStr);
        let endDate = new Date(endStr);
        let diaDate = new Date(`${dia.anio}-${dia.mes}-${dia.dia}`);
        return diaDate >= startDate && diaDate <= endDate;

    }


    const guardarCambios = () => {
        setCalendario(calendario);
    };

    return (
        <div className="card">
            <FullCalendar

                initialView="dayGridMonth"
                height={720}
                plugins={[
                    dayGridPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }}
                datesSet={cambiarMes}
                // IDIOMA DEL CALENDARIO
                locale={'es'}
                firstDay={1}
                editable
                selectable
                selectMirror
                dayMaxEvents
            />
            <div style={{marginTop: '15px'}} className="flex justify-content-end mt-2">
                <Button
                    type="button"
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={guardarCambios}
                />
            </div>

        </div>
    );
}
export default Calendario;