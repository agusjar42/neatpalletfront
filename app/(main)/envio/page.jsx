"use client";
import { getEnvio, getEnvioCount, deleteEnvio, generarDatosFake } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
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

const Envio = () => {
    const intl = useIntl();
    const toast = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [verRutaDialog, setVerRutaDialog] = useState(false);
    const [mostrarAccionesRuta, setMostrarAccionesRuta] = useState(false);

    useEffect(() => {
        if (!mostrarAccionesRuta) {
            setVerRutaDialog(false);
        }
    }, [mostrarAccionesRuta]);

    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'numero', header: intl.formatMessage({ id: 'Numero' }), tipo: 'string' },
        { campo: 'clienteNombre', header: intl.formatMessage({ id: 'Cliente' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destinoRuta', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'fechaSalidaEspanol', header: intl.formatMessage({ id: 'Fecha salida' }), tipo: 'string' },
        { campo: 'fechaLlegadaEspanol', header: intl.formatMessage({ id: 'Fecha llegada' }), tipo: 'string' }
    ];

    const handleGenerarDatosFake = () => {
        confirmDialog({
            message: intl.formatMessage({ id: '¿Estás seguro de que quieres generar datos fake?' }),
            header: intl.formatMessage({ id: 'Confirmación' }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: intl.formatMessage({ id: 'Sí' }),
            rejectLabel: intl.formatMessage({ id: 'No' }),
            accept: async () => {
                try {
                    const datosSesion = getUsuarioSesion();
                    await generarDatosFake({ usuarioCreacion: datosSesion.id, empresaId: datosSesion.empresaId });
                    toast.current?.show({
                        severity: "success",
                        summary: "OK",
                        detail: intl.formatMessage({ id: 'Datos fake generados correctamente' }),
                        life: 3000,
                    });
                    // Recargar los datos del Crud
                    setRefreshKey(prev => prev + 1);
                } catch (error) {
                    console.error('Error al generar datos fake:', error);
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: intl.formatMessage({ id: 'Error al generar datos fake' }),
                        life: 3000,
                    });
                }
            }
        });
    };

    const handleGenerarRuta = () => {
        setVerRutaDialog(true);
    };

    const handleGenerarInforme = () => {
        window.open("/analisis_trazabilidad_ruta.pdf", "_blank");
    };

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toast} position="top-right" />
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
                    label={intl.formatMessage({ id: "Generar Datos Fake" })}
                    icon="pi pi-database"
                    severity="danger"
                    onClick={handleGenerarDatosFake}
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
                        <Button
                            label={intl.formatMessage({ id: "Generar informe" })}
                            icon="pi pi-file"
                            severity="warning"
                            onClick={handleGenerarInforme}
                            className="mb-3"
                        />
                    </>
                )}
                <Crud
                    key={`envios-${refreshKey}`}
                    headerCrud={intl.formatMessage({ id: 'Envíos' })}
                    getRegistros={getEnvio}
                    getRegistrosCount={getEnvioCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    controlador={"Envíos"}
                    filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                    editarComponente={<EditarEnvios onModoEdicionChange={setMostrarAccionesRuta} />}
                    columnas={columnas}
                    deleteRegistro={deleteEnvio}
                    cargarDatosInicialmente={true}
                />
            </div>
        </>
    );
};

export default Envio;
