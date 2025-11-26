"use client";
import { getLugarParada, getLugarParadaCount, deleteLugarParada } from "@/app/api-endpoints/lugar-parada";
import EditarLugarParadas from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';

const LugarParada = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'clienteNombre', header: intl.formatMessage({ id: 'Cliente' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'direccion', header: intl.formatMessage({ id: 'Dirección' }), tipo: 'string' },
        { campo: 'direccionGps', header: intl.formatMessage({ id: 'Dirección GPS' }), tipo: 'string' }
    ];

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Lugares de Parada' })}
                getRegistros={getLugarParada}
                getRegistrosCount={getLugarParadaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Lugar Parada"}
                editarComponente={<EditarLugarParadas />}
                columnas={columnas}
                deleteRegistro={deleteLugarParada}
            />
        </div>
    );
};

export default LugarParada;