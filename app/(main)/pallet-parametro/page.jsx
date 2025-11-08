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
            {/* Bocadillo de información */}
            <div className="p-mt-3">
                <div
                    className="flex align-items-center bg-red-100 border-round p-3 w-full"
                >
                    <span className="pi pi-info-circle text-blue-500 mr-2" style={{ fontSize: "1.5em" }} />
                    <span>
                        {intl.formatMessage({ id: 'Sección que muestra los parámetros asociados a un Pallet. Dado que la sección de Parámetro es susceptible de eliminar, esta también podría desaparecer.' })}
                    </span>
                </div>
            </div>
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