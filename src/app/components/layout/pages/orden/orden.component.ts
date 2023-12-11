import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ProductoService } from 'src/app/services/producto.service';
import { OrdenEntranteService } from 'src/app/services/orden.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import { Producto } from 'src/app/interfaces/producto';
import { OrdenEntrante } from 'src/app/interfaces/orden';
import { ProductoIngresado } from 'src/app/interfaces/productoIngresado';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Deposito } from 'src/app/interfaces/deposito';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { Observer } from 'rxjs';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];

  productos: MatTableDataSource<Producto>;

  listaProductosEnOrden: ProductoIngresado[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;

  formularioProductoOrden: FormGroup;
  columnasTabla: string[] = ['idProducto','producto','cantidad','accion'];
  datosDetalleOrden = new MatTableDataSource(this.listaProductosEnOrden);

  proveedores: Proveedor[] = [];
  empleados: Empleado[] = [];

  accessDepositoRequest: Deposito = {
    
    id: '',
    codigo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    capacidadMaxima:0,
    ocupacionActual: 0,
    capacidadActual: 0,
    fechaCreacion: '' 
  };

  AddProductoRequest: Producto = {
    
    id: '',
    nombre: '',
    descripcion: '',    
    categoria: '',
    cantidadEnStock: 0,
    dimensiones: 0,
    precio: 0,
    fechaCreacion: '',
    fechaValidez:'',
    idProveedor: '',
    idDeposito: ''
  };

  addOrdenRequest: OrdenEntrante = {
    
    id: '',
    numeroDocumento: '',
    fechaRecepcion: '',    
    idEmpleado: '',
    idProveedor: '',
    idDeposito: '',
    productoIngresado: []
  };

  RetornarProductosPorFiltro(busqueda: any): Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  idDeposito: string = '';

  productoSeleccionadoId: string | null = null; 
  proveedorSeleccionadoId: string | null = null;
  empleadoSeleccionadoId: string | null = null;


  mostrarInput: boolean = false;

  depositoIdNavegacion: any = '';

  // Función que se llama cuando cambia idProveedor
  CambiaIdProveedor() {
    this.mostrarInput = !!this.addOrdenRequest.idProveedor;
    this.ProductosProveedor();
    this.listaProductosEnOrden = [];
    this.datosDetalleOrden = new MatTableDataSource(this.listaProductosEnOrden);

  }

  constructor(
    private fb:FormBuilder,
    private productoService: ProductoService,
    private ordenService: OrdenEntranteService,
    private utilidadService: UtilidadService,
    private proveedoresService: ProveedorService,
    private empleadosService: EmpleadoService,
    private router: Router
    
    
    ){ 

      this.productos = new MatTableDataSource<Producto>([]); // Usa la interfaz Producto

      this.formularioProductoOrden = this.fb.group({
        producto: ['', Validators.required],
        cantidad: ['', Validators.required],
        idProducto: [''] 
      });
  
      this.formularioProductoOrden.get('producto')?.valueChanges.subscribe(value => {
        this.listaProductosFiltro = this.RetornarProductosPorFiltro(value);
      })
    
    }

  ngOnInit(): void {
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.GetProveedores(this.depositoIdNavegacion);
    this.GetEmpleados(this.depositoIdNavegacion);
  }

  // Carga todos los productos de este deposito
  CargarProductos(): void {
    this.productoService.GetAllProductos(this.depositoIdNavegacion).subscribe({
      next: (productos) => {
        this.listaProductos = productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
       
      },
      error: (response) => {
      }
    });
  }

  // Obtiene los productos de un proveedor determinado
  ProductosProveedor(): void {

      const id = this.depositoIdNavegacion;
      const idProveedor: string = this.addOrdenRequest.idProveedor;
      
        this.productoService.GetProductosProveedor(id, idProveedor).subscribe({
          next: (productos) => {
            this.listaProductos = productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            
          },
          error: (response) => {
          }
       });
   
  }

  MostrarProducto(producto: Producto): string {

    return producto.nombre;
  }

  MostrarProductoID(producto: Producto): string {

    return producto.id;
  }

  ProductoParaOrden(event: any){
    this.productoSeleccionado = event.option.value;

  }
  
  AgregarProductoParaOrden(){

    const _cantidad: number = this.formularioProductoOrden.value.cantidad;
   
    if (this.productoSeleccionado) {
      this.productoSeleccionadoId = this.productoSeleccionado.id;

    this.listaProductosEnOrden.push({
      idProducto: this.productoSeleccionado.id,
      nombreProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      almacenado: false,

    });

    this.datosDetalleOrden = new MatTableDataSource(this.listaProductosEnOrden);

    this.formularioProductoOrden.patchValue({
  
      producto:'',
      cantidad: ''
    });
  }

  }

  EliminarProducto(detalle: ProductoIngresado){
    this.listaProductosEnOrden = this.listaProductosEnOrden.filter(p => p.idProducto != detalle.idProducto);
  
    this.datosDetalleOrden = new MatTableDataSource(this.listaProductosEnOrden);

  }

  // Registra la orden dentro del deposito
  RegistrarOrden(){

    if(this.listaProductosEnOrden.length > 0){

      this.bloquearBotonRegistrar = true;

      const orden = {
        detallesOrden:  this.listaProductosEnOrden,
        idDeposito: this.depositoIdNavegacion,
        idProveedor: this.addOrdenRequest.idProveedor,
        idEmpleado: this.addOrdenRequest.idEmpleado
      };

      const test = this.listaProductosEnOrden;

      this.ordenService.CrearOrden(orden).subscribe({
        next: (response) => {
          if(response==null){ // Se deja null porque asi esta configurado el response del Backend
            this.listaProductosEnOrden = [];
            this.datosDetalleOrden = new MatTableDataSource(this.listaProductosEnOrden);

            Swal.fire({
              icon: 'success',
              title: 'Orden Registrada!',

            });

            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['pages', this.depositoIdNavegacion, 'ordenesIngreso']);
            });

          }else
            this.utilidadService.mostrarAlerta("No se pudo registrar la orden","Oops");
        },
        complete:() => {
          this.bloquearBotonRegistrar = false;

        },
        error:(e) => {  
      }
      })

    }
  }

  // Carga todos los proveedores de este deposito
  GetProveedores(idDeposito: string) {
    const observer: Observer<Proveedor[]> = {
      next: (proveedores) => {
        this.proveedores = proveedores;
      },
      error: (error) => {
        console.error('Error al obtener los proveedores:', error);
      },
      complete: () => {
      }
    };
  
    this.proveedoresService.GetAllProveedores(idDeposito).subscribe(observer);
  }

  // Carga todos los empleados de este deposito
  GetEmpleados(idDeposito: string) {
    const observer: Observer<Empleado[]> = {
      next: (empleados) => {
        this.empleados = empleados;
      },
      error: (error) => {
        console.error('Error al obtener los empelados:', error);
      },
      complete: () => {
      }
    };
  
    this.empleadosService.GetAllEmpleados(idDeposito).subscribe(observer);
  }



}
