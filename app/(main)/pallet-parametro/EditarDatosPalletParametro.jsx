import React, { useEffect, useState } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useIntl } from 'react-intl';

const EditarDatosPalletParametro = ({ palletParametro, setPalletParametro, estadoGuardando, pallets, parametros, palletId = false }) => {
    const intl = useIntl();
    const [opcionesValorParametro, setOpcionesValorParametro] = useState([]);

    const opcionesPallet = pallets.map(pallet => ({
        label: `${pallet.codigo} - ${pallet.alias || pallet.modelo || 'Sin alias'}`,
        value: pallet.id
    }));
    //
    //De los parámetros solo mostramos los activos y el que esté seleccionado (para poder editar un registro inactivo)
    //
    const opcionesParametro = parametros
        .filter(parametro =>
            parametro.activoSn === "S" ||
            parametro.id === palletParametro.parametroId
        )
        .map(parametro => ({
            label: parametro.nombre,
            value: parametro.id
        }));
    //
    // Actualiza las opciones de desplegable "valor" cuando cambia el desplegable "parámetro" seleccionado
    //
    useEffect(() => {
        const parametroSeleccionado = parametros.find(p => p.id === palletParametro.parametroId);
        if (parametroSeleccionado && parametroSeleccionado.valorDisponible) {
            const opciones = parametroSeleccionado.valorDisponible
                .split(";")
                .map(valor => ({ label: valor.trim(), value: valor.trim() }))
                .filter(op => op.value !== "");
            setOpcionesValorParametro(opciones);
        } else {
            setOpcionesValorParametro([]);
        }
    }, [palletParametro.parametroId, parametros]);

    useEffect(() => {
        if (palletId && !palletParametro.palletId) {
            setPalletParametro(prev => ({ ...prev, palletId }));
        }
    }, [palletId]);

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para el parámetro del pallet' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="orden"><b>{intl.formatMessage({ id: 'Orden' })}*</b></label>
                    <InputNumber value={palletParametro.orden}
                        placeholder={intl.formatMessage({ id: 'Orden del parámetro' })}
                        onChange={(e) => setPalletParametro({ ...palletParametro, orden: e.value })}
                        className={`${(estadoGuardando && (palletParametro.orden === "" || palletParametro.orden === null || palletParametro.orden === undefined)) ? "p-invalid" : ""}`}
                        mode="decimal"
                        useGrouping={false}
                        min={0}
                        max={99999} 
                        inputStyle={{ textAlign: 'right' }}/>
                </div>
                {/* Solo mostrar el desplegable Pallet si palletId viene vacio */}
                {(!palletId) && (
                    <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-5">
                        <label htmlFor="palletId"><b>{intl.formatMessage({ id: 'Pallet' })}*</b></label>
                        <Dropdown value={palletParametro.palletId || ""}
                            onChange={(e) => setPalletParametro({ ...palletParametro, palletId: e.value })}
                            options={opcionesPallet}
                            className={`p-column-filter ${(estadoGuardando && (palletParametro.palletId == null || palletParametro.palletId === "")) ? "p-invalid" : ""}`}
                            showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un pallet' })} />
                </div>
                )}
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-5">
                    <label htmlFor="parametroId"><b>{intl.formatMessage({ id: 'Parámetro' })}*</b></label>
                    <Dropdown value={palletParametro.parametroId || ""}
                        onChange={(e) => setPalletParametro({ ...palletParametro, parametroId: e.value })}
                        options={opcionesParametro}
                        className={`p-column-filter ${(estadoGuardando && (palletParametro.parametroId == null || palletParametro.parametroId === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="valor">{intl.formatMessage({ id: 'Valor' })}</label>
                    <Dropdown value={palletParametro.valor || ""}
                        onChange={(e) => setPalletParametro({ ...palletParametro, valor: e.value })}
                        options={opcionesValorParametro}
                        className={`p-column-filter ${(estadoGuardando && (palletParametro.valor == null || palletParametro.valor === "")) ? "p-invalid" : ""}`}
                        showClear
                        placeholder={intl.formatMessage({ id: 'Selecciona un parámetro' })} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="textoLibre">{intl.formatMessage({ id: 'Texto libre' })}</label>
                    <InputTextarea value={palletParametro.textoLibre}
                        placeholder={intl.formatMessage({ id: 'Texto libre adicional' })}
                        onChange={(e) => setPalletParametro({ ...palletParametro, textoLibre: e.target.value })}
                        rows={3} cols={30} maxLength={500} />
                </div>
            </div>
        </Fieldset>
    );
};

export default EditarDatosPalletParametro;