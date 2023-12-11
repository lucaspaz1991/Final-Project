import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModalEmpleadoComponent } from '../../modales/modal-empleado/modal-empleado.component';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  empleados: MatTableDataSource<Empleado>;
  columnasDesplegadas: string[] = ['id','nombre','apellido','telefono','idDeposito','acciones'];

  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';

  constructor(
    private empleadosService: EmpleadoService,
    private utilidadService: UtilidadService, 
    private dialog: MatDialog
  ){
    this.empleados = new MatTableDataSource<Empleado>([]); // Usa la interfaz Empleado

  }

  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarEmpelados();
  }

  // Carga todos los empleados de este deposito
  CargarEmpelados(): void {
    this.empleadosService.GetAllEmpleados(this.depositoIdNavegacion).subscribe({
      next: (empleado) => {
        this.empleados = new MatTableDataSource(empleado);
        this.empleados.paginator = this.paginator;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  ClickBotonAgregar(): void {
    this.dialog.open(ModalEmpleadoComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarEmpelados();
    });
  }

  ClickBotonEditar(row: Empleado): void {
    this.dialog.open(ModalEmpleadoComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarEmpelados();
    });
  }
  
  ClickBotonEliminar(row: Empleado): void {
    Swal.fire({
      title: '¿Desea eliminar el empleado?',
      text: row.apellido +" "+ row.nombre,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton: true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado => {

        if(resultado.isConfirmed){

          this.empleadosService.DeleteEmpleado(row.id).subscribe({
            next:(data) => {
                this.utilidadService.mostrarAlerta("El empleado fue eliminado","Listo!");
                this.CargarEmpelados();
            },
            error:(e) => {
              this.utilidadService.mostrarAlerta("No se pudo eliminar el empleado","Error");

            }
          })
        }
    }))
  }
  
  // Filtrar función personalizada
  ApplyFilter(): void {
    this.empleados.filter = this.filtroBusqueda.trim().toLowerCase();
  }

}
