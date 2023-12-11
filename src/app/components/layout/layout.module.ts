import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { AlmacenarOrdenComponent } from './pages/almacenar-orden/almacenar-orden.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { OrdenComponent } from './pages/orden/orden.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { DepositoComponent } from './pages/deposito/deposito.component';
import { SeccionComponent } from './pages/seccion/seccion.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ConsumidorComponent } from './pages/consumidor/consumidor.component';

import { SharedModule } from 'src/app/reutilizable/shared/shared.module';
import { ModalProductoComponent } from './modales/modal-producto/modal-producto.component';
import { ModalDepositoComponent } from './modales/modal-deposito/modal-deposito.component';
import { ModalEmpleadoComponent } from './modales/modal-empleado/modal-empleado.component';
import { ModalProveedorComponent } from './modales/modal-proveedor/modal-proveedor.component';
import { ModalSeccionComponent } from './modales/modal-seccion/modal-seccion.component';
import { ModalConsumidorComponent } from './modales/modal-consumidor/modal-consumidor.component';
import { ModalAlmacenamientoComponent } from './modales/modal-almacenamiento/modal-almacenamiento.component';
import { ConsultaInventarioComponent } from './pages/consulta-inventario/consulta-inventario.component';
import { ModalConsultaInventarioComponent } from './modales/modal-consulta-inventario/modal-consulta-inventario.component';
import { ModalConsultaSeccionComponent } from './modales/modal-consulta-seccion/modal-consulta-seccion.component';
import { SimuladorComponent } from './pages/simulador/simulador.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VisualizadorComponent } from './pages/visualizador/visualizador.component';
import {CdkDrag} from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    AlmacenarOrdenComponent,
    ProductoComponent,
    OrdenComponent,
    ProveedorComponent,
    DepositoComponent,
    SeccionComponent,
    EmpleadoComponent,
    ConsumidorComponent,
    ModalProductoComponent,
    ModalDepositoComponent,
    ModalEmpleadoComponent,
    ModalProveedorComponent,
    ModalSeccionComponent,
    ModalConsumidorComponent,
    ModalAlmacenamientoComponent,
    ConsultaInventarioComponent,
    ModalConsultaInventarioComponent,
    ModalConsultaSeccionComponent,
    SimuladorComponent,
    VisualizadorComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    NgxChartsModule,
    CdkDrag
    
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
