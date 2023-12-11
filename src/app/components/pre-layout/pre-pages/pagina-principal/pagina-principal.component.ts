import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent implements OnInit {

  usuario: string | null = sessionStorage.getItem('usuario');
  idRol: string | null = sessionStorage.getItem('idRol');
 

  constructor() { }

  ngOnInit(): void {

  }
}