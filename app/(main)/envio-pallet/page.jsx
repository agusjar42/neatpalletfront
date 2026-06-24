"use client";
import { getEnvioPallet, getEnvioPalletCount, deleteEnvioPallet } from "@/app/api-endpoints/envio-pallet-usado";
import EditarEnvioPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioPallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'origenRuta', header: intl.formatMessage({ id: 'Origen Ruta' }), tipo: 'string' },
        { campo: 'codigoPallet', header: intl.formatMessage({ id: 'CÃ³digo Pallet' }), tipo: 'string' },
        { campo: 'aliasPallet', header: intl.formatMessage({ id: 'Alias Pallet' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Informes pallets' })}
                getRegistros={getEnvioPallet}
                getRegistrosCount={getEnvioPalletCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Envio Pallet"}
                editarComponente={<EditarEnvioPallets />}
                columnas={columnas}
                deleteRegistro={deleteEnvioPallet}
            />
        </div>
    );
};

export default EnvioPallet;
