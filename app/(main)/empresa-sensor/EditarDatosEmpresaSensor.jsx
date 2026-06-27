import React from "react";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useIntl } from 'react-intl';
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";

const EditarDatosEmpresaSensor = ({ empresaSensor, setEmpresaSensor, estadoGuardando, tiposSensor, idEditar, editable }) => {
    const intl = useIntl();

    //
    //Traducimos el valor booleano del switch al formato S o N de la bbdd
    //
    const manejarCambioInputSwitch = (e, nombreCampo) => {
        const esTrue = e.value === true ? 'S' : 'N';
        setEmpresaSensor({ ...empresaSensor, [nombreCampo]: esTrue });
    };

    //
    //De los tipos de sensor solo mostramos los activos y el seleccionado
    //
    const opcionesTipoSensor = tiposSensor
        .filter(tipo =>
            tipo.activoSn === "S" ||
            tipo.id === empresaSensor.tipoSensorId
        )
        .map(tipo => ({
            label: tipo.nombre,
            value: tipo.id,
            unidad: tipo.unidad || ""
        }));

    //
    //Al elegir un tipo de sensor en un alta, rellenamos la unidad de forma automatica
    //
    const manejarCambioTipoSensor = (tipoSensorId) => {
        const opcionSeleccionada = opcionesTipoSensor.find((opcion) => opcion.value === tipoSensorId);
        setEmpresaSensor({
            ...empresaSensor,
            tipoSensorId,
            unidad: opcionSeleccionada?.unidad || "",
        });
    };

    return (
        <div className="catalogo-edit-form-grid">
            <div className="catalogo-edit-field">
                <label htmlFor="orden" style={{ color: 'black' }}><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                <InputNumber
                    value={empresaSensor.orden === '' || empresaSensor.orden === undefined ? null : empresaSensor.orden}
                    onChange={(e) => setEmpresaSensor({ ...empresaSensor, orden: e.value })}
                    className={`${(estadoGuardando && (empresaSensor.orden === "" || empresaSensor.orden === null || empresaSensor.orden === undefined)) ? "p-invalid" : ""}`}
                    mode="decimal"
                    useGrouping={false}
                    min={0}
                    inputStyle={{ textAlign: 'right' }}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="tipoSensorId" style={{ color: 'black' }}><b>{intl.formatMessage({ id: 'Tipo de Sensor' })}*</b></label>
                <Dropdown
                    value={empresaSensor.tipoSensorId || ""}
                    onChange={(e) => manejarCambioTipoSensor(e.value)}
                    options={opcionesTipoSensor}
                    className={`p-column-filter ${(estadoGuardando && (empresaSensor.tipoSensorId == null || empresaSensor.tipoSensorId === "")) ? "p-invalid" : ""}`}
                    showClear
                    placeholder={intl.formatMessage({ id: 'Seleccione un tipo de sensor' })}
                    disabled={!editable || idEditar !== 0}
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="unidad">{intl.formatMessage({ id: 'Unidad' })}</label>
                <InputText
                    value={empresaSensor.unidad || ""}
                    readOnly
                    disabled
                />
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="valorMinimo">{intl.formatMessage({ id: 'Minimo' })}</label>
                <InputNumber
                    value={empresaSensor.valorMinimo === '' || empresaSensor.valorMinimo === undefined || empresaSensor.valorMinimo === null ? null : Number(empresaSensor.valorMinimo)}
                    placeholder={intl.formatMessage({ id: 'Valor minimo del sensor' })}
                    onChange={(e) => setEmpresaSensor({ ...empresaSensor, valorMinimo: e.value })}
                    maxLength={50}
                    inputStyle={{ textAlign: 'right' }}
                    disabled={!editable}
                />
                <small style={{ color: '#94949f', fontSize: '10px' }}>
                    <i>{intl.formatMessage({ id: 'Valor minimo a tener en cuenta en el calculo.' })}</i>
                </small>
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="valorMaximo">{intl.formatMessage({ id: 'Maximo' })}</label>
                <InputNumber
                    value={empresaSensor.valorMaximo === '' || empresaSensor.valorMaximo === undefined || empresaSensor.valorMaximo === null ? null : Number(empresaSensor.valorMaximo)}
                    placeholder={intl.formatMessage({ id: 'Valor maximo del sensor' })}
                    onChange={(e) => setEmpresaSensor({ ...empresaSensor, valorMaximo: e.value })}
                    maxLength={50}
                    inputStyle={{ textAlign: 'right' }}
                    disabled={!editable}
                />
                <small style={{ color: '#94949f', fontSize: '10px' }}>
                    <i>{intl.formatMessage({ id: 'Valor maximo permitido para este sensor.' })}</i>
                </small>
            </div>
            <div className="catalogo-edit-field">
                <label htmlFor="activoSn">{intl.formatMessage({ id: 'Activo' })}</label>
                <InputSwitch
                    checked={(empresaSensor.activoSn || "S") === "S"}
                    onChange={(e) => manejarCambioInputSwitch(e, "activoSn")}
                    disabled={!editable}
                />
            </div>
        </div>
    );
};

export default EditarDatosEmpresaSensor;
