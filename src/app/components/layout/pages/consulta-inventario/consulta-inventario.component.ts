import { Component, OnInit } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';

import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-consulta-inventario',
  templateUrl: './consulta-inventario.component.html',
  styleUrls: ['./consulta-inventario.component.css']
})
export class ConsultaInventarioComponent implements OnInit{

  depositos: MatTableDataSource<Deposito>;

  productos: MatTableDataSource<Producto>;
  columnasDesplegadas: string[] = ['nombre','categoria','cantidadEnStock',
  'precio','volumen','costos','acciones']; 

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
    private productosService: ProductoService,
  ) {
    this.depositos = new MatTableDataSource<Deposito>([]); // Usa la interfaz Deposito
    this.productos = new MatTableDataSource<Producto>([]); // Usa la interfaz Producto

  }

  ngOnInit(): void {
    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.CargarDepositoNavegacion();
    this.CargarProductos();
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

  // Carga todos los productos de este deposito
  CargarProductos(): void {

    this.productosService.GetAllProductos(this.depositoIdNavegacion).subscribe({
      next: (producto) => {
        this.productos = new MatTableDataSource(producto);
      },
      error: (response) => {
      }
    });
  }

  verProducto(row: Producto):void {

  }

}
