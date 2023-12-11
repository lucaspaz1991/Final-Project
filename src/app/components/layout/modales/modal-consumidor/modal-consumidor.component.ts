import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Consumidor } from 'src/app/interfaces/consumidor';
import { ConsumidorService } from 'src/app/services/consumidor.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service'

@Component({
  selector: 'app-modal-consumidor',
  templateUrl: './modal-consumidor.component.html',
  styleUrls: ['./modal-consumidor.component.css']
})
export class ModalConsumidorComponent implements OnInit{

  formularioConsumidor:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  constructor(
    private modalActual: MatDialogRef<ModalConsumidorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosConsumidor: Consumidor,
    private fb: FormBuilder,
    private consumidorService: ConsumidorService,
    private utilidadService: UtilidadService
  ){

    this.formularioConsumidor = this.fb.group({
      nombre : ['',Validators.required],
      direccion : ['',Validators.required],
      correo : ['', [Validators.required, Validators.email]]
      
    });

    if(this.datosConsumidor != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {
      
    if(this.datosConsumidor != null){

      this.formularioConsumidor.patchValue({
        nombre : this.datosConsumidor.nombre,
        direccion : this.datosConsumidor.direccion,
        correo : this.datosConsumidor.correo,

      })
    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    console.log('Deposito logueado:', this.depositoIdNavegacion);
  }

  // Agrega o modifica consumidor en base al autocompletado del formulario 
  GuardarEditarconsumidor(){

    const consumidor: Consumidor = {
      id : this.datosConsumidor == null ? '' : this.datosConsumidor.id,
      nombre : this.formularioConsumidor.value.nombre,
      direccion : this.formularioConsumidor.value.direccion,
      correo : this.formularioConsumidor.value.correo,
      idDeposito: this.depositoIdNavegacion
    }

    if(this.datosConsumidor == null) {

      this.consumidorService.AddConsumidor(consumidor).subscribe({
        next: (data) => {
            this.utilidadService.mostrarAlerta("El consumidor fue registrado","Exito");
            this.modalActual.close("true")
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo registrar el consumidor","Error")

        }
      })

    }else{

      this.consumidorService.UpdateConsumidor(consumidor.id,consumidor).subscribe({
        next: (data) => {          
            this.utilidadService.mostrarAlerta("El consumidor fue editado","Exito");
            this.modalActual.close("true")        
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo editar el consumidor","Error")
        }
      })

    }

  }

 
}
