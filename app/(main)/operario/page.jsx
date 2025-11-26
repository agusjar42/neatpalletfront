"use client";
import { getOperario, getOperarioCount, deleteOperario } from "@/app/api-endpoints/operario";
import EditarOperarios from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';

const Operario = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'clienteNombre', header: intl.formatMessage({ id: 'Cliente' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'email', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' }
    ];

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Operarios' })}
                getRegistros={getOperario}
                getRegistrosCount={getOperarioCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Operario"}
                editarComponente={<EditarOperarios />}
                columnas={columnas}
                deleteRegistro={deleteOperario}
            />
        </div>
    );
};

export default Operario;