"use client";
import { getVistaTraduccionIdioma, getVistaTraduccionIdiomaCount, deleteTraduccion } from "@/app/api-endpoints/traduccion";
import EditarTraduccion from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
const TipoEvento = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'nombreIdioma', header: intl.formatMessage({ id: 'Idioma' }), tipo: 'string' },
        { campo: 'clave', header: intl.formatMessage({ id: 'Clave' }), tipo: 'string' },
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Traducciones' })}
                getRegistros={getVistaTraduccionIdioma}
                getRegistrosCount={getVistaTraduccionIdiomaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Traducciones"}
                empresaId={null}
                editarComponente={<EditarTraduccion />}
                columnas={columnas}
                deleteRegistro={deleteTraduccion}
            />
        </div>
    );
};
export default TipoEvento;