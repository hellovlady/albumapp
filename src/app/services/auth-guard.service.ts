import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { take, map } from 'rxjs/operators';

const TOKEN_KEY = 'MyLocalDB';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
      if(!this.authService.getUser()) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    }
}