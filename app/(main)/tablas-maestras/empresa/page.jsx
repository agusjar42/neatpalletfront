"use client";
import { getEmpresas, getEmpresasCount, deleteEmpresa } from "@/app/api-endpoints/empresa";
import EditarEmpresa from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'

const Empresa = () => {
    const intl = useIntl()
    const columnas = [
        { campo: 'codigo', header: intl.formatMessage({ id: 'Codigo' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'descripcion', header: intl.formatMessage({ id: 'Descripcion' }), tipo: 'string' },
        { campo: 'email', header: intl.formatMessage({ id: 'Email' }), tipo: 'string' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Codigo' })]: registro.codigo,
                [intl.formatMessage({ id: 'Nombre' })]: registro.nombre,
                [intl.formatMessage({ id: 'Descripcion' })]: registro.descripcion,
                [intl.formatMessage({ id: 'Email' })]: registro.email,
            };
        });
    };

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Empresas' })}
                getRegistros={getEmpresas}
                getRegistrosCount={getEmpresasCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Empresas"}
                empresaId={null}
                editarComponente={<EditarEmpresa />}
                columnas={columnas}
                deleteRegistro={deleteEmpresa}
                procesarDatosParaCSV={procesarDatosParaCSV}
            />
        </div>
    );
};
export default Empresa;