import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario = {
    id: '',
    usuario: '',
    contrasena: '',
    idRol: '',
    email: ''
  };

  currentPassword: string = '';
  newPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;


  constructor(
    private usuariosService: UsuariosService,
    private utilidadService: UtilidadService
    ) { }

  ngOnInit(): void {

    const storedUsuarioJSON = localStorage.getItem('usuario');



    if (storedUsuarioJSON !== null) {
      // Convertir el JSON a un objeto JavaScript
      const storedUsuario = JSON.parse(storedUsuarioJSON);
      // Acceder a un componente específico (por ejemplo, el nombre del usuario)
      this.usuario.usuario = storedUsuario.usuario; 
      this.usuario.email = storedUsuario.email;
      this.usuario.idRol = storedUsuario.idRol;
      this.usuario.id = storedUsuario.id;
    
    } else {
      // Manejo de caso en el que'usuario' no se encuentra en el almacenamiento local
      console.error('"usuario" no se encuentra en el almacenamiento local.');
    }
 
  }


  actualizarContrasena() {

    if(sessionStorage.getItem('pass') != this.currentPassword){
      this.utilidadService.mostrarAlerta("La contraseña actual ingresada no es correcta","Error");
    } else {

    this.usuariosService.updateContrasena(this.usuario.id, this.newPassword).subscribe(
      (response: any) => {
        sessionStorage.setItem('pass', this.newPassword);
        this.showSuccess('Contraseña actualizada correctamente.');
        this.currentPassword = '';
        this.newPassword = '';
      

      },
      (error: any) => {
        this.showError('Error al actualizar la contraseña.');
      }
    );
  }
  }

  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      confirmButtonColor: '#505050'
    });
  }

  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#505050'
    });
  }
  
}