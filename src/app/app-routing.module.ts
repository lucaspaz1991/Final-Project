import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { AuthGuard } from './components/auth.guard';

const routes: Routes = [
  {path:'',component:LoginComponent,pathMatch:"full"},
  {path:'login',component:LoginComponent,pathMatch:"full"},
  {path:'recuperar-contrasena',component: RecuperarContrasenaComponent},
  {path:'pages',loadChildren: () => import("./components/layout/layout.module").then(m => m.LayoutModule),canActivate: [AuthGuard]},
  {path:'pre-pages',loadChildren: () => import("./components/pre-layout/pre-layout.module").then(m => m.PreLayoutModule),canActivate: [AuthGuard]},
  {path:'**',redirectTo:'login',pathMatch:"full"},
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
