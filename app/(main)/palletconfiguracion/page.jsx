"use client";
import { getPalletConfiguracion, getPalletConfiguracionCount, deletePalletConfiguracion } from "@/app/api-endpoints/palletconfiguracion";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";
const Movimiento = () => {
    const intl = useIntl();
    const columnas = [
 
        { campo: 'evento_guardado_minuto', header: intl.formatMessage({ id: 'evento_guardado_minuto' }), tipo: 'string' }
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'evento_guardado_minuto' })]: registro.evento_guardado_minuto
            };
        });
    };

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Envios de Palets' })}
                seccion={"Conf. Pallets"}
                getRegistros={getPalletConfiguracion}
                getRegistrosCount={getPalletConfiguracionCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Conf. Pallets"}
                filtradoBase={{empresa_Id: getUsuarioSesion()?.empresaId}}
                columnas={columnas}
                deleteRegistro={deletePalletConfiguracion}
                procesarDatosParaCSV={procesarDatosParaCSV}
            />
        </div>
    );
};
export default Movimiento;