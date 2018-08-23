import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CrudService } from '../../../shared/services/laravel/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, MatDialog } from '@angular/material';

import { SnackBarService } from '../../../shared/services/snackbar.service';
import { ValidateValueComparison } from '../../../shared/validators/value-comparison.validator';
import { ValidateRequired } from '../../../shared/validators/required.validator';
// import { AdDialogComponent } from '../ad-dialog/ad-dialog.component';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  diameter = 5;
  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;
  public progress = false;
  public userRegisterForm: FormGroup;
  public mask: any;
  public ufArray: any;
  public profileArray: any;
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public show = true;
  public permissionEdit: Array<any> = [];
  public permissions: Array<any> = [];
  public chengePassword = true;
  public status = 'Ativo';
  public title: string;
  public menus: any;
  public rules: any;
  public user: any;
  public loading: boolean;
  public menuRules: any;
  public paramToSearch: any;
  public submitButton: string;
  private isInstanceVisible;
  public userProfiles: Array<any> = [];

  constructor(
    public snackBarService: SnackBarService,
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, ],
      cell_phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };

    this.userRegisterForm = new FormGroup({
      'name': new FormControl(null, [ValidateRequired, Validators.maxLength(191)]),
      'email': new FormControl(null, [ValidateRequired, Validators.maxLength(191), Validators.email]),
      'password': new FormControl(null),
      'repeatPassword': new FormControl(null, ValidateRequired),
      'access_profiles': new FormControl(null, [ValidateRequired]),
      'is_active': new FormControl(true),
      'change_password': new FormControl(false)
    });

    this.userRegisterForm.get('password').setValidators([ValidateValueComparison(this.userRegisterForm.get('repeatPassword'),
      'Campos senha e repetir senha precisam ter o mesmo valor'), ValidateRequired]);

    this.userRegisterForm.controls.name.setValidators([ValidateRequired]);
    this.userRegisterForm.controls['name'].updateValueAndValidity();

    this.listProfiles();

    this.listMenuNotTrashed();

    this.userFormInit();
  }

  active = (event) => {
    if (event.checked) {
      this.status = 'Ativo';
    } else {
      this.status = 'Inativo';
    }
  }

  userFormInit = () => {

    this.user = {
      menu_rules : [],
      access_profiles: []
    };
    this._crud
    .newRead({route: 'menu/rules'}).then(res => {
      this.menuRules = res['obj'];
    });
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar usuário';
        this.submitButton = 'Atualizar';
        this.userRegisterForm.controls['password'].setValidators(null);
        this.userRegisterForm.controls['repeatPassword'].setValidators(null);
        let param;
        param = this.paramToSearch.replace(':', '');

        this._crud
        .read({route: 'users/' + param}).then(res => {
          this.loading = false;
          this.user = res['obj'];
          if (res['obj'].is_user_ad) {this.chengePassword = false; }
          this.status = res['obj'].is_active ? 'Ativo' : 'Inativo';
          res['obj'].change_password = false;
          res['obj'].is_active = res['obj'].is_active ? true : false;
          this.permissionEdit = res['obj'].menu_rules;
          this.show = false;
          this.userRegisterForm.patchValue(res['obj']);
        });
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastrar Usuário';
        this.submitButton = 'Salvar';

      }
    });
  }

  // Retorna o id da relação entre menu e regra
  ruleMenu(verify_menu, verify_rule) {
    const res =  this.menuRules.filter(r => r.rule_id.toString() === verify_rule.toString()
    && r.menu_id.toString() === verify_menu.toString());
    return res;
  }

  listProfiles = () => {
    this._crud.read({route: 'profile'}).then(res => {
      this.loading = false;
      this.profileArray = res['obj'];
    });
  }

  listMenuNotTrashed = () => {
    let rules = [];
    let menuRules;
      this._crud.read({route: 'rules'}).then(res => {
      this.rules = res['obj'];
      rules = res['obj'];
      this._crud.read({route: 'menu'}).then(res2 => {
        this.menus = res2['obj'];
        for (let i = 0; i < this.menus.length; i++) {
          menuRules = JSON.stringify(rules);
          this.menus[i].rules = JSON.parse(menuRules);
          for (let index = 0; index < rules.length; index++) {
            this.menus[i].rules[index]._checked = false;
            for (let j = 0; j < this.permissionEdit.length; j++) {
              if (this.permissionEdit[j].rule_id ===  this.menus[i].rules[index].id &&
                this.menus[i].id === this.permissionEdit[j].menu_id) {
                this.menus[i].rules[index]._checked = true;
              }
            }
          }
        }
      });
    });
  }

  fillCheckboxes = (status) => {
    const myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
        myCheckboxes[i]._checked = status;
    }
  }

  userHasMenuRule(user, verify_menu, verify_rule) {
    return user.menu_rules.filter(r => r.rule_id === verify_rule && r.menu_id === verify_menu).length >= 1
    || user.access_profiles.filter
    (a => a.menu_rules.filter(r => r.rule_id === verify_rule && r.menu_id === verify_menu).length >= 1).length >= 1;
  }
  userMenuRule(rules, verify_menu, verify_rule) {
    return rules.filter(r => r.rule_id === verify_rule && r.menu_id === verify_menu)[0];
  }

  userHasProfile = (user, profile) => {
    this.loading = false;
    const res = user.access_profiles.filter(p => p.id === profile.id);
    return res;
  }

  onUserSubmit = (formDirective: FormGroupDirective) => {

    delete this.userRegisterForm.value['repeatPassword'];
    if (this.submitToUpdate) {
      delete this.userRegisterForm.value['password'];
      this.userRegisterForm.value.access_profiles = this.user.access_profiles.map(profile => profile.id);
      this.userRegisterForm.value.menu_rules = this.user.menu_rules.map(r => JSON.stringify(r));
      let params;
      params = {
        route: 'users',
        objectToUpdate: this.userRegisterForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
      params.objectToUpdate.id = this.paramToSearch.replace(':', '');
      this._crud.update(params)
      .then(res => {
        let string;
        string = res['message'];
        this._snackbar.open(string, '', {
          duration: 2000,
          panelClass: 'success-snackbar'
        });

        this._router.navigate(['/main/user']);
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });
    } else if (this.submitToCreate) {
      this.userRegisterForm.value.access_profiles = this.user.access_profiles.map(profile => profile.id);
      this.userRegisterForm.value.menu_rules = this.user.menu_rules.map(r => JSON.stringify(r));

      let params;
      params = {
        route: 'users',
        objectToCreate: this.userRegisterForm.value
      };

      this._crud.create(params)
      .then(res => {
        const message = 'Usuário cadastrado com sucesso.';
        formDirective.resetForm();
        this.userRegisterForm.controls.is_active.setValue(true);
        this._snackbar.open(message, '', {
          duration: 2000,
          panelClass: 'success-snackbar'
        });
        this._router.navigate(['/main/user']);
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });
    }
  }

  clearForm = (formDirective: FormGroupDirective) => {
    this.chengePassword = true;
    formDirective.resetForm();
    const matHints = document.querySelectorAll('mat-hint');
    for (let hint = 0; hint < matHints.length; hint++) {
      matHints[hint].remove();
    }
    this.status = this.userRegisterForm.controls.is_active ? 'Inativo' : 'Ativo';
  }

  checkallRule = (id, event) => {
    let  myCheckboxes;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      if (myCheckboxes[i].name === id.toString()) {
        myCheckboxes[i].checked = event.checked;
        event.source.value = myCheckboxes[i].value;
        this.forceRule(event);
      }
    }
  }

  checkallMenu = (id, event) => {
    let myCheckboxes, ruleId;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      ruleId = myCheckboxes[i]._elementRef.nativeElement.dataset.ruleid;
      if (ruleId === id.toString()) {
        myCheckboxes[i].checked = event.checked;
        event.source.value = myCheckboxes[i].value;
        this.forceRule(event);
      }
    }
  }

  addProfileId = (event) => {
    const profile = event.source.value;
    if (event.checked) {
      this.user.access_profiles.push(event.source.value);
      if ( profile.id === 1) {
        this.fillCheckboxes(true);
      }
    } else {
      if ( profile.id === 1) {
        this.fillCheckboxes(false);
      }
      this.removeProfile(profile);
    }
  }

  removeProfile(profile) {
    const check = this.user.access_profiles.filter( p => p.id === profile.id)[0];
    const index = this.user.access_profiles.indexOf(check);
    if (index !== -1) {
      this.user.access_profiles.splice(index, 1);
    }
  }

  forceRule(event) {
    const el = event.source;
    const jsonValue = JSON.parse(el.value);
    const id = (jsonValue.manual_input) ? jsonValue.id : el.value;
    const userRule = this.user.menu_rules.filter(ur => ur.id === id)[0];
    el.value = `{"id": "${id}", "manual_input": "true", "modification": ${(el.checked) ? '"ADDED"' : '"REMOVED"'}}`;
    if (!userRule) {
      this.user.menu_rules.push(JSON.parse(el.value));
    } else {
      const index = this.user.menu_rules.indexOf(userRule);
      this.user.menu_rules[index] = JSON.parse(el.value);
    }
  }
}

