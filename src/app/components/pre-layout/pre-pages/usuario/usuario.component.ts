import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  usuarios: MatTableDataSource<Usuario>;
  columnasDesplegadas: string[] = ['id','usuario', 'idRol' ,'mail','acciones']; // Defino columnas aquí

  filtroBusqueda: string ='';

  user: any = '';

  constructor(
    private usuariosService: UsuariosService,
    private utilidadService: UtilidadService, 
    private dialog: MatDialog
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]); // Usa la interfaz Usuario

  }

  ngOnInit(): void {
    
    this.CargarUsuarios();
    this.user = sessionStorage.getItem('usuario');
   
  }

  CargarUsuarios(): void {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = new MatTableDataSource(usuarios);
        this.usuarios.paginator = this.paginator;
      },
      error: (response) => {
      }
    });
  }

  ClickBotonAgregar(): void {
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarUsuarios();
    });
  }

  ClickBotonEditar(row: Usuario): void {
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarUsuarios();
    });
  }
  
  ClickBotonEliminar(row: Usuario): void {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: row.usuario,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton: true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado => {

        if(resultado.isConfirmed){

          if(row.usuario===this.user){
            this.utilidadService.mostrarAlerta("No puedes eliminar el usuario logueado","Error");
          }else{

          this.usuariosService.deleteUsuario(row.id).subscribe({
            next:(data) => {
                this.utilidadService.mostrarAlerta("El usuario fue eliminado","Listo!");
                this.CargarUsuarios();
            },
            error:(e) => {
              this.utilidadService.mostrarAlerta("No se pudo eliminar el usuario","Error");

            }
          })
        }
      }
    }))
  }
  
  // Filtrar función personalizada
  ApplyFilter(): void {
    this.usuarios.filter = this.filtroBusqueda.trim().toLowerCase();
  }

}