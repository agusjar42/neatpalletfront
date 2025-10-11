"use client";
import { getEnvio, getEnvioCount, deleteEnvio, generarDatosFake } from "@/app/api-endpoints/envio";
import EditarEnvios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { getUsuarioSesion } from "@/app/utility/Utils";
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const Envio = () => {
    const intl = useIntl();

    const columnas = [
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
                    alert('Datos fake generados correctamente');
                } catch (error) {
                    console.error('Error al generar datos fake:', error);
                    alert('Error al generar datos fake');
                }
            }
        });
    };

    return (
        <>
            <ConfirmDialog />
            <div>
                <Button
                    label="Generar Datos Fake"
                    icon="pi pi-database"
                    severity="danger"
                    onClick={handleGenerarDatosFake}
                    className="mb-3"
                />
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Envíos' })}
                    getRegistros={getEnvio}
                    getRegistrosCount={getEnvioCount}
                    botones={['nuevo', 'ver', 'editar', 'eliminar', 'descargarCSV']}
                    controlador={"Envios"}
                    filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                    editarComponente={<EditarEnvios />}
                    columnas={columnas}
                    deleteRegistro={deleteEnvio}
                />
            </div>
        </>
    );
};

export default Envio;