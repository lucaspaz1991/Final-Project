import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  email: string = "";

  constructor(
    private http: HttpClient, 
    private router: Router
    ) {}

  // Permite recuperar la contraseña recibiendo una nueva al email ingresado por el usuario
  RecuperarContrasena() {

    const Usuario = { email: this.email }; 

    this.http.post<any>('http://localhost:7186/api/Usuarios/recuperar-contrasena', Usuario).subscribe(

      (response) => {
       
        Swal.fire({
          icon: 'success',
          title: '¡Contraseña enviada!',
          text: 'Se ha enviado una nueva contraseña al correo electrónico.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      },
      (error) => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error en la recuperación de contraseña',
          text: 'No se encontró ningún usuario con ese correo electrónico.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6'
        });
      }
    );
  }
}