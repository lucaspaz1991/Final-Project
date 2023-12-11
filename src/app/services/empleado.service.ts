import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";
import { Empleado } from '../interfaces/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http:HttpClient
    ) { }

    GetAllEmpleados(idDeposito: string): Observable<Empleado[]>{
      const url = `${this.baseUrl}/api/Empleados?idDeposito=${idDeposito}`;
      return this.http.get<Empleado[]>(url); 
    }
  
    AddEmpleado(AddEmpleadoRequest: Empleado): Observable<Empleado>{
      AddEmpleadoRequest.id = '00000000-0000-0000-0000-000000000000';   
      return this.http.post<Empleado>(this.baseUrl + '/api/Empleados', AddEmpleadoRequest)
    }
  
    GetEmpleado(id: string): Observable<Empleado> {
      return this.http.get<Empleado>(this.baseUrl + '/api/Empleados/' + id);
    }
  
    UpdateEmpleado(id: string, UpdateEmpleadoRequest: Empleado): Observable<Empleado> {
      return this.http.put<Empleado>(this.baseUrl + '/api/Empleados/' + id, UpdateEmpleadoRequest);
    }
  
    DeleteEmpleado(id: string): Observable<Empleado> {
      return this.http.delete<Empleado>(this.baseUrl + '/api/Empleados/' + id);
    }


}
