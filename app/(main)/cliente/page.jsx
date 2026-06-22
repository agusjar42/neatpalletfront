"use client";
import {
  getCliente,
  getClienteCount,
  deleteCliente,
} from "@/app/api-endpoints/cliente";
import EditarClientes from "./editar";
import Crud from "../../components/shared/crud";
import { useIntl } from "react-intl";
import { getUsuarioSesion } from "@/app/utility/Utils";

const Cliente = () => {
  const intl = useIntl();

  //
  //Definimos anchos minimos para que las columnas mantengan la misma estructura visual
  //
  const columnas = [
    {
      campo: "orden",
      header: "ORDEN",
      tipo: "number",
      headerStyle: { minWidth: "5.5rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "codigo",
      header: "CODIGO",
      tipo: "string",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "nombre",
      header: "NOMBRE",
      tipo: "string",
      headerStyle: { minWidth: "14rem" },
    },
    {
      campo: "direccion",
      header: "DIRECCION",
      tipo: "string",
      headerStyle: { minWidth: "14rem" },
    },
    {
      campo: "horario",
      header: "HORARIO",
      tipo: "string",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "telefono",
      header: "TELEFONO",
      tipo: "string",
      headerStyle: { minWidth: "8.5rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "mail",
      header: "EMAIL",
      tipo: "string",
      headerStyle: { minWidth: "14rem" },
      style: { whiteSpace: "nowrap" },
    },
    {
      campo: "activoSN",
      header: "ESTADO",
      tipo: "booleano",
      headerStyle: { minWidth: "8rem" },
      style: { whiteSpace: "nowrap" },
    },
  ];

  return (
    <div>
      <Crud
        headerCrud={intl.formatMessage({ id: "Clientes" })}
        getRegistros={getCliente}
        getRegistrosCount={getClienteCount}
        botones={["nuevo", "ver", "editar", "eliminar", "descargarCSV"]}
        controlador={"Clientes"}
        filtradoBase={{ empresaId: getUsuarioSesion()?.empresaId }}
        editarComponente={<EditarClientes />}
        columnas={columnas}
        deleteRegistro={deleteCliente}
      />
    </div>
  );
};

export default Cliente;
