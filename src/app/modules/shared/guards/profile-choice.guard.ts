import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Services
 */
import { AuthenticationService } from '../services/firebase/authentication.service';
import { CrudService } from '../services/loopback/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileChoiceGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this._auth.setUser()
      .then(res => {
        if (!res || !res['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          })

          return false;
        }

        this._crud.read({
          route: 'people',
          whereId: res['id']
        }).then(res => {
          if (res['length'] > 0) {
            this._router.navigate(['/main/dashboard'])

            this._snackbar.open('Você já escolheu seu tipo de perfil e não pode alterá-lo.', '', {
              duration: 4000
            })
  
            return false;
          }
        })
      })

    return true;
  }
}
