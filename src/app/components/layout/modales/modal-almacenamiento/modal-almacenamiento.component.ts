import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { SeccionProductos } from 'src/app/interfaces/seccion-productos';
import { OrdenEntranteService } from 'src/app/services/orden.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { SeccionService } from 'src/app/services/seccion.service';
import { Observer } from 'rxjs';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-modal-almacenamiento',
  templateUrl: './modal-almacenamiento.component.html',
  styleUrls: ['./modal-almacenamiento.component.css']
})
export class ModalAlmacenamientoComponent implements OnInit{

  formularioSeccionProducto:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  secciones: Seccion[] = [];
  productos: Producto[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalAlmacenamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosSeccionProducto: SeccionProductos,
    private fb: FormBuilder,
    private seccionesService: SeccionService,
    private utilidadService: UtilidadService,
    private ordenService: OrdenEntranteService,
    private productoService: ProductoService
  ){

    this.formularioSeccionProducto = this.fb.group({
      idSeccion : new FormControl('',Validators.required),
      idProducto : ['',Validators.required],
      nombreProducto : ['',Validators.required],
      cantidad : ['',Validators.required],
      productoIngresadoId:[''],
      dimensiones:[''],
      idDeposito:['']
      
    });

    if(this.datosSeccionProducto != null){

      this.tituloAccion = "Este ingreso ocupará ";
      this.botonAccion = "Almacenar";
    }

  }


  ngOnInit(): void {
    if(this.datosSeccionProducto != null){

      this.formularioSeccionProducto.patchValue({
        idProducto : this.datosSeccionProducto.idProducto,
        nombreProducto : this.datosSeccionProducto.nombreProducto,
        cantidad : this.datosSeccionProducto.cantidad, 
        productoIngresadoId : this.datosSeccionProducto.id
        
      })
    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.GetSecciones(this.depositoIdNavegacion);
    this.GetProductos(this.depositoIdNavegacion);
  }

  // Guardamos productos en la seccion
  AlmacenarProductos(){

    const seccionProductos: SeccionProductos = {
      idSeccion : this.formularioSeccionProducto.value.idSeccion,
      idProducto : this.formularioSeccionProducto.value.idProducto,
      nombreProducto : this.formularioSeccionProducto.value.nombreProducto,
      cantidad : this.formularioSeccionProducto.value.cantidad,
      productoIngresadoId: this.formularioSeccionProducto.value.productoIngresadoId,
      dimensiones: this.GetDimensionesProducto(this.datosSeccionProducto.idProducto)*this.datosSeccionProducto.cantidad,
      idDeposito: this.depositoIdNavegacion
    }

      this.ordenService.AlmacenarProductos(seccionProductos).subscribe({
        next: (data) => {
            this.utilidadService.mostrarAlerta("Los productos fueron almacenados","Exito");
            this.modalActual.close("true")
        },
        error: (errorRespuesta) => {
          if (errorRespuesta.status === 404) {
            const ErrorMensaje = errorRespuesta.error; // Captura el mensaje personalizado del servidor
            this.utilidadService.mostrarAlerta(`${ErrorMensaje}`, "Error");
          } else {
              this.utilidadService.mostrarAlerta("No se pudo almacenar los productos", "Error");
            }
        }
      }) 


  }

  // Obtenemos todas las secciones
  GetSecciones(idDeposito: string) {

    const observer: Observer<Seccion[]> = {
      next: (secciones) => {
        this.secciones = secciones;
      },
      error: (error) => {
      },
      complete: () => {  
      }
    };
  
    this.seccionesService.GetAllSecciones(idDeposito).subscribe(observer);
  }

  // Obtenemos todos los productos
  GetProductos(idDeposito: string) {

    const observer: Observer<Producto[]> = {
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };
  
    this.productoService.GetAllProductos(idDeposito).subscribe(observer);
  }

  // Obtenemos dimensiones del producto
  GetDimensionesProducto(idProducto: string): number {
  
    const producto = this.productos.find(item => item.id === idProducto);
  
    if (producto && producto.dimensiones) {
      return producto.dimensiones;
    } else {
      return 0; 
    }
  }


}

