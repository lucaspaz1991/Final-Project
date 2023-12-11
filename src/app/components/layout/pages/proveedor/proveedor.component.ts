import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ModalProveedorComponent } from '../../modales/modal-proveedor/modal-proveedor.component';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

import Swal from 'sweetalert2';
import { Observer } from 'rxjs';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  proveedores: MatTableDataSource<Proveedor>;
  columnasDesplegadas: string[] = ['id','nombre','direccion','ciudad','correo','idDeposito','acciones'];

  productos: Producto[]=[];

  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';
  aux: number = 0;

constructor(
  private proveedoresService: ProveedorService,
  private utilidadService: UtilidadService, 
  private productoService: ProductoService,
  private dialog: MatDialog
){
  this.proveedores = new MatTableDataSource<Proveedor>([]); // Usa la interfaz Proveedor

}

ngOnInit(): void {
  this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarProveedores();
    this.GetProductos(this.depositoIdNavegacion);
}

// Carga todos los proveedores de este deposito
CargarProveedores(): void {

  this.proveedoresService.GetAllProveedores(this.depositoIdNavegacion).subscribe({
    next: (proveedor) => {
      this.proveedores = new MatTableDataSource(proveedor);
      this.proveedores.paginator = this.paginator;
    },
    error: (response) => {
    }
  });
}

ClickBotonAgregar(): void {
  this.dialog.open(ModalProveedorComponent,{
    disableClose: true,
  }).afterClosed().subscribe(resultado => {
    if(resultado === "true") this.CargarProveedores();
  });
}

ClickBotonEditar(row: Proveedor): void {
  this.dialog.open(ModalProveedorComponent,{
    disableClose: true,
    data: row
  }).afterClosed().subscribe(resultado => {
    if(resultado === "true") this.CargarProveedores();
  });
}

ClickBotonEliminar(row: Proveedor): void {
  Swal.fire({
    title: '¿Desea eliminar el proveedor?',
    text: row.nombre,
    icon:"warning",
    confirmButtonColor:"#3085d6",
    confirmButtonText:"Si, eliminar",
    showCancelButton: true,
    cancelButtonColor:"#d33",
    cancelButtonText:"No, volver"
  }).then((resultado => {

      if(resultado.isConfirmed){

        this.productos.forEach(element => {

          if(element.idProveedor === row.id)
            this.aux++;
        });

        if(this.aux > 0){
          this.utilidadService.mostrarAlerta("No puedes eliminar un proveedor que tiene productos en este depósito","Error");
        }else{ 

        this.proveedoresService.DeleteProveedor(row.id).subscribe({
          next:(data) => {
              this.utilidadService.mostrarAlerta("El proveedor fue eliminado","Listo!");
              this.CargarProveedores();
          },
          error: (errorResponse) => {
            if (errorResponse.status === 404) {
              const errorMessage = errorResponse.error; // Captura el mensaje personalizado del servidor
              this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
            } else {
              this.utilidadService.mostrarAlerta("No se pudo eliminar el proveedor","Error");
              }
          }
        })
      }
      this.aux = 0;
}}))
}

// Filtrar función personalizada
ApplyFilter(): void {
  this.proveedores.filter = this.filtroBusqueda.trim().toLowerCase();
}

// Carga todos los productos de este deposito
GetProductos(idDeposito: string) {

  idDeposito = this.depositoIdNavegacion;

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


}
