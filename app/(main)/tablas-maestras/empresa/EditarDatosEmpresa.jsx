import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from "primereact/password";
import ArchivoMultipleInput from "../../../components/shared/archivo_multiple_input";
import ArchivoInput from "../../../components/shared/archivo_input";
import { useIntl } from 'react-intl'

const EditarDatosEmpresa = ({ empresa, setEmpresa, estadoGuardando, listaTipoArchivos }) => {
    const intl = useIntl()

    //Crear inputs de archivos
    const inputsDinamicos = [];
    for (const tipoArchivo of listaTipoArchivos) {
        //Depende del tipo del input se genera multiple o no
        if (tipoArchivo.multiple === 'S') {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12">
                    <label>{tipoArchivo.nombre}</label>
                    <ArchivoMultipleInput
                        registro={empresa}
                        setRegistro={setEmpresa}
                        archivoTipo={tipoArchivo.tipo}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
        else {
            inputsDinamicos.push(
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <ArchivoInput
                        registro={empresa}
                        setRegistro={setEmpresa}
                        archivoTipo={tipoArchivo.tipo}
                        archivoHeader={tipoArchivo.nombre}
                        campoNombre={(tipoArchivo.nombre).toLowerCase()}
                    />
                </div>
            );
        }
    }

    return (
        <Fieldset legend={intl.formatMessage({ id: 'Datos para la empresa' })}>
            <div className="formgrid grid">
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaCodigo">{intl.formatMessage({ id: 'Codigo' })}</label>
                    <InputText value={empresa.codigo}
                        placeholder={intl.formatMessage({ id: 'Codigo de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, codigo: e.target.value })}
                        className={`${(estadoGuardando && empresa.codigo === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="empresaNombre">{intl.formatMessage({ id: 'Nombre' })}</label>
                    <InputText value={empresa.nombre}
                        placeholder={intl.formatMessage({ id: 'Nombre de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                        className={`${(estadoGuardando && empresa.nombre === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Descripcion' })}</label>
                    <InputText value={empresa.descripcion}
                        placeholder={intl.formatMessage({ id: 'Descripcion de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, descripcion: e.target.value })}
                        className={`${(estadoGuardando && empresa.descripcion === "") ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Email' })}</label>
                    <InputText value={empresa.email}
                        placeholder={intl.formatMessage({ id: 'Email de la empresa' })}
                        onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                        className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="descripcion">{intl.formatMessage({ id: 'Contraseña del email' })}</label>
                    <Password
                        value={empresa.password}
                        id="password"
                        className={`${(estadoGuardando && (empresa.email === "" || empresa.email === undefined)) ? "p-invalid" : ""}`}
                        type="text"
                        onChange={(e) => setEmpresa({ ...empresa, password: e.target.value })}
                        placeholder={intl.formatMessage({ id: 'Contraseña del email' })}
                        toggleMask
                        inputClassName="w-full"
                        feedback={false}
                    />
                </div>
                <div className="flex flex-column field gap-2 mt-2 col-12 lg:col-4">
                    <label htmlFor="email">{intl.formatMessage({ id: 'Servicio de email' })}</label>
                    <InputText value={empresa.servicio}
                        placeholder={intl.formatMessage({ id: 'Servicio de email' })}
                        onChange={(e) => setEmpresa({ ...empresa, servicio: e.target.value })}
                        className={`${(estadoGuardando && (empresa.servicio === "" || empresa.servicio === undefined)) ? "p-invalid" : ""}`}
                        rows={5} cols={30} />
                </div>
                {
                    ...inputsDinamicos //Muestra las inputs generados
                }
            </div>

        </Fieldset>
    );
};

export default EditarDatosEmpresa;