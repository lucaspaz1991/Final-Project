import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";

import { Seccion } from '../interfaces/seccion';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http:HttpClient
    ) { }

    GetAllSecciones(idDeposito: string): Observable<Seccion[]>{
      const url = `${this.baseUrl}/api/Secciones?idDeposito=${idDeposito}`;
      return this.http.get<Seccion[]>(url); 
    }
  
    AddSeccion(AddSeccionRequest: Seccion): Observable<Seccion>{
      AddSeccionRequest.id = '00000000-0000-0000-0000-000000000000';
      AddSeccionRequest.capacidadActual = 0;
      AddSeccionRequest.ocupacionActual = 0;
      AddSeccionRequest.fechaCreacion = '';
      return this.http.post<Seccion>(this.baseUrl + '/api/Secciones', AddSeccionRequest)
    }
  
    GetSeccion(id: string): Observable<Seccion> {
      return this.http.get<Seccion>(this.baseUrl + '/api/Secciones/' + id);
    }
  
    UpdateSeccion(id: string, UpdateSeccionRequest: Seccion): Observable<Seccion> {
      return this.http.put<Seccion>(this.baseUrl + '/api/Secciones/' + id, UpdateSeccionRequest);
    }
  
    DeleteSeccion(id: string): Observable<Seccion> {
      return this.http.delete<Seccion>(this.baseUrl + '/api/Secciones/' + id);
    }


}
