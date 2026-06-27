import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { getLugarParada } from '@/app/api-endpoints/cliente-lugar-parada';
import { getEnvioOperario } from '@/app/api-endpoints/envio-operario';

const EditarDatosEnvioParada = ({ envioParada, setEnvioParada, estadoGuardando, envios, estoyDentroDeUnTab, envioId, clienteId }) => {
    const intl = useIntl();
    const [lugaresParada, setLugaresParada] = useState([]);
    const [operarios, setOperarios] = useState([]);

    const estadosParada = [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Completada', value: 'Completada' },
        { label: 'Incidencia', value: 'Incidencia' },
    ];

    const tiposParada = [
        { label: 'Origen', value: 'Origen' },
        { label: 'Transito', value: 'Transito' },
        { label: 'Destino', value: 'Destino' },
    ];

    const opcionesEnvio = envios.map(envio => ({
        label: `${envio.id} - ${envio.origenRuta || 'Sin ruta'}`,
        value: envio.id
    }));

    const envioSeleccionado = envios.find(env => env.id === (envioParada.envioId || envioId));
    const clienteIdActual = clienteId || envioSeleccionado?.clienteId;

    useEffect(() => {
        const cargarDatosRelacionados = async () => {
            if (!clienteIdActual) {
                setLugaresParada([]);
                setOperarios([]);
                return;
            }

            try {
                const filtroLugares = JSON.stringify({
                    where: {
                        clienteId: clienteIdActual
                    },
                    order: "nombre ASC"
                });

                const filtroOperarios = JSON.stringify({
                    where: {
                        envioId: envioId || envioParada.envioId
                    },
                    order: "id ASC"
                });

                const [lugares, operariosData] = await Promise.all([
                    getLugarParada(filtroLugares),
                    getEnvioOperario(filtroOperarios)
                ]);

                //
                //Mostramos solo los puntos activos del cliente y los operarios ya asociados al envio actual
                //
                setLugaresParada((lugares || []).filter((lugar) => lugar.activoSN !== 'N'));
                setOperarios((operariosData || []).filter((operario) => operario.activoSN !== 'N'));
            } catch (error) {
                console.error('Error al cargar datos de la parada:', error);
                setLugaresParada([]);
                setOperarios([]);
            }
        };

        cargarDatosRelacionados();
    }, [clienteIdActual, envioId, envioParada.envioId]);

    useEffect(() => {
        if (envioParada.lugarParadaId && !lugaresParada.some(lugar => lugar.id === envioParada.lugarParadaId)) {
            setEnvioParada(prev => ({
                ...prev,
                lugarParadaId: "",
                direccion: "",
                lugarParadaGps: ""
            }));
        }
    }, [lugaresParada, envioParada.lugarParadaId, setEnvioParada]);

    useEffect(() => {
        if (envioParada.operarioId && !operarios.some(operario => operario.id === envioParada.operarioId)) {
            setEnvioParada(prev => ({
                ...prev,
                operarioId: "",
                telefonoOperario: "",
                emailOperario: ""
            }));
        }
    }, [operarios, envioParada.operarioId, setEnvioParada]);

    const onLugarParadaChange = (e) => {
        const lugarSeleccionado = lugaresParada.find(lugar => lugar.id === e.value);
        if (lugarSeleccionado) {
            setEnvioParada({
                ...envioParada,
                lugarParadaId: e.value,
                direccion: lugarSeleccionado.direccion || '',
                lugarParadaGps: lugarSeleccionado.direccionGps || ''
            });
        } else {
            setEnvioParada({
                ...envioParada,
                lugarParadaId: e.value,
                direccion: '',
                lugarParadaGps: ''
            });
        }
    };

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
            setEnvioParada({
                ...envioParada,
                operarioId: e.value,
                telefonoOperario: '',
                emailOperario: ''
            });
        }
    };

    const opcionesLugarParada = lugaresParada.map(lugar => ({
        label: lugar.nombre,
        value: lugar.id
    }));

    const opcionesOperario = operarios.map(operario => ({
        label: `${operario.nombre || ''}${operario.telefono ? ` - ${operario.telefono}` : ''}`,
        value: operario.id
    }));

    return (
        <div className="catalogo-edit-form-grid catalogo-edit-form-grid-wide">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Orden' })}*</label>
                <InputNumber
                    value={envioParada.orden === '' || envioParada.orden === undefined ? null : envioParada.orden}
                    onChange={(e) => setEnvioParada({ ...envioParada, orden: e.value })}
                    className={`w-full ${(estadoGuardando && (envioParada.orden === "" || envioParada.orden === null || envioParada.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: 'right' }}
                />
            </div>

            {!estoyDentroDeUnTab && (
                <div className="catalogo-edit-field">
                    <label htmlFor="envioId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Origen Ruta' })}*</label>
                    <Dropdown
                        value={envioParada.envioId || ""}
                        onChange={(e) => setEnvioParada({ ...envioParada, envioId: e.value })}
                        options={opcionesEnvio}
                        className={`w-full p-column-filter ${(estadoGuardando && (envioParada.envioId == null || envioParada.envioId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un envio' })}
                    />
                </div>
            )}

            <div className="catalogo-edit-field">
                <label htmlFor="tipo">{intl.formatMessage({ id: 'Tipo' })}</label>
                <Dropdown
                    value={envioParada.tipo || ""}
                    onChange={(e) => setEnvioParada({ ...envioParada, tipo: e.value })}
                    options={tiposParada}
                    className="w-full p-column-filter"
                    showClear
                    placeholder={intl.formatMessage({ id: 'Selecciona un tipo' })}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="lugarParadaId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Punto' })}*</label>
                <Dropdown
                    value={envioParada.lugarParadaId}
                    options={opcionesLugarParada}
                    onChange={onLugarParadaChange}
                    placeholder={intl.formatMessage({ id: 'Seleccionar lugar de parada' })}
                    filter
                    showClear
                    className={`w-full ${(estadoGuardando && !envioParada.lugarParadaId) ? "p-invalid" : ""}`}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="lugarParadaGps" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Coordenadas' })}*</label>
                <InputText
                    value={envioParada.lugarParadaGps || ""}
                    placeholder={intl.formatMessage({ id: 'Coordenadas GPS de la parada' })}
                    onChange={(e) => setEnvioParada({ ...envioParada, lugarParadaGps: e.target.value })}
                    maxLength={50}
                />
            </div>

            <div className="catalogo-edit-field catalogo-edit-field-full">
                <label htmlFor="direccion" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Direccion' })}*</label>
                <InputText
                    value={envioParada.direccion || ""}
                    placeholder={intl.formatMessage({ id: 'Direccion de la parada' })}
                    onChange={(e) => setEnvioParada({ ...envioParada, direccion: e.target.value })}
                    maxLength={50}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="eta">{intl.formatMessage({ id: 'ETA' })}</label>
                <InputText
                    type="datetime-local"
                    value={envioParada.eta || envioParada.fecha || ""}
                    onChange={(e) => setEnvioParada({ ...envioParada, eta: e.target.value, fecha: e.target.value })}
                    maxLength={20}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="horaReal">{intl.formatMessage({ id: 'Hora real' })}</label>
                <InputText
                    type="datetime-local"
                    value={envioParada.horaReal || ""}
                    onChange={(e) => setEnvioParada({ ...envioParada, horaReal: e.target.value })}
                    maxLength={20}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="detencion">{intl.formatMessage({ id: 'Detencion' })}</label>
                <InputText
                    value={envioParada.detencion || ""}
                    placeholder={intl.formatMessage({ id: 'Tiempo de detencion' })}
                    onChange={(e) => setEnvioParada({ ...envioParada, detencion: e.target.value })}
                    maxLength={20}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="estado">{intl.formatMessage({ id: 'Estado' })}</label>
                <Dropdown
                    value={envioParada.estado || ""}
                    onChange={(e) => setEnvioParada({ ...envioParada, estado: e.value })}
                    options={estadosParada}
                    className="w-full p-column-filter"
                    showClear
                    placeholder={intl.formatMessage({ id: 'Selecciona un estado' })}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="operarioId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Operario' })}*</label>
                <Dropdown
                    value={envioParada.operarioId}
                    options={opcionesOperario}
                    onChange={onOperarioChange}
                    placeholder={intl.formatMessage({ id: 'Seleccionar operario' })}
                    filter
                    showClear
                    className={`w-full ${(estadoGuardando && !envioParada.operarioId) ? "p-invalid" : ""}`}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="telefonoOperario" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Telefono del operario' })}*</label>
                <InputText
                    value={envioParada.telefonoOperario || ""}
                    placeholder={intl.formatMessage({ id: 'Telefono del operario' })}
                    onChange={(e) => setEnvioParada({ ...envioParada, telefonoOperario: e.target.value })}
                    maxLength={20}
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="emailOperario" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Email del operario' })}*</label>
                <InputText
                    value={envioParada.emailOperario || ""}
                    placeholder={intl.formatMessage({ id: 'Email del operario' })}
                    onChange={(e) => setEnvioParada({ ...envioParada, emailOperario: e.target.value })}
                    maxLength={100}
                />
            </div>
        </div>
    );
};

export default EditarDatosEnvioParada;
