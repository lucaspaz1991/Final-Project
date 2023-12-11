import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import Swal from 'sweetalert2';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productos: MatTableDataSource<Producto>;
  columnasDesplegadas: string[] = ['id','nombre','descripcion','categoria','cantidadEnStock','dimensiones',
  'precio','fechaCreacion','fechaValidez','idDeposito','idProveedor','acciones']; 
  
  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';

  proveedores: Proveedor[] = [];
  
  constructor(
    private productosService: ProductoService,
    private utilidadService: UtilidadService,
    private proveedorService: ProveedorService,
    private dialog: MatDialog
  ) {
    this.productos = new MatTableDataSource<Producto>([]); // Usa la interfaz Producto

  }


  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarProductos();
  }

  // Carga todos los productos de este deposito
  CargarProductos(): void {
    this.productosService.GetAllProductos(this.depositoIdNavegacion).subscribe({
      next: (producto) => {
        this.productos = new MatTableDataSource(producto);
        this.productos.paginator = this.paginator;
      },
      error: (response) => {
      }
    });
  }

  ClickBotonAgregar(): void {
    this.dialog.open(ModalProductoComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarProductos();
    });
  }
  
  ClickBotonEditar(row: Producto): void {
    this.dialog.open(ModalProductoComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarProductos();
    });
  }
  
  ClickBotonEliminar(row: Producto): void {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: row.nombre,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton: true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado => {
  
        if(resultado.isConfirmed){
  
          this.productosService.DeleteProducto(row.id).subscribe({
            next:(data) => {
                this.utilidadService.mostrarAlerta("El producto fue eliminado","Listo!");
                this.CargarProductos();
            },
            error: (errorResponse) => {
              if (errorResponse.status === 404) {
                const errorMessage = errorResponse.error;
                this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
              } else {
                this.utilidadService.mostrarAlerta("No se pudo eliminar el producto","Error");
                }
            }
          })
        }
    }))
  }
  
  // Filtrar función personalizada
  ApplyFilter(): void {
    this.productos.filter = this.filtroBusqueda.trim().toLowerCase();
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

  


