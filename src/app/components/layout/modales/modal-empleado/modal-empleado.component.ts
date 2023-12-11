import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service'

@Component({
  selector: 'app-modal-empleado',
  templateUrl: './modal-empleado.component.html',
  styleUrls: ['./modal-empleado.component.css']
})
export class ModalEmpleadoComponent implements OnInit{

  formularioEmpleado:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  constructor(
    private modalActual: MatDialogRef<ModalEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosEmpleado: Empleado,
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private utilidadService: UtilidadService
  ){

    this.formularioEmpleado = this.fb.group({
      nombre : ['',Validators.required],
      apellido : ['',Validators.required],
      telefono : ['',Validators.required],
      
    });

    if(this.datosEmpleado != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {
      
    if(this.datosEmpleado != null){

      this.formularioEmpleado.patchValue({
        nombre : this.datosEmpleado.nombre,
        apellido : this.datosEmpleado.apellido,
        telefono :  this.datosEmpleado.telefono,

      })
    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    console.log('Deposito logueado:', this.depositoIdNavegacion);
  }

  // Agrega o modifica empleado en base al autocompletado del formulario 
  GuardarEditar_Empleado(){

    const empleado: Empleado = {
      id : this.datosEmpleado == null ? '' : this.datosEmpleado.id,
      nombre : this.formularioEmpleado.value.nombre,
      apellido : this.formularioEmpleado.value.apellido,
      telefono : this.formularioEmpleado.value.telefono,
      idDeposito: this.depositoIdNavegacion
    }

    if(this.datosEmpleado == null) {

      this.empleadoService.AddEmpleado(empleado).subscribe({
        next: (data) => {
            this.utilidadService.mostrarAlerta("El empleado fue registrado","Exito");
            this.modalActual.close("true")
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo registrar el empleado","Error")

        }
      })

    }else{

      this.empleadoService.UpdateEmpleado(empleado.id, empleado).subscribe({
        next: (data) => {          
            this.utilidadService.mostrarAlerta("El empleado fue editado","Exito");
            this.modalActual.close("true")        
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo editar el empleado","Error")
        }
      })

    }

  }

}
