import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';

import { ModalDepositoComponent } from '../../modales/modal-deposito/modal-deposito.component';
import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';

import { ModalConsultaInventarioComponent } from '../../modales/modal-consulta-inventario/modal-consulta-inventario.component';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrls: ['./deposito.component.css']
})
export class DepositoComponent  implements OnInit{

  depositos: MatTableDataSource<Deposito>;
  columnasDesplegadas: string[] = ['id','codigo', 'direccion' ,'ciudad', 'pais', 'capacidadMaxima',
  'ocupacionActual','capacidadActual','fechaCreacion','acciones']; // Defino columnas aquí

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

  depositoIdNavegacion: any = '';

  constructor(
    private depositosService: DepositoService,
    private dialog: MatDialog
  ) {
    this.depositos = new MatTableDataSource<Deposito>([]); // Usa la interfaz Deposito
  }

 

  ngOnInit(): void {
    
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarDepositoNavegacion();
  }

  // Carga el deposito dentro del cual se esta navegando
  CargarDepositoNavegacion(): void {

    this.depositosService.GetDeposito(this.depositoIdNavegacion).subscribe({
      next: (deposito) => {
         this.accessDepositoRequest = deposito;
         this.depositos = new MatTableDataSource([deposito]);
      },
      error: (response) => {
      }
    });
  }

  ClickBotonEditar(row: Deposito): void {

    this.dialog.open(ModalDepositoComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarDepositoNavegacion();
    });
  }

  ClickBotonBuscar(): void {
    this.dialog.open(ModalConsultaInventarioComponent,{
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarDepositoNavegacion();
    });
  }

}
