import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";

import { Proveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http:HttpClient
    ) { }

    GetAllProveedores(idDeposito: string): Observable<Proveedor[]>{
      const url = `${this.baseUrl}/api/Proveedores?idDeposito=${idDeposito}`;
      return this.http.get<Proveedor[]>(url); 
    }
  
    AddProveedor(AddProveedorRequest: Proveedor): Observable<Proveedor>{
      AddProveedorRequest.id = '00000000-0000-0000-0000-000000000000';   
      return this.http.post<Proveedor>(this.baseUrl + '/api/Proveedores', AddProveedorRequest)
    }
  
    GetProveedor(id: string): Observable<Proveedor> {
      return this.http.get<Proveedor>(this.baseUrl + '/api/Proveedores/' + id);
    }
  
    UpdateProveedor(id: string, UpdateProveedorRequest: Proveedor): Observable<Proveedor> {
      return this.http.put<Proveedor>(this.baseUrl + '/api/Proveedores/' + id, UpdateProveedorRequest);
    }
  
    DeleteProveedor(id: string): Observable<Proveedor> {
      return this.http.delete<Proveedor>(this.baseUrl + '/api/Proveedores/' + id);
    }
}
