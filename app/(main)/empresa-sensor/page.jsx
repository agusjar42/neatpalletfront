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
        { campo: 'valor', header: intl.formatMessage({ id: 'Valor' }), tipo: 'string' },
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
                columnas={columnas}
                deleteRegistro={deleteEmpresaSensor}
            />
        </div>
    );
};

export default EmpresaSensor;
