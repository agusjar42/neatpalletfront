"use client";
import { getPalletParametro, getPalletParametroCount, deletePalletParametro } from "@/app/api-endpoints/pallet-parametro";
import EditarPalletParametros from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const PalletParametro = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'palletId', header: intl.formatMessage({ id: 'ID Pallet' }), tipo: 'number' },
        { campo: 'parametroId', header: intl.formatMessage({ id: 'ID Parámetro' }), tipo: 'number' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Parámetros de Pallet' })}
                getRegistros={getPalletParametro}
                getRegistrosCount={getPalletParametroCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Pallet Parametro"}
                editarComponente={<EditarPalletParametros />}
                columnas={columnas}
                deleteRegistro={deletePalletParametro}
            />
        </div>
    );
};

export default PalletParametro;