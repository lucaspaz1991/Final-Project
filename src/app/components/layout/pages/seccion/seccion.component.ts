import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Seccion } from 'src/app/interfaces/seccion';
import { SeccionService } from 'src/app/services/seccion.service';
import { ModalSeccionComponent } from '../../modales/modal-seccion/modal-seccion.component';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import Swal from 'sweetalert2';
import { ModalConsultaSeccionComponent } from '../../modales/modal-consulta-seccion/modal-consulta-seccion.component';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  secciones: MatTableDataSource<Seccion>;
  columnasDesplegadas: string[] = ['id','codigo','tipoSeccion','capacidadMaxima','ocupacionActual',
  'capacidadActual','fechaCreacion','idDeposito','acciones']; 

  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';


  constructor(
    private seccionesService: SeccionService,
    private utilidadService: UtilidadService, 
    private dialog: MatDialog
  ){
    this.secciones = new MatTableDataSource<Seccion>([]); // Usa la interfaz Empleado
  
  }

  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarSecciones();
  }

  // Carga todas las secciones de este deposito
  CargarSecciones(): void {
    this.seccionesService.GetAllSecciones(this.depositoIdNavegacion).subscribe({
      next: (seccion) => {
        this.secciones = new MatTableDataSource(seccion);
        this.secciones.paginator = this.paginator;
      },
      error: (response) => {
      }
    });
  }

  ClickBotonAgregar(): void {
    this.dialog.open(ModalSeccionComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarSecciones();
    });
  }
  
  ClickBotonEditar(row: Seccion): void {
    this.dialog.open(ModalSeccionComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarSecciones();
    });
  }
  
  ClickBotonEliminar(row: Seccion): void {
    Swal.fire({
      title: '¿Desea eliminar la seccion?',
      text: row.codigo,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton: true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado => {
  
        if(resultado.isConfirmed){

          if(row.ocupacionActual > 0){
            this.utilidadService.mostrarAlerta("No puedes eliminar una seccion con productos almacenados en ellas","Error");
          }else{ 
  
          this.seccionesService.DeleteSeccion(row.id).subscribe({
            next:(data) => {
                this.utilidadService.mostrarAlerta("La seccion fue eliminado","Listo!");
                this.CargarSecciones();
            },
            error: (errorResponse) => {
              if (errorResponse.status === 404) {
                const errorMessage = errorResponse.error; // Captura el mensaje personalizado del servidor
                this.utilidadService.mostrarAlerta(`${errorMessage}`, "Error");
              } else {
                  this.utilidadService.mostrarAlerta("No se pudo eliminar la seccion","Error");
                }
            }
          })
        }
   } }))
  }
  
  ClickBotonBuscar(): void {
    this.dialog.open(ModalConsultaSeccionComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarSecciones();
      ;
    });
  }

  // Filtrar función personalizada
  ApplyFilter(): void {
    this.secciones.filter = this.filtroBusqueda.trim().toLowerCase();
  }

}
