"use client";
import { getPallet, getPalletCount, deletePallet } from "@/app/api-endpoints/pallet";
import EditarPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const Pallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'codigo', header: intl.formatMessage({ id: 'Código' }), tipo: 'string' },
        { campo: 'alias', header: intl.formatMessage({ id: 'Alias' }), tipo: 'string' },
        { campo: 'modelo', header: intl.formatMessage({ id: 'Modelo' }), tipo: 'string' },
        { campo: 'medidas', header: intl.formatMessage({ id: 'Medidas' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Pallets' })}
                getRegistros={getPallet}
                getRegistrosCount={getPalletCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Pallet"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarPallets />}
                columnas={columnas}
                deleteRegistro={deletePallet}
            />
        </div>
    );
};

export default Pallet;