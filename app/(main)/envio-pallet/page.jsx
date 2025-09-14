"use client";
import { getEnvioPallet, getEnvioPalletCount, deleteEnvioPallet } from "@/app/api-endpoints/envio-pallet";
import EditarEnvioPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const EnvioPallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'envioId', header: intl.formatMessage({ id: 'ID Envío' }), tipo: 'number' },
        { campo: 'palletId', header: intl.formatMessage({ id: 'ID Pallet' }), tipo: 'number' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envíos de Pallet' })}
                getRegistros={getEnvioPallet}
                getRegistrosCount={getEnvioPalletCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"EnvioPallet"}
                editarComponente={<EditarEnvioPallets />}
                columnas={columnas}
                deleteRegistro={deleteEnvioPallet}
            />
        </div>
    );
};

export default EnvioPallet;