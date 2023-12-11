import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pre-layout',
  templateUrl: './pre-layout.component.html',
  styleUrls: ['./pre-layout.component.css']
})
export class PreLayoutComponent implements OnInit{

  usuario:string='';
  idRol:string='';

  constructor(
    private dataService: DataService,
    private router: Router,
    private utilidadService: UtilidadService

  ) {}

  isUsuarioView = false;
  
  ngOnInit(): void {
    
    this.dataService.SetearIdDepositoNavegacion('');   
    const usuario = this.utilidadService.ObtenerSesionUsuario();

    if(usuario != null){

      this.usuario = usuario.usuario;
      this.idRol = usuario.idRol;

    }

    if(sessionStorage.getItem('idRol')?.toString() != "" && sessionStorage.getItem('idRol')?.toString() == "Admin" ){
      this.DefinirVistaUsuario(true);
    }else{
      this.DefinirVistaUsuario(false);
    }
    
  }
  
  // Defino si el usuario puede acceder a la vista de gestión de usuarios
  DefinirVistaUsuario(value:boolean){
    setTimeout(() => {
      this.isUsuarioView  = value;
    });
}

CerrarSesion(){

  Swal.fire({
      title: '¿Desea cerrar la sesión?',
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, cerrar",
      showCancelButton: true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado => {

        if(resultado.isConfirmed){

          this.utilidadService.EliminarSesionUsuario();
          this.router.navigate(["login"]);
        }
    }))

}

// Devuelve al usuario al home de la aplicacion
SalirDeposito(){
  this.router.navigate(['pre-pages', 'home']);
}
}

