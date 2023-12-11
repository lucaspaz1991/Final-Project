import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  // Guarda para asegurar que se inicie sesion por un usuario válido, para poder acceder a las funciones de la aplicación
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.EstaAutenticado()) {
      return true;
    }
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    return this.router.navigate(["login"]);
  }

}

