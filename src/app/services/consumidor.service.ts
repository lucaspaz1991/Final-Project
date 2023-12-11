import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consumidor } from '../interfaces/consumidor';

@Injectable({
  providedIn: 'root'
})
export class ConsumidorService {

  private baseUrl = 'http://localhost:7186';

  constructor(
    private http: HttpClient, 
    ) { }

  GetAllConsumidores(idDeposito: string): Observable<Consumidor[]>{
    const url = `${this.baseUrl}/api/Consumidores?idDeposito=${idDeposito}`;
    return this.http.get<Consumidor[]>(url); 
  }

  AddConsumidor(AddConsumidorRequest: Consumidor): Observable<Consumidor>{
    AddConsumidorRequest.id = '00000000-0000-0000-0000-000000000000';   
    return this.http.post<Consumidor>(this.baseUrl + '/api/Consumidores', AddConsumidorRequest)
  }

  GetConsumidor(id: string): Observable<Consumidor> {
    return this.http.get<Consumidor>(this.baseUrl + '/api/Consumidores/' + id);
  }

  UpdateConsumidor(id: string, UpdateConsumidorRequest: Consumidor): Observable<Consumidor> {
    return this.http.put<Consumidor>(this.baseUrl + '/api/Consumidores/' + id, UpdateConsumidorRequest);
  }

  DeleteConsumidor(id: string): Observable<Consumidor> {
    return this.http.delete<Consumidor>(this.baseUrl + '/api/Consumidores/' + id);
  }

}
