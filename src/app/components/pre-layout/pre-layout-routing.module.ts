import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreLayoutComponent } from './pre-layout.component';
import { UsuarioComponent } from './pre-pages/usuario/usuario.component';
import { DepositosComponent } from './pre-pages/depositos/depositos.component';
import { MiPerfilComponent } from './pre-pages/mi-perfil/mi-perfil.component';
import { PaginaPrincipalComponent } from './pre-pages/pagina-principal/pagina-principal.component';
import { AdminGuard } from '../admin.guard';



const routes: Routes = [{

path:'',
component:PreLayoutComponent,
children: [
  {path:'usuarios',component:UsuarioComponent, canActivate: [AdminGuard]},
  {path:'depositos',component:DepositosComponent},
  {path:'mi-perfil',component:MiPerfilComponent},
  {path:'home',component:PaginaPrincipalComponent},
]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreLayoutRoutingModule { }
