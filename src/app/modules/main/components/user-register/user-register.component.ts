import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CrudService } from '../../../shared/services/laravel/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, MatDialog } from '@angular/material';

import { SnackBarService } from '../../../shared/services/snackbar.service';
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
  public chengePassword = true;
  public status = 'Ativo';
  public title: string;
  public menus: any;
  public rules: any;
  public user: any;
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
    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, ],
      cell_phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };

    this.userRegisterForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'email': new FormControl(null, [Validators.required, Validators.maxLength(191), Validators.email]),
      'password': new FormControl(null),
      'repeatPassword': new FormControl(null),
      // 'telephone_number': new FormControl(null),
      // 'mobilephone_number': new FormControl(null),
      // 'uf_id': new FormControl(null, Validators.required),
      'access_profiles': new FormControl(null, Validators.required),
      'is_active': new FormControl(true),
      'change_password': new FormControl(false)
    });

    this.listProfiles();

    this.listMenuNotTrashed();

    // this.listUf();

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

    this._crud
    .newRead({route: 'menu/rules'}).then(res => {
      this.menuRules = res['obj'];
      this.user = {
        menu_rules : []
      };
    });
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar usuário';
        this.submitButton = 'Atualizar';

        let param;
        param = this.paramToSearch.replace(':', '');

        this._crud
        .read({route: 'users/' + param}).then(res => {
          let user;
          user = res['obj'];
          // console.log(res['obj']);
          if (res['obj'].is_user_ad) {this.chengePassword = false; }
          // res['obj'].access_profiles = user.access_profiles[0].id;
          this.status = res['obj'].is_active ? 'Ativo' : 'Inativo';
          // res['obj'].deleted_at = res['obj'].deleted_at ? false : true;
          res['obj'].change_password = false;
          res['obj'].is_active = res['obj'].is_active ? true : false;
          this.permissionEdit = res['obj'].menu_rules;
          this.show = false;
          this.user = res['obj'];
          this.userRegisterForm.patchValue(res['obj']);
          // this.listMenuNotTrashed();
        });
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastrar Usuário';
        this.submitButton = 'Salvar';
      }
    });
  }

  listUf = () => {
    this._crud.read({route: 'uf'}).then(res => {
      this.ufArray = res['obj'];
    });
  }

  ruleMenu(verify_menu, verify_rule) {
    return this.menuRules.filter(r => r.rule_id.toString() === verify_rule.toString() && r.menu_id.toString() === verify_menu.toString());
  }

  listProfiles = () => {
    this._crud.read({route: 'profile'}).then(res => {
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

  fillBoxes = (status) => {

    // let ruleId;
    const myCheckboxes = this.myCheckboxes.toArray();
    // const profile_rules = [];
    // profile.menu_rules.filter( (rule) => {
    //   profile_rules.push(rule.id);
    // });

    // console.log(this.user.menu_rules)
    for (let i = 0; i < myCheckboxes.length; i++) {
      // if ( profile.id === 1) {
        myCheckboxes[i]._checked = status;
      // } else {
      //   ruleId = myCheckboxes[i].value;
      //   // console.log(i, ruleId);
      //   if ( profile_rules.includes(parseInt(ruleId, 10)) ) {
      //     myCheckboxes[i]._checked = status;
      //   }
      // }
    }
  }

  userHasMenuRule(rules, verify_menu, verify_rule) {
    return rules.filter(r => r.rule_id === verify_rule && r.menu_id === verify_menu).length >= 1;
  }
  userMenuRule(rules, verify_menu, verify_rule) {
    return rules.filter(r => r.rule_id === verify_rule && r.menu_id === verify_menu)[0];
  }

  onUserSubmit = (formDirective: FormGroupDirective) => {
    this.userRegisterForm.value.deleted_at = this.userRegisterForm.value.deleted_at ? null : new Date();
    if (this.submitToUpdate) {
      let params;
      params = {
        route: 'users',
        objectToUpdate: this.userRegisterForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };

      this._crud.update(params)
      .then(res => {
        const resObj = res['apiBody'];
          let snackClass, string;
          snackClass =  'success-snackbar';

          if (resObj && resObj['status'] === 'ERROR') {
            string = 'ERRO: ' + resObj['message'];
            snackClass =  'error-snackbar';
          } else {
            string = 'Atualização feita com sucesso';
            snackClass =  'success-snackbar';
          }
          this._snackbar.open(string, '', {
            duration: 2000,
            extraClasses: [snackClass]

          });
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });

      // this.clearForm();

      // for (let name in this.userRegisterForm.controls) {
      //   this.userRegisterForm.controls[name].setErrors(null);
      // }

      this._router.navigate(['/main/user']);
    } else if (this.submitToCreate) {
      let params;
      params = {
        route: 'users',
        objectToCreate: this.userRegisterForm.value
      };

      this._crud.create(params)
      .then(res => {
        let message = res['message'];
        if ((res['status']) === 200 || res['status'] === 201) {
          message = 'Usuário registrado com sucesso, realize seu login para ter acessoao sistema.';
        }
        formDirective.resetForm();
        this.userRegisterForm.controls.deleted_at.setValue(true);
        this._snackbar.open(message, '', {
          duration: 2000
        });
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });
    }
  }

  clearForm = (formDirective: FormGroupDirective) => {
    // this.userRegisterForm.reset();
    // this.show = true;
    this.chengePassword = true;
    // this.status = this.userRegisterForm.controls.deleted_at ? 'Inativo' : 'Ativo';
    // this.status = this.userRegisterForm.controls.deleted_at ? 'Inativo' : 'Ativo';
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
      }
    }
  }

  addProfileId = (event) => {
    const profile = event.source.value;
    if (event.checked) {
      this.userProfiles.push(event.source.value);
      if ( profile.id === 1) {
        this.fillBoxes(true);
      } else {
        profile.menu_rules.map(r => {
          r['pivot'] = {};
          const pivot: any = r['pivot'];
          pivot['access_profile_id'] = profile.id;
          this.user.menu_rules.push(r);
        });
      }
    } else {
      if ( profile.id === 1) {
        this.fillBoxes(false);
      }
      this.removeProfile(profile);
    }
    // console.log(this.userProfiles);
  }

  removeProfile(profile) {
    const index = this.userProfiles.indexOf(profile);
    if (index !== -1) {
      const rules = this.user.menu_rules.filter(r => r.pivot.access_profile_id.toString() === profile.id.toString());
      rules.map(mr => {
        mr = JSON.stringify(mr);
        this.user.menu_rules.map((r, ind) => {
          r = JSON.stringify(r);
          if (mr === r) { this.user.menu_rules.splice(ind, 1); }
        });
      });
      this.userProfiles.splice(index, 1);
    }
  }

  forceRule(event) {
    console.log(event)
    const el = event.target;
    console.log(el)
    const jsonValue = JSON.parse(el.value);
    console.log(jsonValue)
    const id = (jsonValue.manual_input) ? jsonValue.id : el.value;
    console.log(id)
    const userRule = this.user.menu_rules.filter(ur => ur.id === id)[0];
    console.log(userRule)
    el.dataset.touched = true;
   // el.parentElement.querySelector('span').classList.add('forced');
    el.value = `{"id": "${id}", "manual_input": "true", "modification": ${(el.checked) ? '"ADDED"' : '"REMOVED"'}}`;
    if (!userRule) {
      this.user.menu_rules.push(JSON.parse(el.value));
    } else {
      const index = this.user.menu_rules.indexOf(userRule);
      this.user.menu_rules[index] = JSON.parse(el.value);
    }
    console.log(this.user.menu_rules);
  }
}

