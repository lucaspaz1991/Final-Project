export interface Producto {
    id:string,
    nombre:string,
    descripcion:string,
    categoria:string,
    cantidadEnStock:number,
    dimensiones: number,
    precio:number,
    fechaCreacion: string,
    fechaValidez: string,
    fechaValidezDate?: Date,
    idDeposito: string,
    idProveedor: string
}
