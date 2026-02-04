import React, { useState, useEffect } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { getLugarParada } from '@/app/api-endpoints/lugar-parada';
import { getOperario } from '@/app/api-endpoints/operario';
import { getUsuarioSesion } from '@/app/utility/Utils';

const EditarDatosEnvioParada = ({ envioParada, setEnvioParada, estadoGuardando, envios, estoyDentroDeUnTab, envioId }) => {
    const intl = useIntl();
    const [lugaresParada, setLugaresParada] = useState([]);
    const [operarios, setOperarios] = useState([]);

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));
    //
    // Funciones para cargar los lugares de parada y los operarios según el cliente del envío
    //
    useEffect(() => {
        //
        // Función para cargar lugares de parada
        //
        const cargarLugaresParada = async () => {
            if (envioParada.envioId || envioId) {
                try {
                    // Buscar el envío seleccionado para obtener su clienteId
                    const envioSeleccionado = envios.find(env => env.id === (envioParada.envioId || envioId));
                    if (envioSeleccionado && envioSeleccionado.clienteId) {
                        const filtro = JSON.stringify({
                            where: {
                                and: { clienteId: envioSeleccionado.clienteId, activoSN: 'S' }
                            }
                        });
                        const lugares = await getLugarParada(filtro);
                        setLugaresParada(lugares || []);
                    }
                } catch (error) {
                    console.error('Error al cargar lugares de parada:', error);
                }
            }
        };
        cargarLugaresParada();
        //
        // Función para cargar operarios 
        //
        const cargarOperarios = async () => {
            if (envioParada.envioId || envioId) {
                try {
                    // Buscar el envío seleccionado para obtener su clienteId
                    const envioSeleccionado = envios.find(env => env.id === (envioParada.envioId || envioId));
                    if (envioSeleccionado && envioSeleccionado.clienteId) {
                        const filtro = JSON.stringify({
                            where: {
                                and: { clienteId: envioSeleccionado.clienteId, activoSN: 'S'}
                            }
                        });
                        const operariosData = await getOperario(filtro);
                        setOperarios(operariosData || []);
                    }
                } catch (error) {
                    console.error('Error al cargar operarios:', error);
                }
            }
        };
        cargarOperarios();

    }, [envioParada.envioId, envioId, envios]);

    // Función para manejar la selección del lugar de parada
    const onLugarParadaChange = (e) => {
        const lugarSeleccionado = lugaresParada.find(lugar => lugar.id === e.value);
        if (lugarSeleccionado) {
            setEnvioParada({
                ...envioParada,
                lugarParadaId: e.value,
                direccion: lugarSeleccionado.direccion || '',
                lugarParadaGps: lugarSeleccionado.direccionGps  || ''
            });
        } else {
            setEnvioParada({ ...envioParada, lugarParadaId: e.value });
        }
    };

    // Función para manejar la selección del operario
    const onOperarioChange = (e) => {
        const operarioSeleccionado = operarios.find(operario => operario.id === e.value);
        if (operarioSeleccionado) {
            setEnvioParada({
                ...envioParada,
                operarioId: e.value,
                telefonoOperario: operarioSeleccionado.telefono || '',
                emailOperario: operarioSeleccionado.email || ''
            });
        } else {
            setEnvioParada({ ...envioParada, operarioId: e.value });
        }
    };

    const opcionesLugarParada = lugaresParada.map(lugar => ({
        label: lugar.nombre,
        value: lugar.id
    }));

    const opcionesOperario = operarios.map(operario => ({
        label: operario.nombre,
        value: operario.id
    }));

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la parada de envío' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={envioParada.orden}
                        placeholder={intl.formatMessage({ id: 'Orden de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, orden: e.value })}
                        className={`${(estadoGuardando && (envioParada.orden === "" || envioParada.orden === null || envioParada.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999}
                        inputStyle={{ textAlign: 'right' }} />
                </div>
                {!estoyDentroDeUnTab && (<div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="envioId"><b>{intl.formatMessage({ id: 'Origen Ruta' })}*</b></label>
                    <Dropdown value={envioParada.envioId || ""}
                        onChange={(e) => setEnvioParada({ ...envioParada, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`p-column-filter ${(estadoGuardando && (envioParada.envioId == null || envioParada.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envío' })} />
                </div>)}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="fecha">{intl.formatMessage({ id: 'Fecha' })}</label>
                    <InputText type="datetime-local"
                    value={envioParada.fecha}
                        placeholder={intl.formatMessage({ id: 'Fecha de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, fecha: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }} />
                </div>
            </div>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="lugarParadaId"><b>{intl.formatMessage({ id: 'Lugar de parada' })}*</b></label>
                    <Dropdown 
                        value={envioParada.lugarParadaId}
                        options={opcionesLugarParada}
                        onChange={onLugarParadaChange}
                        placeholder={intl.formatMessage({ id: 'Seleccionar lugar de parada' })}
                        filter
                        showClear
                        className={`${(estadoGuardando && !envioParada.lugarParadaId) ? "p-invalid" : ""}`}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="lugarParadaGps"><b>{intl.formatMessage({ id: 'GPS de la parada' })}*</b></label>
                    <InputText value={envioParada.lugarParadaGps}
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, lugarParadaGps: e.target.value })}
                        maxLength={50} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="direccion"><b>{intl.formatMessage({ id: 'Dirección' })}*</b></label>
                    <InputText value={envioParada.direccion}
                        placeholder={intl.formatMessage({ id: 'Dirección de la parada' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, direccion: e.target.value })}
                        maxLength={50} />
                </div>
            </div>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="operarioId"><b>{intl.formatMessage({ id: 'Operario' })}*</b></label>
                    <Dropdown 
                        value={envioParada.operarioId}
                        options={opcionesOperario}
                        onChange={onOperarioChange}
                        placeholder={intl.formatMessage({ id: 'Seleccionar operario' })}
                        filter
                        showClear
                        className={`${(estadoGuardando && !envioParada.operarioId) ? "p-invalid" : ""}`}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="telefonoOperario"><b>{intl.formatMessage({ id: 'Teléfono del operario' })}*</b></label>
                    <InputText value={envioParada.telefonoOperario}
                        placeholder={intl.formatMessage({ id: 'Teléfono del operario' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, telefonoOperario: e.target.value })}
                        maxLength={20}
                        style={{ textAlign: 'right' }} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="emailOperario"><b>{intl.formatMessage({ id: 'Email del operario' })}*</b></label>
                    <InputText value={envioParada.emailOperario}
                        placeholder={intl.formatMessage({ id: 'Email del operario' })}
                        onChange={(e) => setEnvioParada({ ...envioParada, emailOperario: e.target.value })}
                        maxLength={100} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioParada;