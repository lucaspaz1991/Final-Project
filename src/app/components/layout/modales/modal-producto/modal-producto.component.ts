import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';


import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service'
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})

export class ModalProductoComponent implements OnInit{

  formularioProducto:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  depositoIdNavegacion: any = '';

  proveedores: Proveedor[] = [];

  fechaFormateada: any = '';
  fechaHoy = new Date();

  dia = this.fechaHoy.getDate();
  mes = this.fechaHoy.getMonth() + 1; // Sumamos 1 al mes, ya que los meses comienzan en 0 (enero) en JavaScript
  año = this.fechaHoy.getFullYear();

  // Formatea la fecha en el formato "dd/mm/aaaa"
  fechaHoyFormateada = `${this.dia}/${this.mes}/${this.año}`;
  
  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private utilidadService: UtilidadService,
    private proveedorService: ProveedorService,
    private datePipe: DatePipe
  ){

    this.formularioProducto = this.fb.group({
      nombre : ['',Validators.required],
      descripcion : ['',Validators.required],
      categoria : ['',Validators.required],
      dimensiones : ['',Validators.required],
      precio : ['',Validators.required],
      fechaValidezDate : ['',Validators.required],
      idProveedor :new FormControl('',Validators.required),
      
    });

    if(this.datosProducto != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }
  ngOnInit(): void {

    if(this.datosProducto != null){

      this.formularioProducto.patchValue({
        nombre : this.datosProducto.nombre,
        descripcion : this.datosProducto.descripcion,
        categoria : this.datosProducto.categoria,
        dimensiones : this.datosProducto.dimensiones,
        precio : this.datosProducto.precio,
        fechaValidezDate : Date.parse(this.datosProducto.fechaValidez),
        idProveedor: this.datosProducto.idProveedor
        
      })
    } 
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.GetProveedores(this.depositoIdNavegacion);


  }

  // Agrega o modifica producto en base al autocompletado del formulario 
  GuardarEditarproducto(){

    this.fechaFormateada = this.datePipe.transform(this.formularioProducto.value.fechaValidezDate, 'dd/MM/yyyy');

    const producto: Producto = {
      id : this.datosProducto == null ? '' : this.datosProducto.id,
      nombre : this.formularioProducto.value.nombre,
      descripcion : this.formularioProducto.value.descripcion,
      categoria : this.formularioProducto.value.categoria,
      cantidadEnStock : this.datosProducto == null ? 0 : this.datosProducto.cantidadEnStock,
      dimensiones : this.formularioProducto.value.dimensiones,
      precio : this.formularioProducto.value.precio,
      fechaCreacion : this.datosProducto == null ? '' : this.datosProducto.fechaCreacion,
      fechaValidez : this.fechaFormateada,
      idDeposito: this.depositoIdNavegacion,
      idProveedor : this.formularioProducto.value.idProveedor,
    }

    const partesFecha = producto.fechaValidez.split("/"); // Dividir la cadena en día, mes y año

    // Crear un objeto Date a partir de las partes de la fecha
    const fechaValidezDate = new Date(
      +partesFecha[2], // Año
      +partesFecha[1] - 1, // Mes (restamos 1 ya que los meses comienzan en 0)
      +partesFecha[0] // Día
    );

    if(this.datosProducto == null) {

      if(producto.precio < 0){
        this.utilidadService.mostrarAlerta("El precio no puede ser negativo","Error");
      }else 
          if(producto.dimensiones < 0){
            this.utilidadService.mostrarAlerta("Las dimensiones no pueden ser negativas","Error");
          }else 
              if(fechaValidezDate < this.fechaHoy){
                this.utilidadService.mostrarAlerta("Debes ingresar una fecha futura","Error");
          }else{
          this.productoService.AddProducto(producto).subscribe({
            next: (data) => {
                this.utilidadService.mostrarAlerta("El producto fue registrado","Exito");
                this.modalActual.close("true")
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo registrar el producto","Error")

        }
      })
    }
    }else{
      if(producto.precio < 0){
        this.utilidadService.mostrarAlerta("El precio no puede ser negativo","Error");
      }else 
          if(producto.dimensiones < 0){
            this.utilidadService.mostrarAlerta("Las dimensiones no pueden ser negativas","Error");
          }else 
              if(fechaValidezDate < this.fechaHoy){
                this.utilidadService.mostrarAlerta("Debes ingresar una fecha futura","Error");
          }else{
            this.productoService.UpdateProducto(producto.id,producto).subscribe({
              next: (data) => {          
                  this.utilidadService.mostrarAlerta("El producto fue editado","Exito");
                  this.modalActual.close("true")        
        },
        error: (e) => {
          this.utilidadService.mostrarAlerta("No se pudo editar el producto","Error")
        }
      })

    }

  }
  
}

  // Carga todos los proveedores de este deposito
  GetProveedores(idDeposito: string) {

    idDeposito = this.depositoIdNavegacion;

    const observer: Observer<Proveedor[]> = {
      next: (proveedores) => {
        this.proveedores = proveedores;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };
  
    this.proveedorService.GetAllProveedores(idDeposito).subscribe(observer);
  }
}