"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { postEmpresa, patchEmpresa } from "@/app/api-endpoints/empresa";
import {
  getVistaUsuarios,
  getVistaUsuariosCount,
  deleteUsuario,
} from "@/app/api-endpoints/usuario";
import {
  getCliente,
  getClienteCount,
  deleteCliente,
  postCliente,
  patchCliente,
} from "@/app/api-endpoints/cliente";
import {
  getProducto,
  getProductoCount,
  deleteProducto,
  postProducto,
  patchProducto,
} from "@/app/api-endpoints/producto";
import {
  getEnvio,
  getEnvioCount,
  deleteEnvio,
  generarDatosFake,
} from "@/app/api-endpoints/envio";
import {
  getEnvioSensorEmpresa,
  getEnvioSensorEmpresaCount,
  deleteEnvioSensorEmpresa,
  crearEnvioSensorEmpresaDesdetipoSensor,
} from "@/app/api-endpoints/envio-sensor-empresa";
import {
  getTipoCarroceria,
  getTipoCarroceriaCount,
  deleteTipoCarroceria,
  postTipoCarroceria,
  patchTipoCarroceria,
} from "@/app/api-endpoints/tipo-carroceria";
import {
  getTipoTransporte,
  getTipoTransporteCount,
  deleteTipoTransporte,
  postTipoTransporte,
  patchTipoTransporte,
} from "@/app/api-endpoints/tipo-transporte";
import {
  getEventoConfiguracion,
  getEventoConfiguracionCount,
} from "@/app/api-endpoints/evento-configuracion";
import EditarDatosEmpresa from "./EditarDatosEmpresa";
import EditarUsuario from "../../usuarios/editar";
import EditarCliente from "../../cliente/editar";
import EditarProducto from "../../producto/editar";
import EditarEnvio from "../../envio/editar";
import EditarEnvioSensorEmpresa from "../../envio-sensor-empresa/editar";
import EditarTipoCarroceria from "../../tipo-carroceria/editar";
import EditarTipoTransporte from "../../tipo-transporte/editar";
import PalletsAsignadosEmpresa from "./PalletsAsignadosEmpresa";
import "primeicons/primeicons.css";
import { getUsuarioSesion, reemplazarNullPorVacio } from "@/app/utility/Utils";
import { useIntl } from "react-intl";
import Crud from "../../../components/shared/crud";
import { getRol } from "@/app/api-endpoints/rol";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import {
  createResult,
  getUsuarioSesionId,
  getValueFromRow,
  normalizeHeader,
  parseActivoSN,
  parseNumberOrNull,
} from "@/app/utility/csv-import-utils";

