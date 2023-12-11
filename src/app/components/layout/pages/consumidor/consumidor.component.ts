import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Consumidor } from 'src/app/interfaces/consumidor';
import { ConsumidorService } from 'src/app/services/consumidor.service';
import { ModalConsumidorComponent } from '../../modales/modal-consumidor/modal-consumidor.component';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-consumidor',
  templateUrl: './consumidor.component.html',
  styleUrls: ['./consumidor.component.css']
})
export class ConsumidorComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  consumidores: MatTableDataSource<Consumidor>;
  columnasDesplegadas: string[] = ['id','nombre','direccion','correo','idDeposito','acciones'];

  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';

constructor(
  private consumidoresService: ConsumidorService,
  private utilidadService: UtilidadService, 
  private dialog: MatDialog
){
  this.consumidores = new MatTableDataSource<Consumidor>([]); // Usa la interfaz Consumidor

}

ngOnInit(): void {

  this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.CargarConsumidores();
}

// Carga todos los consumidores de este deposito
CargarConsumidores(): void {
  this.consumidoresService.GetAllConsumidores(this.depositoIdNavegacion).subscribe({
    next: (consumidores) => {
      this.consumidores = new MatTableDataSource(consumidores);
      this.consumidores.paginator = this.paginator;
    },
    error: (response) => {
    }
  });
}

ClickBotonAgregar(): void {
  this.dialog.open(ModalConsumidorComponent,{
    disableClose: true,
  }).afterClosed().subscribe(resultado => {
    if(resultado === "true") this.CargarConsumidores();
  });
}

ClickBotonEditar(row: Consumidor): void {
  this.dialog.open(ModalConsumidorComponent,{
    disableClose: true,
    data: row
  }).afterClosed().subscribe(resultado => {
    if(resultado === "true") this.CargarConsumidores();
  });
}

ClickBotonEliminar(row: Consumidor): void {
  Swal.fire({
    title: '¿Desea eliminar el consumidor?',
    text: row.nombre,
    icon:"warning",
    confirmButtonColor:"#3085d6",
    confirmButtonText:"Si, eliminar",
    showCancelButton: true,
    cancelButtonColor:"#d33",
    cancelButtonText:"No, volver"
  }).then((resultado => {

      if(resultado.isConfirmed){

        this.consumidoresService.DeleteConsumidor(row.id).subscribe({
          next:(data) => {
              this.utilidadService.mostrarAlerta("El consumidor fue eliminado","Listo!");
              this.CargarConsumidores();
          },
          error: (errorResponse) => {
            if (errorResponse.status === 404) {
              const errorMessage = errorResponse.error; // Captura el mensaje personalizado del servidor
              this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
            } else {
              this.utilidadService.mostrarAlerta("No se pudo eliminar el consumidor","Error");
              }
          }
        })
      }
  }))
}

// Filtrar función personalizada
ApplyFilter(): void {
  this.consumidores.filter = this.filtroBusqueda.trim().toLowerCase();
}



}
