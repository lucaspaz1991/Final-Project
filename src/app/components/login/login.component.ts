import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/interfaces/usuario';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  usuario: string = "";
  contrasena: string = "";
  showPassword = false; 

  usuarios: Usuario[]=[];

  aux: number = 0;

  constructor(
    private usuariosService: UsuariosService, 
    private router: Router,
    private utilidadService: UtilidadService
    ) {}

    ngOnInit(): void {
      
      this.crearAdmin();

    }

    crearAdmin(){

      const observer: Observer<Usuario[]> = {
        next: (usuarios) => {
          this.usuarios = usuarios;
        },
        error: (error) => {
          console.error('Error al obtener los usuarios:', error);
        },
        complete: () => {
        }
      };

      this.usuariosService.getAllUsuarios().subscribe(observer);

      this.usuarios.forEach(element => {
        this.aux++;

        
      });

      if( this.aux = 0 ){

        const _usuario: Usuario = {
          id : '',
          email : 'admin@ejemplo.com',
          idRol : 'Admin',
          usuario : 'admin',
          contrasena : 'admin',
        }
    
          this.usuariosService.addUsuario(_usuario).subscribe({
            next: (data) => {
                
            },
            error: (errorResponse) => {
            }
          })

      }

      this.aux=0;
    }


  login() {
    this.usuariosService.login(this.usuario, this.contrasena).subscribe(
      (response) => {
        
        this.utilidadService.GuardarSesionUsuario(response);

        sessionStorage.setItem('usuario', response.usuario);
        sessionStorage.setItem('idRol', response.idRol);
        sessionStorage.setItem('pass', this.contrasena);

        this.router.navigate(['pre-pages', 'home']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Usuario o contraseña incorrectos',
        });
      }
    );
  }

  recuperarContrasena() {
    console.log('Recuperar contraseña 122');
    this.router.navigate(['recuperar-contrasena']);

  }

  
  DesocultarContrasena() {
    this.showPassword = !this.showPassword;
  }
}

