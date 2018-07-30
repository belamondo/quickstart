import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Services*/
import { AuthenticationService } from './../../services/laravel/authentication.service';

@Component({
  selector: 'ntm-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  isLoading = true;
  msg;
  forgotPasswordForm: FormGroup;
  
  constructor(
    private authentication: AuthenticationService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private router: Router,
    public mdsnackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forgotPasswordForm = new FormGroup({
      'field_0_email': new FormControl('', [Validators.email, Validators.required])
    });
  }

  ngOnInit() {

  }

  close = () => {
    this.dialogRef.close();
  }
  
  forgotPassword = () => {
    let email;
    
    email = this.forgotPasswordForm.controls['field_0_email'].value;
    
    this.authentication.recoverPasswordEmail(email)
    .then(res => {
      this.msg = res;

      this.mdsnackbar.open(this.msg.message, '', {
        duration: 2000
      });
      
      if (this.msg.cod == "rpe-01") {
        this.router.navigate(['/login']);
      }

      this.dialogRef.close();
    });
  }
}
