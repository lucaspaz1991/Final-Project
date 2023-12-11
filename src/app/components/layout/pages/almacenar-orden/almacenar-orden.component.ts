import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { OrdenEntrante } from 'src/app/interfaces/orden';
import { ProductoIngresado } from 'src/app/interfaces/productoIngresado';
import { OrdenEntranteService } from 'src/app/services/orden.service';

import { Observer } from 'rxjs';
import { ModalAlmacenamientoComponent } from '../../modales/modal-almacenamiento/modal-almacenamiento.component';

@Component({
  selector: 'app-almacenar-orden',
  templateUrl: './almacenar-orden.component.html', 
  styleUrls: ['./almacenar-orden.component.css']
})
export class AlmacenarOrdenComponent implements OnInit{
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productosIngresados: MatTableDataSource<ProductoIngresado>;
  columnasDesplegadas: string[] = ['productoIngresadoId','nombreProducto','cantidad','orden','idDeposito','acciones']; 
  
  filtroBusqueda: string ='';
  depositoIdNavegacion: any = '';

  ordenes: OrdenEntrante[] = [];

  productoIngresadoId: string ='';

  constructor(
    private ordenEntranteService: OrdenEntranteService,
    private dialog: MatDialog
  ) {
    this.productosIngresados = new MatTableDataSource<ProductoIngresado>([]); // Usa la interfaz ProductoIngresado
  }

  ngOnInit(): void {
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
 
    this.CargarProductosIngresados();

    this.GetOrdenes(this.depositoIdNavegacion);
  }

  // Cargamos los productos que estan ingresados en las ordenes de ingreso
  CargarProductosIngresados(): void {
    this.ordenEntranteService.ObtenerProductosIngresados(this.depositoIdNavegacion).subscribe({
      next: (producto) => {
        this.productosIngresados = new MatTableDataSource(producto);
        this.productosIngresados.paginator = this.paginator;
      },
      error: (response) => {
      }
    });
  }

  // Cargamos todas las ordenes de ingreso
  GetOrdenes(idDeposito: string): void {

    const observer: Observer<OrdenEntrante[]> = {
      next: (ordenes) => {
        this.ordenes = ordenes;
      },
      error: (error) => {
      },
      complete: () => {
      }
    };

    this.ordenEntranteService.ObtenerOrdenes(idDeposito).subscribe(observer);
  }

  // Obtenemos el codigo de una orden de ingreso
  GetCodigoOrden(OrdenEntranteId: string): string {
  
    const orden = this.ordenes.find(item => item.id === OrdenEntranteId);
  
    if (orden && orden.numeroDocumento) {
      return orden.numeroDocumento;
    } else {
      return 'Código no encontrado'; 
    }
  }

  // Abre el modal de Almacenamiento
  ClickBotonAlmacenar(row: ProductoIngresado): void {
    this.dialog.open(ModalAlmacenamientoComponent,{
      disableClose: true,
      data: row
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.CargarProductosIngresados();
    });
  }

}
