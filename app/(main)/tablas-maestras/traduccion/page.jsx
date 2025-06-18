"use client";
import { getVistaTraduccionIdioma, getVistaTraduccionIdiomaCount, deleteTraduccion } from "@/app/api-endpoints/traduccion";
import { getIdiomas } from "@/app/api-endpoints/idioma";
import EditarTraduccion from "./editar";
import Crud from "../../../components/shared/crud";
import { useIntl } from 'react-intl'
import { useEffect, useState } from 'react';

const Traduccion = () => {
    const intl = useIntl();
    const [columnas, setColumnas] = useState([{ campo: 'clave', header: intl.formatMessage({ id: 'Clave' }), tipo: 'string' }]);

    useEffect(() => {
        const cargarColumnas = async () => {
            try {
                // Obtener los idiomas de la base de datos
                const idiomas = await getIdiomas();
                const idiomasOrdenados = idiomas.sort((a, b) => a.nombre.localeCompare(b.nombre));
                // Añadir una columna por cada idioma
                const columnasIdiomas = idiomasOrdenados.map(idioma => ({
                    campo: idioma.nombre.toLowerCase(),
                    header: idioma.nombre,
                    tipo: 'string'
                }));

                // Combinar las columnas base con las de idiomas
                setColumnas([...columnas, ...columnasIdiomas]);
            } catch (error) {
                console.error('Error al cargar los idiomas:', error);
            }
        };

        cargarColumnas();
    }, [intl]);

    return (
        <div>
            <Crud
                headerCrud={intl.formatMessage({ id: 'Traducciones' })}
                getRegistros={getVistaTraduccionIdioma}
                getRegistrosCount={getVistaTraduccionIdiomaCount}
                botones={['nuevo','ver', 'editar', 'eliminar', 'descargarCSV']}
                controlador={"Traducciones"}
                //parametrosEliminar={['id', 'inglesId']}
                editarComponente={<EditarTraduccion />}
                columnas={columnas}
                deleteRegistro={deleteTraduccion}
            />
        </div>
    );
};

export default Traduccion;