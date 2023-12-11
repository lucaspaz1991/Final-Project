export interface Seccion {
    id: string,
    codigo: string,
    tipoSeccion: string,    
    capacidadMaxima: number,
    ocupacionActual: number,
    capacidadActual: number,
    fechaCreacion: string,
    idDeposito: string,
    width?: string,
    height?: string
}