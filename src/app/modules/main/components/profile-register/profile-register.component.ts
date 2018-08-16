import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CrudService } from '../../../shared/services/laravel/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { ValidateRequired } from '../../../shared/validators/required.validator';
import { SnackBarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-profile-register',
  templateUrl: './profile-register.component.html',
  styleUrls: ['./profile-register.component.css']
})
export class ProfileRegisterComponent implements OnInit {
  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;
  public profileForm: FormGroup;
  public categoriasForm: FormGroup;
  ELEMENT_DATA;
  public paramToSearch: any;
  public paramsToTableData: any;
  public statusGroup: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public menus: any;
  public rules: any;
  public menuRules: any;
  public categories: any;
  public permissions: Array<any> = [];
  public permissionEdit: Array<any> = [];
  private fieldArray: Array<any> = [];
  private categoriasId: Array<any> = [];
  public title: string;
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public status = 'Ativo';

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    public snackBarService: SnackBarService,
    private _router: Router,
    public _snackbar: MatSnackBar,
  ) { }

  ngOnInit() {


    this.profileForm = new FormGroup({
      'description': new FormControl(null, ValidateRequired ),
      'is_active': new FormControl(true)
    });

    this.profileFormInit();
    this.listMenuNotTrashed();

  }

  active = (event) => {
    if (event.checked) {
      this.status = 'Ativo';
    } else {
      this.status = 'Inativo';
    }
  }

  ruleMenu(verify_menu, verify_rule) {
    return this.menuRules.filter(r => r.rule_id.toString() === verify_rule.toString() && r.menu_id.toString() === verify_menu.toString());
  }


  profileFormInit = () => {
    this._crud
    .newRead({route: 'menu/rules'}).then(res => {
      this.menuRules = res['obj'];
    });
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar perfil de acesso';
        this.submitButton = 'Atualizar';

        let param;
        param  = this.paramToSearch.replace(':', '');

        this._crud
        .newRead({route: 'profile/' + param}).then(res => {
          // console.log(res);
          res['obj'].is_active = res['obj'].is_active ? true : false;
          this.status = res['obj'].is_active ? 'Ativo' : 'Inativo';
          this.permissionEdit = res['obj'].menu_rules;
          this.profileForm.patchValue(res['obj']);
        });

      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastro de perfil de acesso';
        this.submitButton = 'Salvar';
      }
      this.listMenuNotTrashed();
    });
  }

  onProfileSubmit = (formDirective: FormGroupDirective) => {

    const myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      if (myCheckboxes[i].checked) {
        this.permissions.push(myCheckboxes[i].value);
      }
    }
    this.profileForm.value.is_active ? this.profileForm.value.deleted_at = null : this.profileForm.value.deleted_at = new Date();
    if (this.submitToUpdate) {
      let objFinal;
      objFinal = {
        'id': this.paramToSearch.replace(':', ''),
        'description': this.profileForm.value.description,
        'is_active': this.profileForm.value.is_active,
        'menu_rules': this.permissions
      };

      let params;
      params = {
        route: 'profile',
        objectToUpdate: objFinal,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
      this._crud.update(params)
      .then(res => {
        const resObj = res['apiBody'];
        let snackClass, string;
        string = 'atualizado com sucesso';
        snackClass =  'success-snackbar';

        // if (resObj && resObj['status'] === 'ERROR') {
        //   string = 'ERRO: ' + resObj['message'];
        //   snackClass =  'error-snackbar';
        // } else {
        //   string = 'Atualização feita com sucesso ';
        //   snackClass =  'success-snackbar';
        // }
        this._snackbar.open(string, '', {
          duration: 2000,
          panelClass: [snackClass]

        });
        // formDirective.reset();
        // this.status = this.profileForm.controls.is_active ? 'Ativo' : 'Inativo';
        // this._router.navigate(['/main/profile']);
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });

    } else if (this.submitToCreate) {
      let objFinal;
      objFinal = {
        'description': this.profileForm.value.description,
        // 'deleted_at': this.profileForm.value.deleted_at,
        'menu_rules': this.permissions
      };

      let params;
      params = {
        route: 'profile',
        objectToCreate: objFinal
      };
      this._crud.create(params)
      .then(res => {
        this._snackbar.open(res['message'], '', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        // formDirective.reset();
        this.clearForm(formDirective);
        this._router.navigate(['/main/profile']);
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });
    }
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


  clearForm = (formDirective: FormGroupDirective) => {
    let myCheckboxes;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      myCheckboxes[i].checked = false;
    }

    formDirective.resetForm();
    const matHints = document.querySelectorAll('mat-hint');
    for (let hint = 0; hint < matHints.length; hint++) {
      matHints[hint].remove();
    }
    this.profileForm.get('is_active').setValue(true);
    this.status =  'Ativo';
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

}
