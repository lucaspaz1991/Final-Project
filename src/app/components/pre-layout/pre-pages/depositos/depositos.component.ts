import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { ModalDepositoComponent } from '../../modales/modal-deposito/modal-deposito.component';
import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { DataService } from 'src/app/services/data.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-depositos',
  templateUrl: './depositos.component.html',
  styleUrls: ['./depositos.component.css']
})

export class DepositosComponent implements OnInit, AfterViewInit{
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  depositos2: MatTableDataSource<Deposito>;
  columnasDesplegadas: string[] = ['id','codigo', 'direccion' ,'ciudad', 'pais', 'capacidadMaxima',
  'ocupacionActual','capacidadActual','fechaCreacion','acciones', 'acceso']; 

  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';


  constructor(
    private depositosService: DepositoService,
    private utilidadService: UtilidadService, 
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog
    ) {
      this.depositos2 = new MatTableDataSource<Deposito>([]); // Usa la interfaz Deposito
    }


  ngOnInit(): void {
    
    this.CargarDepositos();
 
  }

  ngAfterViewInit(): void {
    this.depositos2.sort = this.sort;
  }
 
  CargarDepositos(): void {
    this.depositosService.GetAllDepositos().subscribe({
      next: (depositos) => {
        this.depositos2 = new MatTableDataSource(depositos);
        this.depositos2.paginator = this.paginator;
      },
      error: (response) => {
      }
    });
  }


 ClickBotonAgregar(): void {
    this.dialog.open(ModalDepositoComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarDepositos();
    });
  }

  ClickBotonEditar(row: Deposito): void {
    this.dialog.open(ModalDepositoComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarDepositos();
    });
  }

  // Accede al deposito para gestionar el resto de las entidades relacionadas al mismo
  ClickBotonAcceder(row: Deposito): void {
    this.depositoIdNavegacion = this.dataService.SetearIdDepositoNavegacion(row.id);
    localStorage.setItem('depositoIdNavegacion', row.id);
    this.router.navigate(['pages', row.id, 'deposito']);
  }
  
  ClickBotonEliminar(row: Deposito): void {
    Swal.fire({
      title: '¿Desea eliminar el deposito?',
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
            this.utilidadService.mostrarAlerta("No puedes eliminar un depósito con productos almacenados en el","Error");
          }else{ 

          this.depositosService.DeleteDeposito(row.id).subscribe({
            next:(data) => {
                this.utilidadService.mostrarAlerta("El deposito fue eliminado","Listo!");
                this.CargarDepositos();
            },
            error:(e) => {
              this.utilidadService.mostrarAlerta("No se pudo eliminar el deposito","Error");

            }
          })
        }
  }}))
  }
  
  // Filtrar función personalizada
  ApplyFilter(): void {
    this.depositos2.filter = this.filtroBusqueda.trim().toLowerCase();
  }


}





