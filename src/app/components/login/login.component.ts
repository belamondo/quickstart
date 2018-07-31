import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

/**
 * Services
 */
import { AuthenticationService } from './../../modules/shared/services/laravel/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public disabled: boolean;

  public loginForm: FormGroup;

  constructor(
    private _auth: AuthenticationService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.disabled = false;

    this.loginForm = new FormGroup({
      user: new FormControl(null),
      password: new FormControl(null)
    });
  }

  onLoginSubmit = () => { 
    // this.disabled = true;
    let params = {
      login: this.loginForm.get('user'),
      password: this.loginForm.get('password'),
      loginMode: 'emailAndPassword',
      navigateTo: '/main'
    };

    this._auth
    .login(params)
    .then(res => {
      const string = JSON.stringify(res);
      const json = JSON.parse(string);
      if (json.cod === 'l-01') {
        this._snackbar.open(json.message, '', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this._router.navigate(['/main']);
      }
    }).catch( rej => {
      setTimeout(()  => {
        this.disabled = false;
      }, 3000);
    });
  }
}
