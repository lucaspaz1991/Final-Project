export interface SeccionProductos {
    id?: string,
    idSeccion: string,
    idProducto: string,
    nombreProducto: string,
    cantidad: number,
    productoIngresadoId: string
    dimensiones?: number,
    idDeposito?: string,
    codigo?: string
}