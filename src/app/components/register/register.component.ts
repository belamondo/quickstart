
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../../modules/shared/services/laravel/authentication.service';
import { CrudService } from './../../modules/shared/services/laravel/crud.service';
// import { WindowService } from '../../modules/shared/services/window.service';
import { ValidateCnpj } from '../../modules/shared/validators/cnpj.validator';
import { ValidateCpf } from '../../modules/shared/validators/cpf.validator';
import { ValidateRequired } from '../../modules/shared/validators/required.validator';
import { ValidateValueComparison } from '../../modules/shared/validators/value-comparison.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public typeForm = true;
  public mask: any;
  public registerForm: FormGroup;
  public contactForm: FormGroup;
  public addressForm: FormGroup;
  public stateArray: any;
  public citiesArray: any;
  public contactsArray: any;
  public addressesArray: any;
  public personArray: any;
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public user: any;
  public phoneErrors: any;
  public contactControl: any;

  constructor(
    private _fb: FormBuilder,
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    // private _windowService: WindowService,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.user = this.data;
    // this._windowService.width$
    // .subscribe(res => {
    //   if (res < 500) {
    //     this.widthQuarter = 'form-pattern';
    //     this.widthThird = 'form-pattern';
    //     this.widthHalf = 'form-pattern';
    //   } else if (res < 800) {
    //     this.widthQuarter = 'form-pattern-half';
    //     this.widthThird = 'form-pattern';
    //     this.widthHalf = 'form-pattern';
    //   } else {
    //     this.widthQuarter = 'form-pattern-quarter';
    //     this.widthThird = 'form-pattern-third';
    //     this.widthHalf = 'form-pattern-half';
    //   }
    // });

    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cell_phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };

    this.registerForm = new FormGroup({
      'person_type_id': new FormControl(1),
      'name': new FormControl(null),
      'email': new FormControl(null, [Validators.email, ValidateRequired]),
      'password': new FormControl(null, ValidateRequired),
      'repeatPassword': new FormControl(null, ValidateRequired),
      'document_number': new FormControl(null, ValidateRequired),
      'social_name': new FormControl(null),
      'fantasy_name': new FormControl(null),
      'key': new FormControl(this.data.key),
      'contacts': this._fb.array([
        this.initContact(),
      ]),
      'addresses': this._fb.array([
        this.initAddress(),
      ])
    });

    this.registerForm.get('password').setValidators([ValidateValueComparison(this.registerForm.get('repeatPassword'),
    'Campos nova senha e confirme nova senha precisam ter o mesmo valor'), ValidateRequired]);

    this.registerForm.controls.name.setValidators(ValidateRequired);
    this.registerForm.controls['name'].updateValueAndValidity();

    this.listStates();
    this.listCities();

    this._crud.read({route: 'contacts-types', order: ['description', 'asc']})
    .then(res => {
      this.contactsArray = res['obj'];
    });

    this._crud.read({route: 'addresses-types', order: ['description', 'asc']})
    .then(res => {
      this.addressesArray = res['obj'];
    });

    this._crud.read({route: 'users-types', order: ['description', 'asc']})
    .then(res => {
      this.personArray = res['obj'];
    });
  }

  initContact() {
    return this._fb.group({
      'contact_type_id': new FormControl(null, ValidateRequired),
      'description': new FormControl(null, ValidateRequired)
    });
  }

  initAddress() {
    return this._fb.group({
      'address_type_id': new FormControl(null, ValidateRequired),
      'place': new FormControl(null, ValidateRequired),
      'neighborhood': new FormControl(null, ValidateRequired),
      'postal_code': new FormControl(null, ValidateRequired),
      'city_id': new FormControl(null, [ValidateRequired]),
      'state_id': new FormControl(null, [ValidateRequired])
    });
  }

  addContact() {
    const contactArray = <FormArray>this.registerForm.controls['contacts'];
    const newContact = this.initContact();

    contactArray.push(newContact);
  }

  removeContact(i: number) {
    const control = <FormArray>this.registerForm.controls['contacts'];
    control.removeAt(i);
  }

  addAddress() {
    const addressArray = <FormArray>this.registerForm.controls['addresses'];
    const newAddress = this.initAddress();

    addressArray.push(newAddress);
  }

  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.registerForm.controls['addresses'];
    control.removeAt(i);
  }

  close = () => {
    this.dialogRef.close();
  }

  listStates = () => {
    const params = {
      route: 'states', order: ['description', 'asc']
    };

    this._crud.read(params)
    .then(res => {
      this.stateArray = res['obj'];
    });
  }

  listCities = () => {
    const params = {
      route: 'cities', order: ['description', 'asc']
    };

    this._crud.read(params)
    .then(res => {
      this.citiesArray = res['obj'];
    });
  }

  onRegisterSubmit = () => {
    delete this.registerForm.value['repeatPassword'];

    const params = {
      route: 'invite',
      objectToCreate: this.registerForm.value
    };

    this._crud.create(params)
    .then(res => {
      const retorno: any = res;
      if (retorno.apiBody.status === 'ERROR')
        this._snackbar.open(retorno.apiBody.message, '', {
          duration: 4000,
          //extraClasses: ['error-snackbar']
        });
      else {
        this.dialogRef.close();
        this._snackbar.open(retorno.apiBody.message, '', {
          duration: 4000,
          //extraClasses: ['success-snackbar']
        });
      }
    }, rej => {
      this._snackbar.open(rej['message'], '', {
        duration: 3000,
        //extraClasses: ['error-snackbar']
      });
    });
  }

  choose = (evt) => {
    this.registerForm.reset();
    this.registerForm.controls.person_type_id.setValue(evt.value);
    this.registerForm.controls.key.setValue(this.data.key);
    this.registerForm.controls['contacts'] = this._fb.array([this.initContact()]);
    this.registerForm.controls['addresses'] = this._fb.array([this.initAddress()]);
    if (evt.value === 2) {
      this.typeForm = false;
      this.registerForm.controls['name'].setValidators(null);
      this.registerForm.controls['name'].updateValueAndValidity();
      this.registerForm.controls['document_number'].setValidators([ValidateRequired, ValidateCnpj]);
      this.registerForm.controls['document_number'].updateValueAndValidity();
      this.registerForm.controls['social_name'].setValidators(ValidateRequired);
      this.registerForm.controls['social_name'].updateValueAndValidity();
      this.registerForm.controls['fantasy_name'].setValidators(ValidateRequired);
      this.registerForm.controls['fantasy_name'].updateValueAndValidity();

    } else {
      this.registerForm.controls['name'].setValidators(ValidateRequired);
      this.registerForm.controls['name'].updateValueAndValidity();
      this.registerForm.controls['document_number'].setValidators([ValidateRequired, ValidateCpf]);
      this.registerForm.controls['document_number'].updateValueAndValidity();
      this.registerForm.controls['social_name'].setValidators(null);
      this.registerForm.controls['social_name'].updateValueAndValidity();
      this.registerForm.controls['social_name'].setValidators(null);
      this.registerForm.controls['fantasy_name'].updateValueAndValidity();
      this.typeForm = true;
    }
  }
}
