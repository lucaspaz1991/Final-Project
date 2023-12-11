import { Component, OnInit  } from '@angular/core';

import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { SeccionService } from 'src/app/services/seccion.service';
import { SeccionProductos } from 'src/app/interfaces/seccion-productos';
import { OrdenEntranteService } from 'src/app/services/orden.service';

@Component({
  selector: 'app-modal-consulta-seccion',
  templateUrl: './modal-consulta-seccion.component.html',
  styleUrls: ['./modal-consulta-seccion.component.css']
})
export class ModalConsultaSeccionComponent implements OnInit{

  columnasDesplegadas2: string[] = ['codigo','nombreProducto','cantidadEnStock','costos','volumen']; 

  // Declaramos arreglo de objetos (Seccion y arreglo de SeccionProductos)
  prueba: { seccion: Seccion | null; productos: SeccionProductos[] }[] = [];

  secciones: Seccion[] = [];
  productos: Producto[] = [];

  seccionesConProductos: SeccionProductos[] = [];

  depositoIdNavegacion: any = '';

  constructor(
    private productosService: ProductoService,
    private ordenService: OrdenEntranteService,
    private seccionesService: SeccionService
  ) {}

  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');

    this.CargarProductosSeccion();
    this.CargarSecciones();
    this.CargarProductos();
  }

// Carga todos los productos de este deposito
CargarProductos(): void {
    this.productosService.GetAllProductos(this.depositoIdNavegacion).subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

// Carga todas las secciones de este deposito
CargarSecciones(): void {
  this.seccionesService.GetAllSecciones(this.depositoIdNavegacion).subscribe({
    next: (secciones) => {
      this.secciones = secciones;
    },
    error: (response) => {
      console.log(response);
    }
  });
}

// Carga todos los productos ingresados en secciones de este deposito
CargarProductosSeccion(): void {
  this.ordenService.ObtenerProductosAlmacenados(this.depositoIdNavegacion).subscribe({
    next: (productos) => {
      this.prueba = this.AgruparProductosPorSeccion(productos);

    },
    error: (error) => {
    }
  });
}

// Agrupamos productos por seccion
private AgruparProductosPorSeccion(productos: SeccionProductos[]): { seccion: Seccion | null; productos: SeccionProductos[] }[] {
  const grouped: { [key: string]: SeccionProductos[] } = {};

  productos.forEach((producto) => {
    const key = producto.idSeccion;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(producto);
  });

  return Object.keys(grouped).map((key) => ({
    seccion: this.secciones.find((seccion) => seccion.id === key) || null,
    productos: grouped[key]
  }));
}

// Obtenemos dimensiones de un producto
GetDimensionProducto(idProducto: string): number {

  const producto = this.productos.find(item => item.id === idProducto);

  if (producto && producto.dimensiones) {
    return producto.dimensiones;
  } else {
    return 0; 
  }
}


}
