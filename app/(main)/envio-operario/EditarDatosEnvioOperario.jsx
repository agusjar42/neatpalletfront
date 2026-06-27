import React, { useEffect, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
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
            //Cargamos los operarios activos del cliente y evitamos repetirlos dentro del mismo envio
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
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field catalogo-edit-field-full">
                <label htmlFor="operarioId" className="catalogo-edit-label-required">{intl.formatMessage({ id: 'Operario' })}*</label>
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

            <div className="catalogo-edit-field">
                <label htmlFor="telefono">{intl.formatMessage({ id: 'Telefono' })}</label>
                <InputText
                    value={operarioSeleccionado?.telefono || envioOperario.telefono || ""}
                    disabled
                />
            </div>

            <div className="catalogo-edit-field">
                <label htmlFor="email">{intl.formatMessage({ id: 'Email' })}</label>
                <InputText
                    value={operarioSeleccionado?.email || envioOperario.email || ""}
                    disabled
                />
            </div>
        </div>
    );
};

export default EditarDatosEnvioOperario;
