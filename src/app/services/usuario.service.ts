import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
//import { v4 as uuidv4 } from 'uuid'; 

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = 'http://localhost:7186/api'; 

  constructor(private http: HttpClient) { }

  
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/Usuarios`);
  }

  getMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuarios/mi-perfil`);
  }

 
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuarios/${id}`);
  }

 
  addUsuario(usuario: Usuario): Observable<Usuario> {
 
    //usuario.id = uuidv4();
    usuario.id = '00000000-0000-0000-0000-000000000000';

    return this.http.post<Usuario>(`${this.baseUrl}/Usuarios`, usuario);
  }
  
  updateUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/Usuarios/${id}`, usuario);
  }

  login(usuario: string, contrasena: string): Observable<any> {
    const loginData = { usuario: usuario, contrasena: contrasena };
    return this.http.post<any>(`${this.baseUrl}/Usuarios/login`, loginData);
  }

  updateContrasena(id: string, contrasena: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Usuarios/${id}/contrasena`, { NewPassword: contrasena });
  }

  deleteUsuario(id: string): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.baseUrl}/Usuarios/${id}`);
  }

  recuperarContrasena(email: string): Observable<any> {
    const usuario = { email: email };
    return this.http.post<any>(`${this.baseUrl}/Usuarios/recuperar-contrasena`, usuario);
  }
}