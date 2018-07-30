import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/laravel/authentication.service';
import { CrudService } from '../../services/laravel/crud.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ValidateValueComparison } from '../../validators/value-comparison.validator';
import { ValidatePasswordForce } from '../../validators/password-force.validator';
import { ValidateRequired } from '../../validators/required.validator';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordErrors: any;
  checkCurrentPassword: any;
  resetPassForm: FormGroup
  user: any;

  constructor(
    private _crud: CrudService,
    private _router: Router,
    private _snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.resetPassForm = new FormGroup({      
      'newPassword': new FormControl(null),
      'repeatPassword': new FormControl(null),   
    });

    this.resetPassForm.get('newPassword').setValidators([ValidateValueComparison(this.resetPassForm.get('repeatPassword'),
      'Campos nova senha e confirme nova senha precisam ter o mesmo valor'), ValidateRequired, ValidatePasswordForce]);
  }

  onResetPassSubmit = () =>{
    this._crud.read({
      route: 'users',
      get: true,
      where: [{
        field: 'email',
        value: this.data.email
      }]
    })
    .then(res=>{
      //console.log(res)
      let objUser = res['obj'][0];
      this._crud.update({
        route: 'users',
        objectToUpdate: {
          password: this.resetPassForm.get('newPassword').value,
          is_blocked: false,
          attempts: 0
        },
        paramToUpdate: objUser.id
      }).then(resResetedPassword => {
        this._crud.update({
          route: 'password-resets',
          objectToUpdate: {
            is_blocked: true
          },
          paramToUpdate: this.data.id
        }).then(finish => {
          this._snackbar.open("SUCESSO: Salvo com sucesso", '', {
            duration: 5000,
            panelClass: ['success-snackbar']
          })
    
          this.dialogRef.close();
          this._router.navigate(['/']);
        })
      })
    })    
  }

  onPasswordChange = () =>{
    let newpass = this.resetPassForm.value.newpassword
    let repeatpass = this.resetPassForm.value.repeatPassword
   
    if( (newpass && repeatpass)&&( newpass.value!="" && repeatpass.value!="")){
      this.resetPassForm.get('password').setErrors(null);
      this.resetPassForm.get('newPassword').setErrors(null)
      this.passwordErrors = null;
    }         
  }
  onDialogClose = () =>{
    this.dialogRef.close();
  }

}
