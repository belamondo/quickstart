import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';

/**
 * Services
 */
import { AuthenticationService } from './../../../shared/services/loopback/authentication.service';
import { CrudService } from './../../../shared/services/loopback/crud.service';

/**
 * Validators
 */
import { ValidateCpf } from '../../../shared/validators/cpf.validator';
import { ValidateCnpj } from '../../../shared/validators/cnpj.validator';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  mask: any = {
    cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/],
    date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
    cell_phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/]
  };
  public paramsToTableData: any;
  public playgroundForm: FormGroup;
  public playgroundValidatorsForm: FormGroup;
  public tableDataError: any;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService
  ) { }

  ngOnInit() {
    this.playgroundForm = new FormGroup({
      'weight': new FormControl(null),
      'height': new FormControl(null),
      'age': new FormControl(null),
      'biologicalSex': new FormControl(null)
    })

    this.playgroundValidatorsForm = new FormGroup({
      'cpf': new FormControl(null, ValidateCpf),
      'cnpj': new FormControl(null, ValidateCnpj)
    })
  }

  clearForm = (playgroundFormDirective: FormGroupDirective) => {    
    playgroundFormDirective.reset();
    playgroundFormDirective.resetForm();
  }

  clearValidatorForm = (playgroundValidatorsFormDirective: FormGroupDirective) => {    
    playgroundValidatorsFormDirective.reset();
    playgroundValidatorsFormDirective.resetForm();
  }

  onPlaygroundFormSubmit = () => {
    let imc = this.playgroundForm.value.weight / (this.playgroundForm.value.height*this.playgroundForm.value.height);
    if(imc < 18.5) {
      console.log("Você é quase uma ameba")
    }
    
    if((imc > 18.5) && (imc < 24.9)) {
      console.log("Você tá de boa")
    }

    if((imc > 24.9) && (imc < 29.9)) {
      console.log("Gordinho gostoso")
    }

    if(imc > 30) {
      console.log("Você é uma porca gorda")
    }
    // this._crud
    // .create({
    //   route: 'Companies',
    //   objectToCreate: this.playgroundForm.value
    // })
  }

  onPlaygroundValidatorsFormSubmit = () => {
    let cnpj = this.playgroundValidatorsForm.value.cnpj.replace(/[./-]/g, '');
    console.log(cnpj);
    
    this._crud
    .read({
      externalRoute: 'https://www.receitaws.com.br/v1/cnpj/'+cnpj
    }).then(res => {
      console.log(res)
    })
  }
}
