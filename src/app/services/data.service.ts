import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private depositoIdNavegacion: string | null = null;

  SetearIdDepositoNavegacion(id: string): void {
    this.depositoIdNavegacion = id;
  }

  GetDepositoIdNavegacion(): string | null {
    return this.depositoIdNavegacion;
  }

}
