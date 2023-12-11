import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Seccion } from 'src/app/interfaces/seccion';
import { SeccionService } from 'src/app/services/seccion.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service'
import { Observer } from 'rxjs';
import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';

@Component({
  selector: 'app-modal-seccion',
  templateUrl: './modal-seccion.component.html',
  styleUrls: ['./modal-seccion.component.css']
})
export class ModalSeccionComponent implements OnInit{

  formularioSeccion:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  arraySecciones: Seccion[]=[];
  aux: number = 0;
  auxSecciones: number = 0;
  auxSeccionActual: any;
  deposito: any;

  constructor(
    private modalActual: MatDialogRef<ModalSeccionComponent>,
    @Inject(MAT_DIALOG_DATA) public datosSeccion: Seccion,
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private utilidadService: UtilidadService,
    private depositoService: DepositoService
  ){

    this.formularioSeccion = this.fb.group({
      codigo : ['',Validators.required],
      tipoSeccion : ['',Validators.required],
      capacidadMaxima : ['',Validators.required]
   
    });

    if(this.datosSeccion != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {
    
    if(this.datosSeccion != null){

      this.formularioSeccion.patchValue({
        codigo : this.datosSeccion.codigo,
        tipoSeccion : this.datosSeccion.tipoSeccion,
        capacidadMaxima : this.datosSeccion.capacidadMaxima,

      })

    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.ObtenerSecciones();
    this.ObtenerDeposito();
    this.ObtenerSeccionActual(this.datosSeccion.id);

  }

  // Agrega o modifica seccion en base al autocompletado del formulario 
  GuardarEditarseccion(){

    const seccion: Seccion = {
      id : this.datosSeccion == null ? '00000000-0000-0000-0000-000000000000' : this.datosSeccion.id,
      codigo : this.formularioSeccion.value.codigo,
      tipoSeccion : this.formularioSeccion.value.tipoSeccion,
      capacidadMaxima : this.formularioSeccion.value.capacidadMaxima,
      ocupacionActual : this.datosSeccion == null ? 0 : this.datosSeccion.ocupacionActual,
      capacidadActual : this.datosSeccion == null ? 0 : this.datosSeccion.capacidadActual,
      fechaCreacion : this.datosSeccion == null ? '' : this.datosSeccion.fechaCreacion,
      idDeposito: this.depositoIdNavegacion
    }

    this.arraySecciones.forEach(element => {

      if(element.codigo === this.formularioSeccion.value.codigo)
        this.aux++;
    });

    this.arraySecciones.forEach(element => {

      this.auxSecciones+= element.capacidadMaxima;
    });


    if(this.datosSeccion == null) {  


      if(this.aux > 0){
        this.utilidadService.mostrarAlerta("Codigo de sección repetido","Error");
      }else 
          if(seccion.capacidadMaxima < 0){
            this.utilidadService.mostrarAlerta("Las dimensiones no pueden ser negativas","Error");
        }else{

        this.seccionService.AddSeccion(seccion).subscribe({
          next: (data) => {
              this.utilidadService.mostrarAlerta("La seccion fue registrada","Exito");
              this.modalActual.close("true")
          },
          error: (errorResponse) => {
            if (errorResponse.status === 404) {
              const errorMessage = errorResponse.error; // Captura el mensaje personalizado del servidor
              this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
            } else if (errorResponse.status === 500) {
              const errorMessage = errorResponse.error; // Idem anterior
              this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
            } else {
                this.utilidadService.mostrarAlerta("No se pudo registrar la seccion","Error")
              }
          }
        })
      }
      this.aux = 0;
      this.auxSecciones = 0;

    }else{

      if(this.aux > 0 && seccion.codigo != this.auxSeccionActual.codigo){
        this.utilidadService.mostrarAlerta("Codigo de sección repetido","Error");
      }else 
          if(seccion.capacidadMaxima < 0){
            this.utilidadService.mostrarAlerta("Las dimensiones no pueden ser negativas","Error");
          }else
              if(seccion.capacidadMaxima < seccion.ocupacionActual){
                this.utilidadService.mostrarAlerta("La capacidad de la sección no puede ser menor que su ocupación actual","Error");
              }else 
                  if(this.deposito.capacidadMaxima < (this.auxSecciones + (seccion.capacidadMaxima - this.datosSeccion.capacidadMaxima))){
                    this.utilidadService.mostrarAlerta("La capacidad de la sección no puede superar la capacidad maxima del depósito","Error");
                  }else{  
                    
                    this.seccionService.UpdateSeccion(seccion.id,seccion).subscribe({
                      next: (data) => {          
                          this.utilidadService.mostrarAlerta("La seccion fue editada","Exito");
                          this.modalActual.close("true")        
                    },
                    error: (e) => {
                      this.utilidadService.mostrarAlerta("No se pudo editar la seccion","Error")
                    }
          })
    }
    this.aux = 0;
    this.auxSecciones = 0;
    }

    this.aux = 0;
    this.auxSecciones = 0;
  }

  // Carga todas las secciones de este deposito
  ObtenerSecciones(){

    const observer: Observer<Seccion[]> = {
      next: (secciones) => {
        this.arraySecciones = secciones;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };

    this.seccionService.GetAllSecciones(this.depositoIdNavegacion).subscribe(observer);
    
  }

  // Carga la seccion actual
  ObtenerSeccionActual(idSeccion: string){

    const observer: Observer<Seccion> = {
      next: (seccion) => {
        this.auxSeccionActual = seccion;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };

    this.seccionService.GetSeccion(idSeccion).subscribe(observer);
    
  }

  // Carga el deposito actual
  ObtenerDeposito(){

    const observer: Observer<Deposito> = {
      next: (deposito) => {
        this.deposito = deposito;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };

    this.depositoService.GetDeposito(this.depositoIdNavegacion).subscribe(observer);
    
  }

}
