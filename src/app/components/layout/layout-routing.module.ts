import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { OrdenComponent } from './pages/orden/orden.component';
import { AlmacenarOrdenComponent } from './pages/almacenar-orden/almacenar-orden.component';
import { DepositoComponent } from './pages/deposito/deposito.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { SeccionComponent } from './pages/seccion/seccion.component';
import { ConsumidorComponent } from './pages/consumidor/consumidor.component';
import { SimuladorComponent } from './pages/simulador/simulador.component';
import { VisualizadorComponent } from './pages/visualizador/visualizador.component';

const routes: Routes = [{

  path:'',
  component:LayoutComponent,
  children: [
    {path:':id/productos',component:ProductoComponent},
    {path:':id/ordenesIngreso',component:OrdenComponent},
    {path:':id/ordenesAlmacenar',component:AlmacenarOrdenComponent},
    {path:':id/deposito',component:DepositoComponent},
    {path:':id/empleados',component:EmpleadoComponent},
    {path:':id/proveedores',component:ProveedorComponent},
    {path:':id/secciones',component:SeccionComponent},
    {path:':id/consumidores',component:ConsumidorComponent},
    {path:':id/simulador',component:SimuladorComponent},
    {path:':id/visualizador',component:VisualizadorComponent},

    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