const EditarEmpresa = ({
  idEditar,
  setIdEditar,
  rowData,
  emptyRegistro,
  setRegistroResult,
  editable,
}) => {
  const intl = useIntl();
  const toast = useRef(null);
  const [empresa, setEmpresa] = useState(emptyRegistro);
  const [estadoGuardando, setEstadoGuardando] = useState(false);
  const [estadoGuardandoBoton, setEstadoGuardandoBoton] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cargandoSensores, setCargandoSensores] = useState(false);
  const [refreshSensores, setRefreshSensores] = useState(0);
  const [refreshEnvios, setRefreshEnvios] = useState(0);

  const columnasUsuariosEmpresa = [
    {
      campo: "nombreRol",
      header: intl.formatMessage({ id: "Rol" }),
      tipo: "string",
    },
    {
      campo: "avatar",
      header: intl.formatMessage({ id: "Avatar" }),
      tipo: "imagen",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "mail",
      header: intl.formatMessage({ id: "Email" }),
      tipo: "string",
    },
    {
      campo: "telefono",
      header: intl.formatMessage({ id: "Teléfono" }),
      tipo: "string",
    },
    {
      campo: "activoSn",
      header: intl.formatMessage({ id: "Activo" }),
      tipo: "booleano",
    },
  ];

  const columnasPuntosEntrega = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "number",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "telefono",
      header: intl.formatMessage({ id: "Teléfono" }),
      tipo: "string",
    },
    {
      campo: "mail",
      header: intl.formatMessage({ id: "Email" }),
      tipo: "string",
    },
  ];

  const columnasProducto = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "number",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "pesoKgs",
      header: intl.formatMessage({ id: "Peso (Kg)" }),
      tipo: "number",
    },
    {
      campo: "activoSN",
      header: intl.formatMessage({ id: "Activo" }),
      tipo: "booleano",
    },
  ];

  const columnasEnvio = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "string",
    },
    {
      campo: "numero",
      header: intl.formatMessage({ id: "Numero" }),
      tipo: "string",
    },
    {
      campo: "clienteNombre",
      header: intl.formatMessage({ id: "Punto de entrega" }),
      tipo: "string",
    },
    {
      campo: "origenRuta",
      header: intl.formatMessage({ id: "Origen" }),
      tipo: "string",
    },
    {
      campo: "destinoRuta",
      header: intl.formatMessage({ id: "Destino" }),
      tipo: "string",
    },
    {
      campo: "fechaSalidaEspanol",
      header: intl.formatMessage({ id: "Fecha salida" }),
      tipo: "string",
    },
    {
      campo: "fechaLlegadaEspanol",
      header: intl.formatMessage({ id: "Fecha llegada" }),
      tipo: "string",
    },
  ];

  const columnasSensorEmpresa = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "string",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Tipo de Sensor" }),
      tipo: "string",
    },
    {
      campo: "valor",
      header: intl.formatMessage({ id: "Valor" }),
      tipo: "string",
    },
  ];

  const columnasCatalogosGlobales = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "string",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "activoSn",
      header: intl.formatMessage({ id: "Activo" }),
      tipo: "booleano",
    },
  ];

  const columnasEventoConfiguracion = [
    {
      campo: "orden",
      header: intl.formatMessage({ id: "Orden" }),
      tipo: "string",
    },
    {
      campo: "nombre",
      header: intl.formatMessage({ id: "Nombre" }),
      tipo: "string",
    },
    {
      campo: "valor",
      header: intl.formatMessage({ id: "Valor" }),
      tipo: "string",
    },
    {
      campo: "unidadMedida",
      header: intl.formatMessage({ id: "Unidad de medida" }),
      tipo: "string",
    },
  ];

  const procesarImportacionUsuariosEmpresaCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    const [roles, idiomas] = await Promise.all([
      getRol(JSON.stringify({ where: { and: { empresaId: empresa.id } }, limit: 100000 })),
      getIdiomas(JSON.stringify({ limit: 100000 })),
    ]);

    const rolByNombre = new Map();
    roles.forEach((item) => {
      if (item.nombre) rolByNombre.set(normalizeHeader(item.nombre), item);
    });

    const idiomaByNombre = new Map();
    const idiomaByIso = new Map();
    idiomas.forEach((item) => {
      if (item.nombre) idiomaByNombre.set(normalizeHeader(item.nombre), item);
      if (item.iso) idiomaByIso.set(normalizeHeader(item.iso), item);
    });

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const mail = getValueFromRow(row, ["mail", "email", "correo"]);
        const nombre = getValueFromRow(row, ["nombre"]);
        const telefono = getValueFromRow(row, ["telefono", "tel"]);
        const rolId = parseNumberOrNull(getValueFromRow(row, ["rolId", "rolid"])) ??
          rolByNombre.get(normalizeHeader(getValueFromRow(row, ["rol", "nombreRol"])))?.id;
        const idiomaValor = getValueFromRow(row, ["idioma", "iso"]);
        const idiomaId = parseNumberOrNull(getValueFromRow(row, ["idiomaId", "idiomaid"])) ??
          idiomaByNombre.get(normalizeHeader(idiomaValor))?.id ??
          idiomaByIso.get(normalizeHeader(idiomaValor))?.id ??
          getUsuarioSesion()?.idiomaId;

        if (!rowId && !mail) {
          throw new Error(`Fila ${i + 2}: El email es obligatorio para insertar`);
        }

        const payload = {
          empresaId: empresa.id,
          nombre: nombre || null,
          mail: mail || null,
          telefono: telefono || null,
          activoSn: parseActivoSN(getValueFromRow(row, ["activoSn", "activo"]), "S"),
          usuarioAdmin: parseActivoSN(getValueFromRow(row, ["usuarioAdmin", "admin"]), "N"),
        };

        if (rolId) payload.rolId = rolId;
        if (idiomaId) payload.idiomaId = idiomaId;

        if (rowId) {
          payload.usuModificacion = usuarioSesionId;
          await patchUsuario(rowId, payload);
          result.updated++;
        } else {
          if (!payload.rolId || !payload.idiomaId) {
            throw new Error(`Fila ${i + 2}: Para insertar, rolId e idiomaId son obligatorios`);
          }
          payload.usuCreacion = usuarioSesionId;
          await postUsuario(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  const procesarImportacionPuntosEntregaCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        const mail = getValueFromRow(row, ["mail", "email", "correo"]);
        const telefono = getValueFromRow(row, ["telefono", "tel"]);
        const orden = parseNumberOrNull(getValueFromRow(row, ["orden"]));

        if (!rowId && !nombre && !mail) {
          throw new Error(`Fila ${i + 2}: Debe informar al menos Nombre o Email para insertar`);
        }

        const payload = {
          empresaId: empresa.id,
          nombre: nombre || null,
          mail: mail || null,
          telefono: telefono || null,
          orden,
        };

        if (rowId) {
          payload.usuModificacion = usuarioSesionId;
          await patchCliente(rowId, payload);
          result.updated++;
        } else {
          payload.usuCreacion = usuarioSesionId;
          await postCliente(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  const procesarImportacionProductosEmpresaCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!rowId && !nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const payload = {
          empresaId: empresa.id,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          pesoKgs: parseNumberOrNull(getValueFromRow(row, ["pesoKgs", "peso", "pesokg"])),
          activoSN: parseActivoSN(getValueFromRow(row, ["activoSN", "activoSn", "activo"]), "S"),
        };

        if (rowId) {
          payload.usuModificacion = usuarioSesionId;
          await patchProducto(rowId, payload);
          result.updated++;
        } else {
          payload.usuCreacion = usuarioSesionId;
          await postProducto(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  const procesarImportacionTipoCarroceriaEmpresaCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!rowId && !nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const payload = {
          empresaId: empresa.id,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          activoSn: parseActivoSN(getValueFromRow(row, ["activoSn", "activo"]), "S"),
        };

        if (rowId) {
          payload.usuarioModificacion = usuarioSesionId;
          await patchTipoCarroceria(rowId, payload);
          result.updated++;
        } else {
          payload.usuarioCreacion = usuarioSesionId;
          await postTipoCarroceria(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  const procesarImportacionTipoTransporteEmpresaCSV = async ({ rowsNormalizados }) => {
    const result = createResult();
    const usuarioSesionId = getUsuarioSesionId();

    for (let i = 0; i < rowsNormalizados.length; i++) {
      try {
        const row = rowsNormalizados[i];
        const rowId = parseNumberOrNull(getValueFromRow(row, ["id"]));
        const nombre = getValueFromRow(row, ["nombre"]);
        if (!rowId && !nombre) throw new Error(`Fila ${i + 2}: El nombre es obligatorio`);

        const payload = {
          empresaId: empresa.id,
          nombre,
          orden: parseNumberOrNull(getValueFromRow(row, ["orden"])),
          activoSn: parseActivoSN(getValueFromRow(row, ["activoSn", "activo"]), "S"),
        };

        if (rowId) {
          payload.usuarioModificacion = usuarioSesionId;
          await patchTipoTransporte(rowId, payload);
          result.updated++;
        } else {
          payload.usuarioCreacion = usuarioSesionId;
          await postTipoTransporte(payload);
          result.created++;
        }
      } catch (error) {
        result.errors.push(error.message || `Fila ${i + 2}: Error desconocido`);
      }
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (idEditar !== 0) {
        const registro = rowData.find((element) => element.id === idEditar);
        setEmpresa(registro);
      }
    };
    fetchData();
  }, [idEditar, rowData]);

  const validaciones = async () => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailEmpresa = (empresa.email ?? "").trim();
    const descripcionEmpresa = (empresa.descripcion ?? "").trim();
    const validaOrden =
      empresa.orden === undefined ||
      empresa.orden === null ||
      empresa.orden === "";
    const validaCodigo = empresa.codigo === undefined || empresa.codigo === "";
    const validaNombre = empresa.nombre === undefined || empresa.nombre === "";
    const validaDescripcionLongitud = descripcionEmpresa.length > 500;

    if (validaNombre || validaCodigo || validaOrden) {
      toast.current?.show({
        severity: "error",
        summary: "ERROR",
        detail: intl.formatMessage({
          id: "Todos los campos deben de ser rellenados",
        }),
        life: 3000,
      });
    }

    if (
      empresa.email?.length == undefined ||
      (emailEmpresa.length > 0 && !regexEmail.test(emailEmpresa))
    ) {
      toast.current?.show({
        severity: "error",
        summary: "ERROR",
        detail: intl.formatMessage({
          id: "El email debe de tener el formato correcto",
        }),
        life: 3000,
      });
    }

    if (validaDescripcionLongitud) {
      toast.current?.show({
        severity: "error",
        summary: "ERROR",
        detail: intl.formatMessage({
          id: "La descripcion no puede superar los 500 caracteres",
        }),
        life: 3000,
      });
    }

    /*if (emailEmpresa.length > 0 && regexEmail.test(emailEmpresa)) {
            try {
                const filtroUsuarios = JSON.stringify({ and: { mail: emailEmpresa } });
                const usuariosCountResponse = await getVistaUsuariosCount(filtroUsuarios);
                const usuariosCount = usuariosCountResponse?.count ?? usuariosCountResponse ?? 0;
                if (usuariosCount > 0) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'ERROR',
                        detail: intl.formatMessage({ id: 'El email de la empresa no puede coincidir con el email de un usuario' }),
                        life: 3000,
                    });
                    return false;
                }
            } catch (error) {
                console.error("Error comprobando email de empresa contra usuarios", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: intl.formatMessage({ id: 'No se ha podido validar el email contra usuarios. Inténtelo de nuevo.' }),
                    life: 3000,
                });
                return false;
            }
        }*/

    return (
      !validaNombre &&
      !validaCodigo &&
      !validaOrden &&
      !(emailEmpresa.length > 0 && !regexEmail.test(emailEmpresa)) &&
      !validaDescripcionLongitud
    );
  };

  const guardarEmpresa = async () => {
    setEstadoGuardando(true);
    setEstadoGuardandoBoton(true);
    if (await validaciones()) {
      let objGuardar = { ...empresa };
      if ((objGuardar.tiempoInactividad || "").length === 0) {
        objGuardar.tiempoInactividad = 60;
      }

      const usuarioActual = getUsuarioSesion()?.id;

      if (idEditar === 0) {
        delete objGuardar.id;
        objGuardar["usuCreacion"] = usuarioActual;
        const nuevoRegistro = await postEmpresa(objGuardar);
        if (nuevoRegistro?.id) {
          setRegistroResult("insertado");
          setIdEditar(null);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "ERROR",
            detail: intl.formatMessage({
              id: "Ha ocurrido un error creando el registro",
            }),
            life: 3000,
          });
        }
      } else {
        objGuardar["usuModificacion"] = usuarioActual;
        delete objGuardar["fechaModificacion"];
        delete objGuardar["fechaCreacion"];
        if (objGuardar.imagenBase64 === undefined) {
          delete objGuardar["imagen"];
        }
        if (objGuardar.logoBase64 === undefined) {
          delete objGuardar["logo"];
        }
        objGuardar = reemplazarNullPorVacio(objGuardar);
        await patchEmpresa(objGuardar.id, objGuardar);
        setIdEditar(null);
        setRegistroResult("editado");
      }
    }
    setEstadoGuardandoBoton(false);
  };

  const cancelarEdicion = () => {
    setIdEditar(null);
  };

  const header =
    idEditar > 0
      ? editable
        ? intl.formatMessage({ id: "Editar" })
        : intl.formatMessage({ id: "Ver" })
      : intl.formatMessage({ id: "Nueva" });

  const handleCrearSensoresDesdetipoSensor = () => {
    if (!empresa.id) {
      toast.current?.show({
        severity: "warn",
        summary: intl.formatMessage({ id: "Advertencia" }),
        detail: intl.formatMessage({ id: "Debe guardar la empresa primero" }),
        life: 3000,
      });
      return;
    }
    confirmDialog({
      message: intl.formatMessage({
        id: "¿Está seguro que desea crear los sensores desde los tipos de sensor? Esto sobrescribirá los sensores actuales de la empresa.",
      }),
      header: intl.formatMessage({ id: "Confirmación" }),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: intl.formatMessage({ id: "Sí" }),
      rejectLabel: intl.formatMessage({ id: "No" }),
      accept: async () => {
        setCargandoSensores(true);
        try {
          await crearEnvioSensorEmpresaDesdetipoSensor(
            empresa.id,
            getUsuarioSesion()?.id
          );
          toast.current?.show({
            severity: "success",
            summary: intl.formatMessage({ id: "Éxito" }),
            detail: intl.formatMessage({
              id: "Sensores creados desde tipos de sensor correctamente",
            }),
            life: 3000,
          });
          setRefreshSensores((prev) => prev + 1);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: intl.formatMessage({ id: "Error" }),
            detail: intl.formatMessage({
              id: "Error al crear los sensores desde tipos de sensor",
            }),
            life: 3000,
          });
        } finally {
          setCargandoSensores(false);
        }
      },
    });
  };

  const handleGenerarDatosFake = () => {
    if (!empresa.id) {
      toast.current?.show({
        severity: "warn",
        summary: intl.formatMessage({ id: "Advertencia" }),
        detail: intl.formatMessage({ id: "Debe guardar la empresa primero" }),
        life: 3000,
      });
      return;
    }

    confirmDialog({
      message: intl.formatMessage({
        id: "\u00BFEst\u00E1s seguro de que quieres generar datos fake?",
      }),
      header: intl.formatMessage({ id: "Confirmaci\u00F3n" }),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: intl.formatMessage({ id: "S\u00ED" }),
      rejectLabel: intl.formatMessage({ id: "No" }),
      accept: async () => {
        try {
          await generarDatosFake({
            usuarioCreacion: getUsuarioSesion()?.id,
            empresaId: empresa.id,
          });
          toast.current?.show({
            severity: "success",
            summary: "OK",
            detail: intl.formatMessage({
              id: "Datos fake generados correctamente",
            }),
            life: 3000,
          });
          setRefreshEnvios((prev) => prev + 1);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: intl.formatMessage({ id: "Error" }),
            detail: intl.formatMessage({ id: "Error al generar datos fake" }),
            life: 3000,
          });
        }
      },
    });
  };

  const handleVerRutas = () => {
    window.open("/seguimiento-rutas", "_blank");
  };

  const renderTabNoDisponible = (mensaje) => (
    <div className="text-center p-4">
      <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
      <p className="text-gray-600">{mensaje}</p>
    </div>
  );
  //
  //Si el usuario en sesión no pertenece a la empresa que se está editando, no le permito crear, editar ni eliminar envíos desde la pestaña de envíos dentro de la edición de empresa, solo podrá ver los envíos y descargar el CSV. Esto es para evitar que un usuario pueda modificar envíos de una empresa a la que no pertenece entrando a editar esa empresa (aunque no debería poder entrar a editarla, esta es una capa extra de seguridad).
  //
  let botonesEnvioDesdeEmpresa = [
    "nuevo",
    "ver",
    "editar",
    "eliminar",
    "descargarCSV",
  ];
  if (getUsuarioSesion()) {
    if (getUsuarioSesion().empresaId !== empresa.id) {
      botonesEnvioDesdeEmpresa = ["ver", "descargarCSV"];
    }
    console.log(
      "Empresa en sesión:",
      getUsuarioSesion().empresaId,
      "Empresa editada:",
      empresa.id,
      "Botones de envío:",
      botonesEnvioDesdeEmpresa
    );
  }

  return (
    <div>
      <div className="grid Empresa">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />
            <h2>
              {header} {intl.formatMessage({ id: "Empresa" }).toLowerCase()}
            </h2>
            <EditarDatosEmpresa
              empresa={empresa}
              setEmpresa={setEmpresa}
              estadoGuardando={estadoGuardando}
            />

            <div className="mt-4">
              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              >
                <TabPanel
                  header={intl.formatMessage({ id: "Usuarios de empresa" })}
                >
                  {empresa.id ? (
                    <Crud
                      headerCrud={intl.formatMessage({
                        id: "Usuarios de empresa",
                      })}
                      getRegistros={getVistaUsuarios}
                      getRegistrosCount={getVistaUsuariosCount}
                      botones={[
                        "nuevo",
                        "ver",
                        "editar",
                        "eliminar",
                        "descargarCSV",
                        "importarCSV",
                      ]}
                      controlador={"Usuarios"}
                      editarComponente={<EditarUsuario />}
                      columnas={columnasUsuariosEmpresa}
                      filtradoBase={{ empresaId: empresa.id }}
                      deleteRegistro={deleteUsuario}
                      editarComponenteParametrosExtra={{
                        empresaId: empresa.id,
                        estoyDentroDeUnTab: true,
                      }}
                      procesarImportacionCSV={procesarImportacionUsuariosEmpresaCSV}
                    />
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar usuarios",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel
                  header={intl.formatMessage({ id: "Puntos de entrega" })}
                >
                  {empresa.id ? (
                    <Crud
                      headerCrud={intl.formatMessage({
                        id: "Puntos de entrega",
                      })}
                      getRegistros={getCliente}
                      getRegistrosCount={getClienteCount}
                      botones={[
                        "nuevo",
                        "ver",
                        "editar",
                        "eliminar",
                        "descargarCSV",
                        "importarCSV",
                      ]}
                      controlador={"Clientes"}
                      editarComponente={<EditarCliente />}
                      columnas={columnasPuntosEntrega}
                      filtradoBase={{ empresaId: empresa.id }}
                      deleteRegistro={deleteCliente}
                      editarComponenteParametrosExtra={{
                        empresaId: empresa.id,
                        estoyDentroDeUnTab: true,
                      }}
                      procesarImportacionCSV={procesarImportacionPuntosEntregaCSV}
                    />
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar puntos de entrega",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel header={intl.formatMessage({ id: "Productos" })}>
                  {empresa.id ? (
                    <Crud
                      headerCrud={intl.formatMessage({ id: "Productos" })}
                      getRegistros={getProducto}
                      getRegistrosCount={getProductoCount}
                      botones={[
                        "nuevo",
                        "ver",
                        "editar",
                        "eliminar",
                        "descargarCSV",
                        "importarCSV",
                      ]}
                      controlador={"Productos"}
                      editarComponente={<EditarProducto />}
                      columnas={columnasProducto}
                      filtradoBase={{ empresaId: empresa.id }}
                      deleteRegistro={deleteProducto}
                      editarComponenteParametrosExtra={{
                        empresaId: empresa.id,
                        estoyDentroDeUnTab: true,
                      }}
                      procesarImportacionCSV={procesarImportacionProductosEmpresaCSV}
                    />
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar productos",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel header={intl.formatMessage({ id: "Envíos" })}>
                  {empresa.id ? (
                    <>
                      <div className="flex justify-content-end gap-2 mb-3">
                        <Button
                          label={intl.formatMessage({ id: "Ver rutas" })}
                          icon="pi pi-map"
                          severity="info"
                          onClick={handleVerRutas}
                        />
                        <Button
                          label={intl.formatMessage({ id: "Generar Datos Fake" })}
                          icon="pi pi-database"
                          severity="danger"
                          onClick={handleGenerarDatosFake}
                        />
                      </div>
                      <Crud
                        key={`envios-empresa-${refreshEnvios}`}
                        headerCrud={intl.formatMessage({ id: "Envíos" })}
                        getRegistros={getEnvio}
                        getRegistrosCount={getEnvioCount}
                        botones={botonesEnvioDesdeEmpresa}
                        controlador={"Envíos"}
                        editarComponente={<EditarEnvio />}
                        columnas={columnasEnvio}
                        filtradoBase={{ empresaId: empresa.id }}
                        deleteRegistro={deleteEnvio}
                        editarComponenteParametrosExtra={{
                          empresaId: empresa.id,
                          estoyDentroDeUnTab: true,
                        }}
                      />
                    </>
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar envíos",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel header={intl.formatMessage({ id: "Envío sensores" })}>
                  {empresa.id ? (
                    <>
                      <div className="flex justify-content-end mb-3">
                        <Button
                          label={
                            cargandoSensores
                              ? intl.formatMessage({
                                  id: "Creando sensores...",
                                })
                              : intl.formatMessage({
                                  id: "Crear sensores desde tipos de sensor",
                                })
                          }
                          icon={
                            cargandoSensores
                              ? "pi pi-spin pi-spinner"
                              : "pi pi-copy"
                          }
                          onClick={handleCrearSensoresDesdetipoSensor}
                          disabled={cargandoSensores}
                          className="p-button-help"
                          tooltip={intl.formatMessage({
                            id: "Crea los sensores de empresa a partir de los tipos de sensor definidos",
                          })}
                          tooltipOptions={{ position: "left" }}
                        />
                      </div>
                      <Crud
                        key={`sensores-empresa-${refreshSensores}`}
                        headerCrud={intl.formatMessage({
                          id: "Sensores de empresa",
                        })}
                        getRegistros={getEnvioSensorEmpresa}
                        getRegistrosCount={getEnvioSensorEmpresaCount}
                        botones={["nuevo", "ver", "editar", "eliminar"]}
                        controlador={"Envio Sensor Empresa"}
                        editarComponente={<EditarEnvioSensorEmpresa />}
                        columnas={columnasSensorEmpresa}
                        filtradoBase={{ empresaId: empresa.id }}
                        deleteRegistro={deleteEnvioSensorEmpresa}
                        editarComponenteParametrosExtra={{
                          empresaId: empresa.id,
                          estoyDentroDeUnTab: true,
                        }}
                      />
                    </>
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar sensores",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel
                  header={intl.formatMessage({
                    id: "Pallets asignados a empresa",
                  })}
                >
                  {empresa.id ? (
                    <PalletsAsignadosEmpresa empresaId={empresa.id} />
                  ) : (
                    renderTabNoDisponible(
                      intl.formatMessage({
                        id: "Debe guardar la empresa primero para poder gestionar pallets asignados",
                      })
                    )
                  )}
                </TabPanel>

                <TabPanel
                  header={intl.formatMessage({ id: "Tipos de carrocería" })}
                >
                  <Crud
                    headerCrud={intl.formatMessage({
                      id: "Tipos de Carrocería",
                    })}
                    getRegistros={getTipoCarroceria}
                    getRegistrosCount={getTipoCarroceriaCount}
                    botones={[
                      "nuevo",
                      "ver",
                      "editar",
                      "eliminar",
                      "descargarCSV",
                      "importarCSV",
                    ]}
                    controlador={"Tipos de Carrocería"}
                    filtradoBase={{ empresaId: empresa.id }}
                    editarComponente={<EditarTipoCarroceria />}
                    columnas={columnasCatalogosGlobales}
                    deleteRegistro={deleteTipoCarroceria}
                    editarComponenteParametrosExtra={{
                      empresaId: empresa.id,
                      estoyDentroDeUnTab: true,
                    }}
                    procesarImportacionCSV={procesarImportacionTipoCarroceriaEmpresaCSV}
                  />
                </TabPanel>

                <TabPanel
                  header={intl.formatMessage({ id: "Tipo de transporte" })}
                >
                  <Crud
                    headerCrud={intl.formatMessage({
                      id: "Tipos de Transporte",
                    })}
                    getRegistros={getTipoTransporte}
                    getRegistrosCount={getTipoTransporteCount}
                    botones={[
                      "nuevo",
                      "ver",
                      "editar",
                      "eliminar",
                      "descargarCSV",
                      "importarCSV",
                    ]}
                    controlador={"Tipo Transporte"}
                    filtradoBase={{ empresaId: empresa.id }}
                    editarComponente={<EditarTipoTransporte />}
                    columnas={columnasCatalogosGlobales}
                    deleteRegistro={deleteTipoTransporte}
                    editarComponenteParametrosExtra={{
                      empresaId: empresa.id,
                      estoyDentroDeUnTab: true,
                    }}
                    procesarImportacionCSV={procesarImportacionTipoTransporteEmpresaCSV}
                  />
                </TabPanel>

                <TabPanel
                  header={intl.formatMessage({
                    id: "Configuración de eventos",
                  })}
                >
                  <Crud
                    headerCrud={intl.formatMessage({
                      id: "Configuración de eventos (solo lectura)",
                    })}
                    getRegistros={getEventoConfiguracion}
                    getRegistrosCount={getEventoConfiguracionCount}
                    botones={[]}
                    controlador={"Eventos Configuracion"}
                    editarComponente={<div />}
                    columnas={columnasEventoConfiguracion}
                    deleteRegistro={() => {}}
                    editarComponenteParametrosExtra={{
                      estoyDentroDeUnTab: true,
                    }}
                  />
                </TabPanel>
              </TabView>
            </div>

            <div className="flex justify-content-end mt-2">
              {editable && (
                <Button
                  label={
                    estadoGuardandoBoton
                      ? `${intl.formatMessage({ id: "Guardando" })}...`
                      : intl.formatMessage({ id: "Guardar" })
                  }
                  icon={estadoGuardandoBoton ? "pi pi-spin pi-spinner" : null}
                  onClick={guardarEmpresa}
                  className="mr-2"
                  disabled={estadoGuardandoBoton}
                />
              )}
              <Button
                label={intl.formatMessage({ id: "Cancelar" })}
                onClick={cancelarEdicion}
                className="p-button-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEmpresa;
