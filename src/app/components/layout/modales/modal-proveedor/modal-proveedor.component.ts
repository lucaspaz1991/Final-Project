import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service'

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit{

  formularioProveedor:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProveedor: Proveedor,
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private utilidadService: UtilidadService
  ){

    this.formularioProveedor = this.fb.group({
      nombre : ['',Validators.required],
      direccion : ['',Validators.required],
      ciudad : ['',Validators.required],
      correo : ['', [Validators.required, Validators.email]]
      
    });

    if(this.datosProveedor != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {
      
    if(this.datosProveedor != null){

      this.formularioProveedor.patchValue({
        nombre : this.datosProveedor.nombre,
        direccion : this.datosProveedor.direccion,
        ciudad : this.datosProveedor.ciudad,
        correo : this.datosProveedor.correo,

      })
    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
  }

  // Agrega o modifica proveedor en base al autocompletado del formulario 
  GuardarEditarproveedor(){

    const proveedor: Proveedor = {
      id : this.datosProveedor == null ? '' : this.datosProveedor.id,
      nombre : this.formularioProveedor.value.nombre,
      direccion : this.formularioProveedor.value.direccion,
      ciudad : this.formularioProveedor.value.ciudad,
      correo : this.formularioProveedor.value.correo,
      idDeposito: this.depositoIdNavegacion
    }

    if(this.datosProveedor == null) {

      this.proveedorService.AddProveedor(proveedor).subscribe({
        next: (data) => {
            this.utilidadService.mostrarAlerta("El proveedor fue registrado","Exito");
            this.modalActual.close("true")
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo registrar el proveedor","Error")

        }
      })

    }else{

      this.proveedorService.UpdateProveedor(proveedor.id,proveedor).subscribe({
        next: (data) => {          
            this.utilidadService.mostrarAlerta("El proveedor fue editado","Exito");
            this.modalActual.close("true")        
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo editar el proveedor","Error")
        }
      })

    }

  }

 

}
