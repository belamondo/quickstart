import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/**
 * Services
 */
import { AuthenticationService } from './../services/firebase/authentication.service';
import { CrudService } from '../services/firebase/crud.service';
import { MatSnackBar } from '@angular/material';

/**
 * @description Permission to navigate to any route IF there is an user loggedin ELSE force navigation to login route
 *    @extends _auth.setUser() - AuthenticationService method
 *        @returns user object with its id IF there is an user loggedin ELSE false
 *    @extends _auth.router - Router
 *        @returns navigate to login IF there is no user loggedin ELSE user will be allowed to navigate to any route under auth.guard
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot, state:
      RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
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
          if (res['length'] < 1) {
            this._router.navigate(['/main/profile_choice'])
          }
        })
      })

    return true;
  }
}
