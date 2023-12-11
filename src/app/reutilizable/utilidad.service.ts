import { Injectable } from '@angular/core';

import { MatSnackBar} from '@angular/material/snack-bar';
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(
    private snackBar:MatSnackBar
    ) { }

  mostrarAlerta(mensaje:string, tipo:string){
    this.snackBar.open(mensaje,tipo, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    })
  }

  GuardarSesionUsuario(usuarioSesion:Sesion){
    localStorage.setItem("usuario",JSON.stringify(usuarioSesion));
  }

  ObtenerSesionUsuario(){

    const DataCadena = localStorage.getItem("usuario");

    const Usuario = JSON.parse(DataCadena!)

    return Usuario;
  }

  EliminarSesionUsuario(){

    localStorage.removeItem("usuario");

  }


}
