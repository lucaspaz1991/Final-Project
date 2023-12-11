import { Component } from '@angular/core';
import { SeccionService } from 'src/app/services/seccion.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { DepositoService } from 'src/app/services/deposito.service';
import { Deposito } from 'src/app/interfaces/deposito';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css',]
})
export class VisualizadorComponent {
  secciones: Seccion[] = [];
  primerMovimiento: { [key: string]: boolean } = {};
  primerosMovimientos: { [key: string]: boolean } = {};
  depositoIdNavegacion: any = '';
  dragEnabled: { [key: string]: boolean } = {};

  accessDepositoRequest: Deposito = {
    id: '',
    codigo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    capacidadMaxima: 0,
    ocupacionActual: 0,
    capacidadActual: 0,
    fechaCreacion: '',
  };

  anchoDeposito: number = 0;

  seccionPopup: Seccion | null = null;

  constructor(private seccionesService: SeccionService, private depositosService: DepositoService) {}

  ngOnInit(): void {

    this.depositoIdNavegacion = localStorage.getItem('depositoIdNavegacion');
    this.CargarDepositoNavegacionYSecciones();
  }

  // Resetea la posicion de las secciones
  ResetearPosicion(event: MouseEvent, codigo: string) {
    if (!this.primerosMovimientos[codigo]) {
      const exampleBox = event.target as HTMLElement;
      if (exampleBox) {
        exampleBox.style.transform = 'translate(550px, 0)';
        this.primerosMovimientos[codigo] = true;
        this.dragEnabled[codigo] = true;
      }
    }
  }

  CalcularAncho(seccion: Seccion): number {
    return 500;
  }

  // Calcula el alto de la sección en funcion de las dimensiones del deposito
  CalcularAlto(seccion: Seccion) {
    const lado = seccion.capacidadMaxima / this.anchoDeposito;
    const ladoRedondeado = +lado.toFixed(2);
    const alto = Math.floor((ladoRedondeado * 500) / this.anchoDeposito);
    return alto;
  }

  // Genera los componentes gráficos para la interaccion del cliente
  CargarDepositoNavegacionYSecciones(): void {
    this.depositosService
      .GetDeposito(this.depositoIdNavegacion)
      .pipe(
        switchMap((deposito) => {
          this.accessDepositoRequest = deposito;
          this.anchoDeposito = Math.sqrt(this.accessDepositoRequest.capacidadMaxima);
          this.anchoDeposito = +this.anchoDeposito.toFixed(2);
          return this.seccionesService.GetAllSecciones(this.depositoIdNavegacion);
        })
      )
      .subscribe({
        next: (secciones) => {
          this.secciones = secciones;
          this.secciones.forEach((seccion) => {
            this.primerMovimiento[seccion.codigo] = false;
            seccion.width = this.CalcularAncho(seccion).toString();
            seccion.height = this.CalcularAlto(seccion).toString();
          });
        },
        error: (response) => {
        },
      });
  }

  // Muestra los detalles de cada seccion al pasar el mouse sobre ellas
  MostrarDetallesSeccion(seccion: Seccion): void {
    this.seccionPopup = seccion;
  }

  // Oculta los detalles de la seccion
  OcultarDetallesSeccion(): void {
    this.seccionPopup = null;
  }
}