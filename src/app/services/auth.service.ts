import { Injectable } from '@angular/core';
import { Sesion } from '../interfaces/sesion';
import { UsuariosService } from './usuario.service';
import { UtilidadService } from '../reutilizable/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private utilidadService: UtilidadService
    ) {}

  Login(usuario: string, contrasena: string): boolean {

    this.usuarioService.login(usuario,contrasena).subscribe((result) => {
      if (result) {
        this.utilidadService.GuardarSesionUsuario(result);
        return true;
      }else{
        return false;
      }
    });

    return false;
  }

  GetUsuarioSesion(): Sesion {
    return this.utilidadService.ObtenerSesionUsuario();
  }

  Logout() {
    this.utilidadService.EliminarSesionUsuario();
  }

  // Verificar si el usuario está autenticado utilizando el servicio
  EstaAutenticado(): boolean {
    return !!this.utilidadService.ObtenerSesionUsuario();
  }

  //Verificar si el usuario es admin
  EsAdmin(): boolean {
    const UsuarioAlmacenadoJSON = localStorage.getItem('usuario');
    
    if (UsuarioAlmacenadoJSON !== null) {
      const UsuarioAlmacenado = JSON.parse(UsuarioAlmacenadoJSON);
      const Rol = UsuarioAlmacenado.idRol;
      if (Rol === 'Admin'){
        return true;
      }
    }
    
    return false;
    
  }
}
