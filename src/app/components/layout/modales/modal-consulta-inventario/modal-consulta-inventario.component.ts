import { Component, OnInit  } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';

import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-modal-consulta-inventario',
  templateUrl: './modal-consulta-inventario.component.html',
  styleUrls: ['./modal-consulta-inventario.component.css']
})
export class ModalConsultaInventarioComponent implements OnInit{

  productos: MatTableDataSource<Producto>;
  columnasDesplegadas: string[] = ['nombre','categoria','cantidadEnStock',
  'precio','costos','volumen']; 

  depositoIdNavegacion: any = '';

  constructor(
    private productosService: ProductoService,
  ) {
    this.productos = new MatTableDataSource<Producto>([]); // Usa la interfaz Producto

  }
  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    console.log('Deposito logueado:', this.depositoIdNavegacion);

    this.CargarProductos();
  }

  // Carga todos los productos de este deposito
  CargarProductos(): void {
    this.productosService.GetAllProductos(this.depositoIdNavegacion).subscribe({
      next: (producto) => {
        this.productos = new MatTableDataSource(producto);
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

}
