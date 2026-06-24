import React, { useEffect, useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';
import { getOperario } from "@/app/api-endpoints/cliente-operario";
import { getEnvioOperario } from "@/app/api-endpoints/envio-operario";

const EditarDatosEnvioOperario = ({ envioOperario, setEnvioOperario, estadoGuardando, envioId, clienteId, estoyDentroDeUnTab, idEditar }) => {
    const intl = useIntl();
    const [operariosCliente, setOperariosCliente] = useState([]);

    useEffect(() => {
        const cargarOperarios = async () => {
            if (!clienteId) {
                setOperariosCliente([]);
                return;
            }

            //
            //Cargamos solo los operarios del cliente asociado al envio
            //
            //
            //Cargamos los operarios activos del cliente y las asociaciones ya guardadas
            //para no repetir operarios dentro del mismo envio
            //
            const [dataOperarios, dataEnvioOperarios] = await Promise.all([
                getOperario(JSON.stringify({
                    where: {
                        and: {
                            clienteId: clienteId,
                            activoSN: 'S'
                        }
                    },
                    order: "nombre ASC"
                })),
                getEnvioOperario(JSON.stringify({
                    where: {
                        and: {
                            envioId: envioId
                        }
                    }
                }))
            ]);

            const operariosAsignados = new Set(
                (Array.isArray(dataEnvioOperarios) ? dataEnvioOperarios : [])
                    .filter((item) => item.id !== idEditar)
                    .map((item) => Number(item.operarioId))
            );

            const operariosDisponibles = (Array.isArray(dataOperarios) ? dataOperarios : []).filter((operario) => {
                if (Number(operario.id) === Number(envioOperario.operarioId)) {
                    return true;
                }

                return !operariosAsignados.has(Number(operario.id));
            });

            setOperariosCliente(operariosDisponibles);
        };

        cargarOperarios();
    }, [clienteId, envioId, idEditar, envioOperario.operarioId]);

    const opcionesOperario = operariosCliente.map((operario) => ({
        label: `${operario.nombre || "-"}${operario.telefono ? ` - ${operario.telefono}` : ""}`,
        value: operario.id
    }));

    const operarioSeleccionado = operariosCliente.find((item) => item.id === envioOperario.operarioId);

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del operario del envio' })}>
            <div className="p-fluid formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label htmlFor="operarioId"><b>{intl.formatMessage({ id: 'Operario' })}*</b></label>
                    <Dropdown
                        value={envioOperario.operarioId || ""}
                        onChange={(e) => setEnvioOperario({ ...envioOperario, envioId: envioId, operarioId: e.value })}
                        options={opcionesOperario}
                        className={`w-full p-column-filter ${(estadoGuardando && !envioOperario.operarioId) ? "p-invalid" : ""}`}
                        filter
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un operario' })}
                    />
                </div>
            </div>

            <div className="p-fluid formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="telefono">{intl.formatMessage({ id: 'Telefono' })}</label>
                    <input
                        type="text"
                        className="p-inputtext p-component"
                        value={operarioSeleccionado?.telefono || envioOperario.telefono || ""}
                        disabled={true}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Email' })}</label>
                    <input
                        type="text"
                        className="p-inputtext p-component"
                        value={operarioSeleccionado?.email || envioOperario.email || ""}
                        disabled={true}
                    />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosEnvioOperario;
