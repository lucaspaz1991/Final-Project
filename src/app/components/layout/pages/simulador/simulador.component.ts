import { Component, OnInit } from '@angular/core';
import { DepositoService } from 'src/app/services/deposito.service';
import { Deposito } from 'src/app/interfaces/deposito';
import Swal from 'sweetalert2';
import { curveLinear } from 'd3-shape';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Movimiento {
    dia: number;
    cantidad: number;
    tipo: 'ingreso' | 'salida';
}

@Component({
    selector: 'app-simulador',
    templateUrl: './simulador.component.html',
    styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent implements OnInit {
    depositos: Deposito[] = [];
    DepositoSeleccionado: string = "";
    diasProyeccion: number = 30;
    tasaCrecimiento: number = 0.0;
    chartData: any[] = [];
    colorScheme = 'vivid';
    legendTitle: string = "";
    curve: any = curveLinear;
    movimientos: Movimiento[] = [];
    movimientoDia: number = 0;
    movimientoCantidad: number = 0;
    movimientoTipo: 'ingreso' | 'salida' = 'ingreso';
    showLegend = true;

    constructor(private depositoService: DepositoService) {}

    ngOnInit() {

        this.CargarDeposito();
    }

    // Carga los datos del deposito
    private CargarDeposito() {
        this.depositoService.GetAllDepositos()
            .pipe(catchError(error => {
                this.MostrarError('Error al cargar los depósitos.');
                return throwError(error);
            }))
            .subscribe((depositos: Deposito[]) => {
                this.depositos = depositos;
            });
    }

    // Carga el grafico del simulador
    SimularDeposito() {
        if (this.DepositoSeleccionado) {
            const found = this.depositos.find(d => d.id === this.DepositoSeleccionado);
            if (found) {
                this.CalcularGrafico(found);
            } else {
                this.MostrarError('Depósito no encontrado.');
            }
        } else {
            this.MostrarError('Selecciona un depósito.');
        }
    }

    // Genera la información a desplegar en el gráfico
    private CalcularGrafico(deposito: Deposito) {

        if (deposito.ocupacionActual < 0 || deposito.capacidadMaxima < 0) {
            this.MostrarError('La ocupación actual y la capacidad máxima deben ser valores no negativos.');
            return;
        }

        const proyeccion = [];
        let ocupacionDia = deposito.ocupacionActual;

        for (let i = 0; i < this.diasProyeccion; i++) {
            ocupacionDia += (this.tasaCrecimiento / 100) * ocupacionDia;

            this.movimientos.forEach(movimiento => {
                if (movimiento.dia === i + 1) {
                    if (movimiento.tipo === 'ingreso') {
                        ocupacionDia += movimiento.cantidad;
                    } else if (movimiento.tipo === 'salida') {
                        ocupacionDia -= movimiento.cantidad;
                    }
                }
            });

            // Aseguramos que la ocupación no sea menor que 0 ni mayor que la capacidad máxima
            ocupacionDia = Math.max(0, Math.min(ocupacionDia, deposito.capacidadMaxima));

            proyeccion.push({ name: `Día ${i + 1}`, value: ocupacionDia });
            

            // Verificar si la ocupación excede la capacidad máxima
            if (ocupacionDia >= deposito.capacidadMaxima) {
                this.mostrarAlertaCapacidadExcedida(i + 1, deposito.capacidadMaxima);
                break; // Detener la proyección si se supera la capacidad
            }
        }

        this.chartData = [
            { name: 'Ocupación Actual (m²)', series: [{ name: 'Día 1', value: deposito.ocupacionActual }] },
            { name: 'Capacidad Máxima (m²)', series: Array.from({ length: this.diasProyeccion }).map((_, index) => ({ name: `Día ${index + 1}`, value: deposito.capacidadMaxima })) },
            { name: 'Proyección (m²)', series: proyeccion }
        ];

        this.legendTitle = `Depósito: ${deposito.codigo}`;
    }

    // Aviso de capacidad excedida
    private mostrarAlertaCapacidadExcedida(dia: number, capacidadMaxima: number) {
        Swal.fire({
            icon: 'warning',
            title: 'Capacidad Excedida',
            text: `La ocupación del depósito ha excedido su capacidad máxima el día ${dia}. Capacidad máxima: ${capacidadMaxima} m²`,
        });
    }

    // Agergar movimientos a calcular en CalcularGrafico
    AgregarMovimiento() {
        if (this.movimientoDia <= 0 || this.movimientoDia > this.diasProyeccion) {
            this.MostrarError('El día del movimiento no es válido.');
            return;
        }

        if (this.movimientoCantidad < 0) {
            this.MostrarError('La cantidad del movimiento debe ser un valor no negativo.');
            return;
        }

        const movimiento: Movimiento = {
            dia: this.movimientoDia,
            cantidad: this.movimientoCantidad,
            tipo: this.movimientoTipo
        };

        Swal.fire({
            icon: 'success',
            title: 'Movimiento agregado',
            text: 'El movimiento ha sido agregado exitosamente'
        });
        
        this.movimientos.push(movimiento);
        this.SimularDeposito();

        
    }

    // Borra movimientos a calcular en CalcularGrafico
    BorrarMovimiento(index: number) {
        this.movimientos.splice(index, 1);
        this.SimularDeposito();

        Swal.fire({
            icon: 'success',
            title: 'Movimiento eliminado',
            text: 'El movimiento ha sido eliminado exitosamente'
        });
    }

    // Boton para resetear la simulacion
    ResetearSimulacion() {
        this.movimientos = [];
        this.chartData = [];
        this.legendTitle = '';
        this.DepositoSeleccionado = '';
        this.tasaCrecimiento = 0.0;
        this.diasProyeccion = 30;
        this.movimientoDia = 0;
        this.movimientoCantidad = 0;
        this.movimientoTipo = 'ingreso';
    }

    private MostrarError(message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });
    }
}