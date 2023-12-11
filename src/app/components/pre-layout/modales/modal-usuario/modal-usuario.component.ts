import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario:FormGroup;
  ocultarPassword:boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private usuarioServicio: UsuariosService,
    private utilidadService: UtilidadService
  ) {

    this.formularioUsuario = this.fb.group({
      email : ['',[Validators.required, Validators.email]],
      idRol : ['',Validators.required],
      usuario : ['',Validators.required],
      contrasena : ['',Validators.required],
    });

    if(this.datosUsuario != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {

    if(this.datosUsuario != null){

      this.formularioUsuario.patchValue({
        email : this.datosUsuario.email,
        idRol :  this.datosUsuario.idRol,
        usuario : this.datosUsuario.usuario,
        contrasena : this.datosUsuario.contrasena
      })

    }
  }

  // Agrega o modifica usuario en base al autocompletado del formulario
  GuardarEditarusuario(){

    const usuario: Usuario = {
      id : this.datosUsuario == null ? '' : this.datosUsuario.id,
      email : this.formularioUsuario.value.email,
      idRol : this.formularioUsuario.value.idRol,
      usuario : this.formularioUsuario.value.usuario,
      contrasena : this.formularioUsuario.value.contrasena,
    }

    if(this.datosUsuario == null) {

      this.usuarioServicio.addUsuario(usuario).subscribe({
        next: (data) => {
            this.utilidadService.mostrarAlerta("El usuario fue registrado","Exito");
            this.modalActual.close("true")
        },
        error: (errorResponse) => {
          if (errorResponse.status === 400) {
            const errorMessage = errorResponse.error; 
            this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
          } else {
          this.utilidadService.mostrarAlerta("No se pudo registrar el usuario","Error")
          }
        }
      })

    }else{

      this.usuarioServicio.updateUsuario(usuario.id,usuario).subscribe({
        next: (data) => {          
            this.utilidadService.mostrarAlerta("El usuario fue editado","Exito");
            this.modalActual.close("true")        
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo editar el usuario","Error")
        }
      })

    }

  }




}
