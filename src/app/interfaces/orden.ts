import { ProductoIngresado } from "./productoIngresado";

export interface OrdenEntrante {
    id?: string,
    numeroDocumento?:string,
    fechaRecepcion?: string,
    idProveedor: string,
    idEmpleado: string,
    idDeposito: string,
    productoIngresado: ProductoIngresado[]
    
}

