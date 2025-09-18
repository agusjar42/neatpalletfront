"use client";
import { getPalletParametro, getPalletParametroCount, deletePalletParametro } from "@/app/api-endpoints/pallet-parametro";
import EditarPalletParametros from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'

const PalletParametro = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'pallet', header: intl.formatMessage({ id: 'Pallet' }), tipo: 'string' },
        { campo: 'parametro', header: intl.formatMessage({ id: 'Parámetro' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
        { campo: 'textoLibre', header: intl.formatMessage({ id: 'Valor Libre' }), tipo: 'string' },
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