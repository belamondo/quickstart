import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDatepickerIntl, MatSnackBar } from '@angular/material';

/**
 * Services
 */
import { AuthenticationService } from '../../../shared/services/firebase/authentication.service';
import { CrudService } from '../../../shared/services/firebase/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-choice',
  templateUrl: './profile-choice.component.html',
  styleUrls: ['./profile-choice.component.css']
})
export class ProfileChoiceComponent implements OnInit {
  peopleForm: FormGroup;
  profileChoiceForm: FormGroup;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) {
  }
  
  ngOnInit() {
    this.profileChoiceForm = new FormGroup({
      description: new FormControl(null)
    });
  
    this.peopleForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required)
    });
  }

  onBirthdayChange = (event) => {
    this.peopleForm.get('birthday').setValue(event.targetElement.value);
  }

  onPeopleFormSubmit = () => {
    this._auth.setUser()
      .then(res => {
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
          } else {
            this._crud.update({
              route: 'people',
              whereId: res['id'],
              objectToUpdate: this.peopleForm.value
            }).then(res => {
              this._router.navigate(['/main/dashboard'])

              this._snackbar.open('Perfil cadastrado. Bem vindo.', '', {
                duration: 4000
              })
    
              return true;
            })
          }
        })
      })
  }
}
