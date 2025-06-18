import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from "react";
import { Password } from "primereact/password";
import ArchivoMultipleInput from "../../../components/shared/archivo_multiple_input";
import ArchivoInput from "../../../components/shared/archivo_input";
import { useIntl } from 'react-intl'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
const EditarDatosEmpresa = ({ empresa, setEmpresa, estadoGuardando, listaTipoArchivos }) => {
    const intl = useIntl()
    //Crear inputs de archivos
    const inputsDinamicos = [];
    for (const tipoArchivo of listaTipoArchivos) {
        //Depende del tipo del input se genera multiple o no
        if (tipoArchivo.multiple === 'S') {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label>{tipoArchivo.nombre}</label>
                    <ArchivoMultipleInput
                        registro={empresa}
                        setRegistro={setEmpresa}
                        archivoTipo={tipoArchivo.tipo}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
        else {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <ArchivoInput
                        registro={empresa}
                        setRegistro={setEmpresa}
                        archivoTipo={tipoArchivo.tipo}
                        archivoHeader={tipoArchivo.nombre}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
    }

    const manejarCambioInputNumber = (e, nombreInput) => {
        let valor = e.value || 0;
        //Evitamos que el valor sea mayor al maximo permitido, por algun motivo el maximo no se aplica en el input si se escriben muchos numeros de golpe
        const maximo = parseInt(e.originalEvent.target.max)
        if(valor > maximo){
            valor = maximo;
            e.originalEvent.target.value = maximo.toLocaleString('es-ES');
        }
        let _empresa = { ...empresa };
        _empresa[`${nombreInput}`] = valor;
        setEmpresa(_empresa);
    };

    const manejarFocusInputNumber = (e) => {
        if (e.target.value === '0') {
            e.target.value = "";
        }
    };

    const manejarBlurInputNumber = (e) => {
        if (e.target.value === '') {
            e.target.value = 0;
        }
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la empresa' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaCodigo"><b>{intl.formatMessage({ id: 'Código' })}*</b></label>
                    <InputText value={empresa.codigo}
                        placeholder={intl.formatMessage({ id: 'Código de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, codigo: e.target.value })}
                        className={`${(estadoGuardando && empresa.codigo === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={20} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaNombre"><b>{intl.formatMessage({ id: 'Nombre' })}*</b></label>
                    <InputText value={empresa.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                        className={`${(estadoGuardando && empresa.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={50} />
                </div>                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-12">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Descripción' })}</label>
                    <InputTextarea value={empresa.descripcion} autoreresize
                        placeholder={intl.formatMessage({ id: 'Descripción de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, descripcion: e.target.value })}
                        //className={`${(estadoGuardando && empresa.descripcion === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={500} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email"><b>{intl.formatMessage({ id: 'Email' })}*</b></label>
                    <InputText value={empresa.email}
                        placeholder={intl.formatMessage({ id: 'Email de la empresa' })}
                        autoComplete='off'
                        onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                        //className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={120} />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Dirección de la cuenta de email que se va a usar para enviar correos automatizados' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Contraseña del email' })}</label>
                    <Password
                        value={empresa.password}
                        id="password"
                        //className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        type="text"
                        onChange={(e) => setEmpresa({ ...empresa, password: e.target.value })}
                        placeholder={intl.formatMessage({ id: 'Contraseña del email' })}
                        toggleMask
                        autoComplete="new-password" //Pone new password en vez de off y si que funciona, 0 idea de como o porque
                        inputClassName="w-full"
                        feedback={false}
                        maxLength={100}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Contraseña de la cuenta de email que se va a usar para enviar correos automatizados' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Servicio de email' })}</label>
                    <InputText value={empresa.servicio}
                        placeholder={intl.formatMessage({ id: 'Servicio de email' })}
                        autoComplete='off'
                        onChange={(e) => setEmpresa({ ...empresa, servicio: e.target.value })}
                        //className={`${(estadoGuardando && (empresa.servicio === "" || empresa.servicio === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} maxLength={45}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'El servicio que utiliza la cuenta de email, ejemplo: "smtp.gmail.com"' })}</i> </small>
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="tiempoInactividad" className="block">{intl.formatMessage({ id: 'Minutos de inactividad' })}</label>
                    <InputNumber
                        id="tiempoInactividad"
                        value={empresa.tiempoInactividad || 0 }
                        onChange={(e) => manejarCambioInputNumber(e, "tiempoInactividad")}
                        onFocus={manejarFocusInputNumber}
                        onBlur={manejarBlurInputNumber}
                        maxFractionDigits={0}
                        min={0}
                        max={99999999}
                        inputStyle={{ textAlign: 'right' }}
                        //className={`${(estadoGuardando && gastoCancelacion.diasParaEvento === "") ? "p-invalid" : ""}`}
                    />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'La cantidad de tiempo en minutos que tardará en cerrar la sesión por inactividad al usuario' })}</i> </small>
                </div>
                {
                    ...inputsDinamicos //Muestra las inputs generados
                }
            </div>

        </Fieldset>
    );
};

export default EditarDatosEmpresa;