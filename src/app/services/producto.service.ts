import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";

import { Producto} from "../interfaces/producto";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http:HttpClient
    ) { }

    GetAllProductos(idDeposito: string): Observable<Producto[]>{
      const url = `${this.baseUrl}/api/Productos?idDeposito=${idDeposito}`;
      return this.http.get<Producto[]>(url); 
    }
  
    GetProductosProveedor(idDeposito: string, idProveedor: string): Observable<Producto[]>{
      const url = `${this.baseUrl}/api/Productos/productosProveedor?idDeposito=${idDeposito}&idProveedor=${idProveedor}`;
      return this.http.get<Producto[]>(url); 
    }
  
    AddProducto(AddProductoRequest: Producto): Observable<Producto>{
      AddProductoRequest.id = '00000000-0000-0000-0000-000000000000';
      AddProductoRequest.cantidadEnStock = 0;
      AddProductoRequest.fechaCreacion = '';
      return this.http.post<Producto>(this.baseUrl + '/api/Productos', AddProductoRequest)
    }
  
    GetProducto(id: string): Observable<Producto> {
      return this.http.get<Producto>(this.baseUrl + '/api/Productos/' + id);
    }
  
    UpdateProducto(id: string, UpdateProductoRequest: Producto): Observable<Producto> {
      return this.http.put<Producto>(this.baseUrl + '/api/Productos/' + id, UpdateProductoRequest);
    }
  
    DeleteProducto(id: string): Observable<Producto> {
      return this.http.delete<Producto>(this.baseUrl + '/api/Productos/' + id);
    }

}

