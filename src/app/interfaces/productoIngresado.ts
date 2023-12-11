export interface ProductoIngresado {
    id?:string,
    idProducto:string,
    nombreProducto:string,
    cantidad:number
    almacenado: boolean,
    ordenEntranteId?: string
}