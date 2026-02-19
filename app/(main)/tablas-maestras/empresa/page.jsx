"use client";
import { getEmpresas, getEmpresasCount, deleteEmpresa } from "@/app/api-endpoints/empresa";
import EditarEmpresa from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'

const Empresa = () => {
    const intl = useIntl()
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'codigo', header: intl.formatMessage({ id: 'Codigo' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Nombre' }), tipo: 'string' },
        { campo: 'descripcion', header: intl.formatMessage({ id: 'Descripción' }), tipo: 'string' },
        { campo: 'imagen', header: intl.formatMessage({ id: 'Imagen' }), tipo: 'imagen' },
        { campo: 'logo', header: intl.formatMessage({ id: 'Logo' }), tipo: 'imagen' },
    ]

    // Esta función transforma los registros para su exportación en formato CSV,
    // Permite asignar nombres personalizados a las columnas existentes y agregar nuevas columnas calculadas según las necesidades.
    const procesarDatosParaCSV = (registros) => {
        return registros.map(registro => {
            return {
                [intl.formatMessage({ id: 'Código' })]: registro.codigo,
                [intl.formatMessage({ id: 'Nombre' })]: registro.nombre,
                [intl.formatMessage({ id: 'Descripción' })]: registro.descripcion,
            };
        });
    };

    return (
        <div>
            {//                
            //Si estoy entrando en la vista de usuarios y soy administrador no filtro por empresa mostrando todos los usuarios del sistema
            //
            }
            {(JSON.parse(localStorage.getItem('userDataNeatpallet'))?.["usuarioAdmin"] || "N") === "S" &&
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Empresas' })}
                    seccion={"Empresa"}
                    getRegistros={getEmpresas}
                    getRegistrosCount={getEmpresasCount}
                    botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                    controlador={"Empresas"}
                    editarComponente={<EditarEmpresa />}
                    columnas={columnas}
                    deleteRegistro={deleteEmpresa}
                    procesarDatosParaCSV={procesarDatosParaCSV}
                />
            }
            {//                
            //Si estoy entrando en la vista de usuarios y NO soy administrador filtro por empresa mostrando solo los usuarios de la empresa
            //
            }
            {(JSON.parse(localStorage.getItem('userDataNeatpallet'))?.["usuarioAdmin"] || "N") !== "S" &&
                <Crud
                    headerCrud={intl.formatMessage({ id: 'Empresas' })}
                    seccion={"Empresa"}
                    getRegistros={getEmpresas}
                    getRegistrosCount={getEmpresasCount}
                    botones={['ver', 'editar', 'eliminar', 'descargarCSV']}
                    filtradoBase={{
                        id: Number(localStorage.getItem('empresa'))
                    }}
                    controlador={"Empresas"}
                    editarComponente={<EditarEmpresa />}
                    columnas={columnas}
                    deleteRegistro={deleteEmpresa}
                    procesarDatosParaCSV={procesarDatosParaCSV}
                />
            }
        </div>
    );
};
export default Empresa;