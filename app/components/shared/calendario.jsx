import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import FullCalendar from "@fullcalendar/react";
import { getIdiomaDefecto } from "@/app/components/shared/componentes";
import { useIntl } from 'react-intl'
import { Divider } from "primereact/divider";
// fullcalendar plugins imports
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendario = ({ calendario, setCalendario }) => {
    const intl = useIntl();
    const colores = {
        'disponible': 'rgb(193, 247, 188)',
        'noDisponible': 'rgb(255, 114, 114)',
        'evento': 'rgb(160, 221, 245)',
        'neutral': '',

    }
    useEffect(() => {
        const tdPresentacion = document.querySelector('td[role="presentation"]');
        if (tdPresentacion !== null) {
            tdPresentacion.onclick = clickCalendario
        }
        const botonHoy = document.querySelector('.fc-today-button');
        if (botonHoy !== null) {
            botonHoy.innerHTML = intl.formatMessage({ id: 'Hoy' });
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
        const botonHoy = document.querySelector('.fc-today-button');
        if (botonHoy !== null) {
            botonHoy.innerHTML = intl.formatMessage({ id: 'Hoy' });
        }
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
            if (diaTd !== null) {
                pintarDia(diaTd, diaJSON);
            }
        }
    }

    const pintarDia = (diaTd, diaJSON) => {
        if (!diaJSON.tipo) {
            if (diaTd.style.backgroundColor === colores.disponible) {
                diaJSON.tipo = 'noDisponible';
            }
            else if (diaTd.style.backgroundColor === colores.noDisponible) {
                diaTd.style.backgroundColor = colores.neutral;
                diaJSON.tipo = 'neutral';
            }
            else if (diaTd.style.backgroundColor === colores.neutral) {
                diaJSON.tipo = 'disponible';
            }
        }

        diaTd.style.backgroundColor = colores[diaJSON.tipo];

        if (diaJSON !== null && diaJSON.tipo !== undefined) {
            if (diaJSON.tipo === 'evento') {
                //Si es un evento no permitimos que el usuario lo toque
                return
            }
            const diaIndex = calendario.findIndex(dia => dia.anio === diaJSON.anio && dia.mes === diaJSON.mes && dia.dia === diaJSON.dia);
            if (diaIndex > 0) {
                calendario.splice(diaIndex, 1);
            }
            if (diaJSON.tipo !== 'neutral') {
                
                calendario.push(diaJSON);
            }
        }
        setCalendario(calendario);
    }

    const filtrarMes = (startStr, endStr, dia) => {
        let startDate = new Date(startStr);
        let endDate = new Date(endStr);
        let diaDate = new Date(`${dia.anio}-${dia.mes}-${dia.dia}`);
        return diaDate >= startDate && diaDate <= endDate;

    }

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
                locale={getIdiomaDefecto()}
                firstDay={1}
                editable
                selectable
                selectMirror
                dayMaxEvents
            />
            <Divider />
            <div className="col-12">
                <h4>{intl.formatMessage({ id: 'Significado de los colores:' })}</h4>
                <div className="grid"
                    style={{
                        gap: '15px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                    }}>
                    <div className="col-12 md:col-4"
                        style={{
                            backgroundColor: colores.disponible,
                            padding: '10px',
                            width: '100%',
                        }}>
                        <span>{intl.formatMessage({ id: 'Disponible' })}</span>
                    </div>
                    <div className="col-12 md:col-4"
                        style={{
                            backgroundColor: colores.noDisponible,
                            padding: '10px',
                            width: '100%',
                        }}>
                        <span>{intl.formatMessage({ id: 'No disponible' })}</span>
                    </div>
                    <div className="col-12 md:col-4"
                        style={{
                            backgroundColor: colores.evento,
                            padding: '10px',
                            width: '100%',
                        }}>
                        <span>{intl.formatMessage({ id: 'Día previamente disponible que ha sido reservado para un evento' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Calendario;