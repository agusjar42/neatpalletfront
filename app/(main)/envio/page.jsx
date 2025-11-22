"use client";
import { getEnvio, getEnvioCount, deleteEnvio, generarDatosFake } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

const Envio = () => {
    const intl = useIntl();
    const toast = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'numero', header: intl.formatMessage({ id: 'Numero' }), tipo: 'string' },
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen' }), tipo: 'string' },
        { campo: 'destinoRuta', header: intl.formatMessage({ id: 'Destino' }), tipo: 'string' },
        { campo: 'fechaSalidaEspanol', header: intl.formatMessage({ id: 'Fecha salida' }), tipo: 'string' },
        { campo: 'fechaLlegadaEspanol', header: intl.formatMessage({ id: 'Fecha llegada' }), tipo: 'string' }
    ];

    const handleGenerarDatosFake = () => {
        confirmDialog({
            message: '¿Estás seguro de que quieres generar datos fake?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
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

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toast} position="top-right" />
            <div>
                <Button
                    label="Generar Datos Fake"
                    icon="pi pi-database"
                    severity="danger"
                    onClick={handleGenerarDatosFake}
                    className="mb-3"
                />
                <Crud
                    key={`envios-${refreshKey}`}
                    headerCrud={intl.formatMessage({ id: 'Envíos' })}
                    getRegistros={getEnvio}
                    getRegistrosCount={getEnvioCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    controlador={"Envios"}
                    filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                    editarComponente={<EditarEnvios />}
                    columnas={columnas}
                    deleteRegistro={deleteEnvio}
                    cargarDatosInicialmente={true}
                />
            </div>
        </>
    );
};

export default Envio;