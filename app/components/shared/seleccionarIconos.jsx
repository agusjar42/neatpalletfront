"use client";

import { useIntl } from 'react-intl'
import React, { useEffect, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { devuelveBasePath } from "@/app/utility/Utils"

const SeleccionarIconos = ({ campo, listaRegistros, registrosSeleccionados, setRegistrosSeleccionados, headerSeleccionados, headerDisponibles, imagen }) => {
    const intl = useIntl()
    const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);
    useEffect(() => {
        //Recorre los registros y los añade a la lista de seleccionados
        for (const registro of registrosSeleccionados) {
            //Solo los pintamos, ya que ya están seleccionados de base
            //Obtenemos el div del registro seleccionado
            const divRegistro = document.getElementById(`${campo} ${registro.id}`);
            //Editamos el color para marcarlo como seleccionado
            divRegistro.style.filter = 'grayscale(100%)';
        }
    }, []);

    //Evento que maneja el cambio de tamaño de la pantalla
    window.addEventListener('resize', () => {
        setAnchoPantalla(window.innerWidth);
    });

    const quitarRegistro = (registro) => {
        //Obtenemos el div del registro seleccionado
        const divRegistro = document.getElementById(`${campo} ${registro.id}`);
        //Mostramos el div del registro seleccionado
        divRegistro.style.display = 'block';
        setRegistrosSeleccionados(registrosSeleccionados.filter(item => item !== registro));
    }

    const seleccionarRegistro = (registro) => {
        //Obtenemos el div del registro seleccionado
        const divRegistro = document.getElementById(`${campo} ${registro.id}`);
        // Ocultamos el div del registro seleccionado
        divRegistro.style.display = 'none';
        //Añadimos el registro a la lista de seleccionados
        setRegistrosSeleccionados([...registrosSeleccionados, registro]);
    }

    return (
        <div className="grid" style={{ gap: '25px' }}>
            <div className="col-12">
                <div className="card" style={{ padding: '50px' }}>
                    <div className="col-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{(intl.formatMessage({ id: headerSeleccionados }))}</h2>
                    </div>
                    <div
                        className="grid"
                        style={{
                            gap: '25px',
                            display: 'grid',
                            gridTemplateColumns: anchoPantalla > 1000 ? 'repeat(5, 1fr)' : 'repeat(3, 1fr)',
                        }}
                    >
                        {registrosSeleccionados.map((registro, index) => (
                            <div
                                id={`${campo} seleccionado ${registro.id}`}
                                key={index}
                                className="text-center"
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '0px',
                                    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
                                    borderRadius: '5px',
                                    padding: '10px',
                                }}
                                onClick={() => quitarRegistro(registro)}
                            >
                                <img
                                    src={`${(devuelveBasePath())}${imagen}`}
                                    alt=""
                                    style={{ width: '100%', objectFit: 'cover' }}
                                />
                                <Divider></Divider>
                                <span
                                    style={{
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '100%',
                                        minwidth: '0px',
                                    }}
                                >
                                    {registro.nombre}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Divider type="solid" style={{ margin: '20px 0' }} />
                    <div className="col-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{(intl.formatMessage({ id: headerDisponibles }))}</h2>
                    </div>
                    <div
                        className="grid"
                        style={{
                            gap: '25px',
                            display: 'grid',
                            gridTemplateColumns: anchoPantalla > 1000 ? 'repeat(5, 1fr)' : 'repeat(3, 1fr)',
                        }}
                    >
                        {listaRegistros.map((registro, index) => (
                            <div
                                id={`${campo} ${registro.id}`}
                                key={index}
                                className="text-center"
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '0px',
                                    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
                                    borderRadius: '5px',
                                    padding: '10px',
                                }}
                                onClick={() => {
                                    //Si el registro ya está seleccionado, lo eliminamos de la lista de seleccionados
                                    if (registrosSeleccionados.includes(registro)) {
                                        quitarRegistro(registro);
                                    } else {
                                        //Si no está seleccionado, lo añadimos a la lista de seleccionados
                                        seleccionarRegistro(registro);
                                    }
                                }}
                            >
                                <img
                                    src={`${(devuelveBasePath())}${imagen}`}
                                    alt=""
                                    style={{ width: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
                                />
                                <Divider></Divider>
                                <span
                                    style={{
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '100%',
                                        minwidth: '0px',
                                    }}
                                >
                                    {registro.nombre}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SeleccionarIconos;