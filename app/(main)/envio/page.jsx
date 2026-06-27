"use client";
import { getEnvio, getEnvioCount, deleteEnvio } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import { EmpresaEnvioDetalle } from "../tablas-maestras/empresa/page";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { formatearFechaDate, getUsuarioSesion } from "@/app/utility/Utils";
import { Button } from 'primereact/button';
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/app/components/map/MapView"), {
    ssr: false,
});

const plannedRoute = [
    [39.4699, -0.3763],
    [39.4720, -0.3810],
    [39.4750, -0.3900],
];

const realRoute = [
    [39.4699, -0.3763],
    [39.4705, -0.3775],
    [39.4718, -0.3801],
    [39.4730, -0.3830],
    [39.4750, -0.3900],
];

const EnvioEdicionUnificada = (props) => {
    //
    //El alta y los botones de ver/editar deben abrir el editor clasico.
    //El click sobre la fila conserva el detalle moderno actual.
    //
    if (props.idEditar === 0 || props.modoAperturaRegistro === 'editar_boton' || props.modoAperturaRegistro === 'ver_boton') {
        return <EditarEnvios {...props} />;
    }

    return <EmpresaEnvioDetalle {...props} />;
};

const Envio = () => {
    const intl = useIntl();
    const [verRutaDialog, setVerRutaDialog] = useState(false);
    const [mostrarAccionesRuta, setMostrarAccionesRuta] = useState(false);

    useEffect(() => {
        if (!mostrarAccionesRuta) {
            setVerRutaDialog(false);
        }
    }, [mostrarAccionesRuta]);

    //
    //Mostramos el estado del envio con el mismo tono visual
    //que se ve en la referencia del usuario
    //
    const estadoEnvioBodyTemplate = (rowData) => (
        <span style={{ color: "#2f8f63", fontWeight: 500 }}>
            {rowData.estadoEnvio || "-"}
        </span>
    );

    //
    //Formateamos la hora en hh:mm para la ficha compacta de origen y destino
    //
    const formatearHoraCorta = (fecha) => {
        if (!fecha) {
            return "--:--";
        }

        const fechaDate = new Date(fecha);
        if (Number.isNaN(fechaDate.getTime())) {
            return "--:--";
        }

        return fechaDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    //
    //Normalizamos la fecha para soportar tanto string como Date
    //
    const formatearFechaCorta = (fecha) => {
        if (!fecha) {
            return "-";
        }

        const fechaDate = new Date(fecha);
        if (Number.isNaN(fechaDate.getTime())) {
            return "-";
        }

        return formatearFechaDate(fechaDate);
    };

    //
    //Construimos el bloque visual de origen y destino sin afectar al resto de pantallas
    //
    const crearRutaBodyTemplate = ({ color, tituloCampo, gpsCampo, fechaCampo }) => (rowData) => (
        <div className="envio-crud-ruta-cell">
            <div className="envio-crud-ruta-linea">
                <span
                    className="envio-crud-ruta-dot"
                    style={{ backgroundColor: color }}
                ></span>
                <strong>{rowData[tituloCampo] || "-"}</strong>
            </div>
            <div className="envio-crud-ruta-meta">{rowData[gpsCampo] || "-"}</div>
            <div className="envio-crud-ruta-meta">
                <span>{formatearFechaCorta(rowData[fechaCampo])}</span>
                <span className="envio-crud-ruta-hora-chip">{formatearHoraCorta(rowData[fechaCampo])}</span>
            </div>
        </div>
    );

    const origenBodyTemplate = crearRutaBodyTemplate({
        color: "#1f8f4e",
        tituloCampo: "origenRuta",
        gpsCampo: "gpsRutaOrigen",
        fechaCampo: "fechaSalida",
    });

    const destinoBodyTemplate = crearRutaBodyTemplate({
        color: "#c0362c",
        tituloCampo: "destinoRuta",
        gpsCampo: "gpsRutaDestino",
        fechaCampo: "fechaLlegada",
    });

    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'numero', header: intl.formatMessage({ id: 'Envio' }), tipo: 'string' },
        { campo: 'clienteNombre', header: intl.formatMessage({ id: 'Punto de entrega' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string', body: origenBodyTemplate },
        { campo: 'destinoRuta', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string', body: destinoBodyTemplate },
        { campo: 'estadoEnvio', header: intl.formatMessage({ id: 'Estado' }), tipo: 'string', body: estadoEnvioBodyTemplate }
    ];

    const handleGenerarRuta = () => {
        setVerRutaDialog(true);
    };

    const handleGenerarInforme = () => {
        window.open("/analisis_trazabilidad_ruta.pdf", "_blank");
    };

    return (
        <>
            <Dialog
                header={intl.formatMessage({ id: "Ver ruta" })}
                visible={verRutaDialog}
                onHide={() => setVerRutaDialog(false)}
                modal
                maximizable
                style={{ width: "92vw" }}
                contentStyle={{ padding: "1rem" }}
            >
                <MapView
                    center={[39.4699, -0.3763]}
                    plannedRoute={plannedRoute}
                    realRoute={realRoute}
                />
            </Dialog>
            <div>
                <Button
                    label={intl.formatMessage({ id: "Generar informe" })}
                    icon="pi pi-file"
                    severity="warning"
                    onClick={handleGenerarInforme}
                    className="mb-3"
                />
                {mostrarAccionesRuta && (
                    <>
                        <Button
                            label={intl.formatMessage({ id: "Ver ruta" })}
                            icon="pi pi-map"
                            severity="info"
                            onClick={handleGenerarRuta}
                            className="mb-3 mx-2"
                        />
                    </>
                )}
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Envíos' })}
                    getRegistros={getEnvio}
                    getRegistrosCount={getEnvioCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    accionEntradaPorFila="ver"
                    controlador={"Envíos"}
                    filtradoBase={{ empresaId: getUsuarioSesion()?.empresaId }}
                    editarComponente={<EnvioEdicionUnificada onModoEdicionChange={setMostrarAccionesRuta} />}
                    columnas={columnas}
                    deleteRegistro={deleteEnvio}
                    cargarDatosInicialmente={true}
                />
            </div>
        </>
    );
};

export default Envio;
