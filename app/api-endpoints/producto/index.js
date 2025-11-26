import { ProductoControllerApi, settings } from "@/app/api-neatpallet";
import { getUsuarioSesion } from "@/app/utility/Utils";

const apiProducto = new ProductoControllerApi(settings);

export const getProducto = async (filtro) => {
    const { data: dataProductos } = await apiProducto.productoControllerFind(filtro);
    return dataProductos;
}

export const getProductoCount = async (filtro) => {
    const { data: dataCount } = await apiProducto.productoControllerCount(filtro);
    return dataCount;
}

export const postProducto = async (objProducto) => {
    const { data: dataProducto } = await apiProducto.productoControllerCreate(objProducto);
    return dataProducto;
}

export const patchProducto = async (idProducto, objProducto) => {
    const { data: dataProducto } = await apiProducto.productoControllerUpdateById(idProducto, objProducto);   
    return dataProducto;
}

export const deleteProducto = async (idProducto) => {
    const { data: dataProducto } = await apiProducto.productoControllerDeleteById(idProducto);
    return dataProducto;
}

export const getProductoById = async (idProducto) => {
    const { data: dataProducto } = await apiProducto.productoControllerFindById(idProducto);
    return dataProducto;
}