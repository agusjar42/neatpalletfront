import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';
import ArchivoMultipleInput from "../../components/shared/archivo_multiple_input";
import ArchivoInput from "../../components/shared/archivo_input";
import { useIntl } from 'react-intl'
import { InputTextarea } from 'primereact/inputtextarea';

const EditarDatosEnvio = ({ envio, setEnvio, estadoGuardando, listaTipoArchivos }) => {
    const intl = useIntl()
    
    //Crear inputs de archivos
    const inputsDinamicos = [];
    for (const tipoArchivo of listaTipoArchivos) {
        //Depende del tipo del input se genera multiple o no
        if (tipoArchivo.multiple === 'S') {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12" key={tipoArchivo.id}>
                    <label>{tipoArchivo.nombre}</label>
                    <ArchivoMultipleInput
                        registro={envio}
                        setRegistro={setEnvio}
                        archivoTipo={tipoArchivo.tipo}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
        else {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4" key={tipoArchivo.id}>
                    <ArchivoInput
                        registro={envio}
                        setRegistro={setEnvio}
                        archivoTipo={tipoArchivo.tipo}
                        archivoHeader={tipoArchivo.nombre}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
    }

    // Opciones para el dropdown de años (últimos 10 años + próximos 5)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 10; i <= currentYear + 5; i++) {
        yearOptions.push({ label: i.toString(), value: i.toString() });
    }

    const preparaFechaParaCalendario = (fecha) => {
        //
        //Si la fecha no existe devolvemos nulo
        //
        if (!fecha) return null;
        //
        //Si la fecha ya es un objeto Date la devolvemos directamente
        //
        if (fecha instanceof Date) return fecha;
        //
        //Si la fecha es un string, intentamos convertirla correctamente para que el calendario la entienda
        //
        if (typeof fecha === "string") {
            //
            // Troceamos la fecha y la hora si viene con hora
            //
            const [fechaTroceada, tiempoTroceado = "00:00:00"] = fecha.split(' ');
            const [dia, mes, año] = fechaTroceada.split('/');
            const [hora, minuto, segundo] = tiempoTroceado.split(':');
            //
            //Creamos la fecha correctamente para que el calendario la entienda
            //
            const fechaNativa = new Date(
                Number(año),
                Number(mes) - 1,
                Number(dia),
                Number(hora),
                Number(minuto),
                Number(segundo)
            );
            if (!isNaN(fechaNativa)) return fechaNativa;
        }
        return null;
    };

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos del envío' })}>
            <div className="formgrid grid">
                                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="anyo"><b>{intl.formatMessage({ id: 'Año' })}*</b></label>
                    <Dropdown 
                        value={envio.anyo} 
                        options={yearOptions}
                        onChange={(e) => setEnvio({ ...envio, anyo: e.target.value })}
                        placeholder={intl.formatMessage({ id: 'Selecciona el año' })}
                        className={`${(estadoGuardando && envio.anyo === "") ? "p-invalid" : ""}`}
                    />
                </div>

                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="paradasPrevistas">{intl.formatMessage({ id: 'Paradas previstas' })}</label>
                    <InputText value={envio.paradasPrevistas}
                        placeholder={intl.formatMessage({ id: 'Número de paradas previstas' })}
                        onChange={(e) => setEnvio({ ...envio, paradasPrevistas: e.target.value })}
                        maxLength={50} />
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="origen"><b>{intl.formatMessage({ id: 'Origen' })}*</b></label>
                    <InputTextarea value={envio.origen} autoResize
                        placeholder={intl.formatMessage({ id: 'Dirección de origen del envío' })}
                        onChange={(e) => setEnvio({ ...envio, origen: e.target.value })}
                        className={`${(estadoGuardando && envio.origen === "") ? "p-invalid" : ""}`}
                        rows={3} cols={30} maxLength={500} />
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="destino"><b>{intl.formatMessage({ id: 'Destino' })}*</b></label>
                    <InputTextarea value={envio.destino} autoResize
                        placeholder={intl.formatMessage({ id: 'Dirección de destino del envío' })}
                        onChange={(e) => setEnvio({ ...envio, destino: e.target.value })}
                        className={`${(estadoGuardando && envio.destino === "") ? "p-invalid" : ""}`}
                        rows={3} cols={30} maxLength={500} />
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="origenCoordenadasGps">{intl.formatMessage({ id: 'Coordenadas GPS origen' })}</label>
                    <InputTextarea value={envio.origenCoordenadasGps} autoResize
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS del origen (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, origenCoordenadasGps: e.target.value })}
                        rows={2} cols={30} maxLength={500} />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Formato: latitud, longitud' })}</i> </small>
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="destinoCoordenadasGps">{intl.formatMessage({ id: 'Coordenadas GPS destino' })}</label>
                    <InputTextarea value={envio.destinoCoordenadasGps} autoResize
                        placeholder={intl.formatMessage({ id: 'Coordenadas GPS del destino (lat, lng)' })}
                        onChange={(e) => setEnvio({ ...envio, destinoCoordenadasGps: e.target.value })}
                        rows={2} cols={30} maxLength={500} />
                    <small style={{ color: '#94949f', fontSize: '10px' }}> <i>{intl.formatMessage({ id: 'Formato: latitud, longitud' })}</i> </small>
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="fechaSalida">{intl.formatMessage({ id: 'Fecha de salida' })}</label>
                    <Calendar 
                        value={envio.fechaSalida ? preparaFechaParaCalendario(envio.fechaSalida) : null} 
                        onChange={(e) => setEnvio({ ...envio, fechaSalida: e.target.value })}
                        showTime 
                        hourFormat="24"
                        placeholder={intl.formatMessage({ id: 'Selecciona fecha y hora de salida' })}
                        dateFormat="dd/mm/yy"
                    />
                </div>
                
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-6">
                    <label htmlFor="fechaLlegada">{intl.formatMessage({ id: 'Fecha de llegada' })}</label>
                    <Calendar 
                        value={envio.fechaLlegada ? preparaFechaParaCalendario(envio.fechaLlegada) : null} 
                        onChange={(e) => setEnvio({ ...envio, fechaLlegada: e.target.value })}
                        showTime 
                        hourFormat="24"
                        placeholder={intl.formatMessage({ id: 'Selecciona fecha y hora de llegada' })}
                        dateFormat="dd/mm/yy"
                    />
                </div>

                {
                    ...inputsDinamicos //Muestra las inputs generados
                }
            </div>

        </Fieldset>
    );
};

export default EditarDatosEnvio;