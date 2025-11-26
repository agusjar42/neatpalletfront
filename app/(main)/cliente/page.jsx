"use client";
import { getCliente, getClienteCount, deleteCliente } from "@/app/api-endpoints/cliente";
import EditarClientes from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl';
import { getUsuarioSesion } from "@/app/utility/Utils";

const Cliente = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'telefono', header: intl.formatMessage({ id: 'Teléfono' }), tipo: 'string' },
        { campo: 'mail', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
        { campo: 'empresaNombre', header: intl.formatMessage({ id: 'Empresa' }), tipo: 'string' }
    ];

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Clientes' })}
                getRegistros={getCliente}
                getRegistrosCount={getClienteCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Cliente"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarClientes />}
                columnas={columnas}
                deleteRegistro={deleteCliente}
            />
        </div>
    );
};

export default Cliente;