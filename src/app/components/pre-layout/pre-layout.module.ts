import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreLayoutRoutingModule } from './pre-layout-routing.module';
import { DepositosComponent } from './pre-pages/depositos/depositos.component';
import { UsuarioComponent } from './pre-pages/usuario/usuario.component';

import { SharedModule } from 'src/app/reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './modales/modal-usuario/modal-usuario.component';
import { ModalDepositoComponent } from './modales/modal-deposito/modal-deposito.component';
import { MiPerfilComponent } from './pre-pages/mi-perfil/mi-perfil.component';
import { PaginaPrincipalComponent } from './pre-pages/pagina-principal/pagina-principal.component';


@NgModule({
  declarations: [
    DepositosComponent,
    UsuarioComponent,
    ModalDepositoComponent,
    ModalUsuarioComponent,
    MiPerfilComponent,
    PaginaPrincipalComponent
  ],
  imports: [
    CommonModule,
    PreLayoutRoutingModule,
    SharedModule
  ]
})
export class PreLayoutModule { }
