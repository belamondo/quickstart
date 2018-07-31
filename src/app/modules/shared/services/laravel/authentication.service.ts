import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Settings
 */
import { environment } from './../../../../../environments/environment';

/**
 * RxJs
 */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthenticationService {
  headersToAuth: Headers;
  optionsToAuth: RequestOptions;
  url = environment.urlToOauthToken;
  urlToApi = environment.urlToApi;
  user: any;

  constructor(
    private http: Http
  ) { }

  // Observable  starts
  setUser = () => new Promise((resolve, reject) => {
    this.headersToAuth = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': sessionStorage.getItem('access_token')
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });

    this.http
    .get(
      this.urlToApi + 'user',
      this.optionsToAuth
    )
    .subscribe(res => {
      this.user = JSON.parse(res['_body']);

      if (this.user.id) {
        resolve(this.user);
      } else {
        resolve(false);
      }
    }, error => {
      resolve(false);
    }, () => {

    });
  })

  getUser = () => {
    return this.user;
  }
  // Observable  ends
  getUserMenu = (param) => new Promise((resolve, reject) => {
    this.headersToAuth = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': sessionStorage.getItem('access_token')
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });
    this.http.post(this.urlToApi + param.route, param.data, this.optionsToAuth)
    .subscribe(res => {
      let obj;
      obj = JSON.parse(res['_body']);
      resolve({
        obj
      });
    }, err => {
      console.log(err);
    });
  })

  login = (params) => new Promise((resolve, reject) => {
    let temp;

    this.headersToAuth = new Headers({
      'Access-Control-Allow-Origin': '*'
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });
    // console.log(params.login.value)
    // console.log(params.password.value)
    this.http
    .post(
      this.url,
      {
        'client_id': 2,
        'client_secret': 'EeDEPyKjEIdAxjsB0tfLXUZ0bxtBTLzNCvvdUR6j',
        'grant_type': 'password',
        'username': params.login.value,
        'password': params.password.value
      },
      this.optionsToAuth
    ).subscribe(res => {
      if (res.ok) {
        temp = JSON.parse(res['_body']);
        // console.log(temp);

        sessionStorage.setItem('access_token', 'Bearer ' + temp.access_token);

        resolve({
          cod: 'l-01',
          message: 'Login feito com sucesso'
        });
      }
    }, err => {
      if (err.statusText === 'Unauthorized') {
        resolve({
          cod: 'le-01',
          message: 'ERRO: Login e/ou senha incorretos.'
        });
      }
    }, () => {

    });
  })

  recoverPasswordEmail = (email) => new Promise((resolve, reject) => {
    let emailToResetPassword;
    emailToResetPassword = {
      email: email
    };
    this.http
    .post(
      this.urlToApi + 'password-resets',
      emailToResetPassword
    ).subscribe(res => {
      resolve({
        cod: 'le-02',
        message: 'E-mail enviado.'
      });
    }, err => console.log(err),
    () => console.log(205));
  })
}
