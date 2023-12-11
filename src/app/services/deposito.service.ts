import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";

import { Deposito } from '../interfaces/deposito';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http:HttpClient
    ) { }

    GetAllDepositos(): Observable<Deposito[]>{
    
      return this.http.get<Deposito[]>(this.baseUrl + '/api/Depositos');
      
    }
  
    AddDeposito(AddDepositoRequest: Deposito): Observable<Deposito>{
      AddDepositoRequest.id = '00000000-0000-0000-0000-000000000000';
      AddDepositoRequest.capacidadActual = 0;
      AddDepositoRequest.ocupacionActual = 0;
      AddDepositoRequest.fechaCreacion = '';
      return this.http.post<Deposito>(this.baseUrl + '/api/Depositos', AddDepositoRequest)
    }
  
    GetDeposito(id: string): Observable<Deposito> {
      return this.http.get<Deposito>(this.baseUrl + '/api/Depositos/' + id);
    }
  
    UpdateDeposito(id: string, UpdateDepositoRequest: Deposito): Observable<Deposito> {
      return this.http.put<Deposito>(this.baseUrl + '/api/Depositos/' + id, UpdateDepositoRequest);
    }
  
    DeleteDeposito(id: string): Observable<Deposito> {
      return this.http.delete<Deposito>(this.baseUrl + '/api/Depositos/' + id);
    }
    
   

}
