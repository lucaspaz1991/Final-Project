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
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  // Guarda para controlar el acceso a la gestión de usuarios - Nombre en ingles por convencion
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.EsAdmin()) {
      return true;
    }
    // Si el usuario no es Admin, redirige a la página home
    return this.router.navigate(['pre-pages', 'home']);
  }

}