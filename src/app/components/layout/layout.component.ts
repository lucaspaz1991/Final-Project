import { Component, OnInit } from '@angular/core';
import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';
import { Router } from '@angular/router';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Observer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  depositoIdNavegacion: any = '';

  accessDepositoRequest: Deposito = {
    
    id: '',
    codigo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    capacidadMaxima:0,
    ocupacionActual: 0,
    capacidadActual: 0,
    fechaCreacion: '' 
  };

  usuario:string='';
  idRol:string='';

  depositos: Deposito[]=[];

  constructor(
    private router: Router,
    private depositosService: DepositoService,
    private utilidadService: UtilidadService,

  ){

  }

ngOnInit(): void {
 
  this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion'); 
  this.CargarDepositoNavegacion();

  const usuario = this.utilidadService.ObtenerSesionUsuario();

    if(usuario != null){

      this.usuario = usuario.usuario;
      this.idRol = usuario.idRol;

    }

    this.CargarDepositos();

}

CargarDepositoNavegacion(): void {
  this.depositosService.GetDeposito(this.depositoIdNavegacion).subscribe({
    next: (deposito) => {
       this.accessDepositoRequest = deposito;
    },
    error: (response) => {
    }
  });
}

SalirDeposito(){
  this.router.navigate(['pre-pages', 'home']);
}

// Carga los depositos para la lista de cambio de deposito
CargarDepositos(): void {

    const observer: Observer<Deposito[]> = {
      next: (depositos) => {
        this.depositos = depositos;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };
  
    this.depositosService.GetAllDepositos().subscribe(observer);
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

// Desplegable para moverte entre depositos
DepositoSeleccionado(event: any) {

  const valorSeleccionado = event.target.value;
  
  localStorage.setItem('depositoIdNavegacion', valorSeleccionado);

  this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  this.router.onSameUrlNavigation = 'reload';
  
  this.router.navigate(['pages', valorSeleccionado, 'deposito']);
}


}