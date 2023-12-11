import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenEntrante } from '../interfaces/orden';
import { ProductoIngresado } from '../interfaces/productoIngresado';
import { SeccionProductos } from '../interfaces/seccion-productos';


@Injectable({
  providedIn: 'root'
})
export class OrdenEntranteService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http: HttpClient, 
    ) { }


    CrearOrden(orden: any): Observable<OrdenEntrante> {
      return this.http.post<OrdenEntrante>(this.baseUrl + '/api/OrdenEntrante/RegistrarOrden', orden);
    }

    ObtenerOrdenes(idDeposito: string): Observable<OrdenEntrante[]>{
      const url = `${this.baseUrl}/api/OrdenEntrante/listaOrdenes?idDeposito=${idDeposito}`;
      return this.http.get<OrdenEntrante[]>(url);
    }

    ObtenerProductosIngresados(idDeposito: string): Observable<ProductoIngresado[]>{
      const url = `${this.baseUrl}/api/OrdenEntrante/noAlmacenados?idDeposito=${idDeposito}`;
      return this.http.get<ProductoIngresado[]>(url);
    }

    AlmacenarProductos(request: any): Observable<SeccionProductos> {
      return this.http.post<SeccionProductos>(this.baseUrl + '/api/OrdenEntrante/almacenarEnSeccion', request);
    }

    ObtenerProductosAlmacenados(idDeposito: string): Observable<SeccionProductos[]>{
      const url = `${this.baseUrl}/api/OrdenEntrante/Almacenados?idDeposito=${idDeposito}`;
      return this.http.get<SeccionProductos[]>(url);
    }

}