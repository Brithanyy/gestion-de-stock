import { Bebida } from "./Bebida";

export interface Proveedor {
    id?: string;
    nombre:string,
    telefono: string,
    bebidas?: string[],
    descripcion: string;
};