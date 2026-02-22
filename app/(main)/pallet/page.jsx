"use client";
import { getPallet, getPalletCount, deletePallet } from "@/app/api-endpoints/pallet";
import EditarPallets from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const Pallet = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'codigo', header: intl.formatMessage({ id: 'Código' }), tipo: 'string' },
        { campo: 'alias', header: intl.formatMessage({ id: 'Alias' }), tipo: 'string' },
        { campo: 'modelo', header: intl.formatMessage({ id: 'Modelo' }), tipo: 'string' },
        { campo: 'medidas', header: intl.formatMessage({ id: 'Medidas' }), tipo: 'string' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Orden' })]: registro.orden,
                [intl.formatMessage({ id: 'Código' })]: registro.codigo,
                [intl.formatMessage({ id: 'Alias' })]: registro.alias,
                [intl.formatMessage({ id: 'Modelo' })]: registro.modelo,
                [intl.formatMessage({ id: 'Medidas' })]: registro.medidas,
                [intl.formatMessage({ id: 'Fecha de Impresión' })]: registro.fechaImpresion,
                [intl.formatMessage({ id: 'Periodo envío mail (horas)' })]: registro.periodoEnvioMail,
            };
        });
    };

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Pallets' })}
                getRegistros={getPallet}
                getRegistrosCount={getPalletCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV', 'importarCSVPallets']}
                controlador={"Pallet"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarPallets />}
                columnas={columnas}
                deleteRegistro={deletePallet}
                procesarDatosParaCSV={procesarDatosParaCSV}
            />
        </div>
    );
};

export default Pallet;