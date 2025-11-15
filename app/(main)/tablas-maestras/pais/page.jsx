"use client";
import { getPaises, getPaisesCount, deletePais } from "@/app/api-endpoints/pais";
import EditarPais from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
const Pais = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'iso', header: intl.formatMessage({ id: 'Iso' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]
 
    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Paises' })}
                getRegistros={getPaises}
                getRegistrosCount={getPaisesCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Paises"}
                empresaId={null}
                editarComponente={<EditarPais />}
                columnas={columnas}
                deleteRegistro={deletePais}
            />
        </div>
    );
};
export default Pais;