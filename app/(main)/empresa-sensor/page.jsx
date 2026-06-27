"use client";
import { getEmpresaSensor, getEmpresaSensorCount, deleteEmpresaSensor } from "@/app/api-endpoints/empresa-sensor";
import EditarEmpresaSensor from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from 'react-intl'
import { getUsuarioSesion } from "@/app/utility/Utils";

const EmpresaSensor = () => {
    const intl = useIntl();
    const columnas = [
        { campo: 'orden', header: intl.formatMessage({ id: 'Orden' }), tipo: 'string' },
        { campo: 'nombre', header: intl.formatMessage({ id: 'Tipo de Sensor' }), tipo: 'string' },
        { campo: 'unidad', header: intl.formatMessage({ id: 'Unidad' }), tipo: 'string' },
        { campo: 'valorMinimo', header: intl.formatMessage({ id: 'Minimo' }), tipo: 'string' },
        { campo: 'valorMaximo', header: intl.formatMessage({ id: 'Maximo' }), tipo: 'string' },
        { campo: 'activoSn', header: intl.formatMessage({ id: 'Activo' }), tipo: 'booleano' },
    ]

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Sensores activos' })}
                getRegistros={getEmpresaSensor}
                getRegistrosCount={getEmpresaSensorCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Sensores activos"}
                filtradoBase={{empresaId: getUsuarioSesion()?.empresaId}}
                editarComponente={<EditarEmpresaSensor />}
                mostrarEdicionEnModal={true}
                modalEdicionProps={{
                    showHeader: false,
                    className: "neat-crud-edit-dialog catalogo-edit-dialog",
                    style: { width: "min(720px, 94vw)" },
                }}
                columnas={columnas}
                deleteRegistro={deleteEmpresaSensor}
            />
        </div>
    );
};

export default EmpresaSensor;
