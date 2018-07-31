import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CrudService } from '../../../shared/services/laravel/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
// import { ValidateRequired } from '../../../shared/validators/required.validator';
// import { SnackBarService } from '../../../shared/services/snackbar.service';

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
    // public snackBarService: SnackBarService,
    private _router: Router,
    public _snackbar: MatSnackBar,
  ) { }

  ngOnInit() {


    this.profileForm = new FormGroup({
      // 'description': new FormControl(null, ValidateRequired),
      'description': new FormControl(null, ),
      'deleted_at': new FormControl(true)
    });

    // this.categoriasForm = new FormGroup({
    //   'categorias': new FormControl(null, Validators.required)
    // })

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

  profileFormInit = () => {
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
        .read({route: 'profiles/permissions/' + param}).then(res => {
          res['obj'].deleted_at = res['obj'].deleted_at ? false : true;
          this.permissionEdit = res['obj'].permissions;
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
        let obj;
        obj = {'menus_id': myCheckboxes[i].name, 'rules_id': myCheckboxes[i].value};
        this.permissions.push(obj);
      }
    }

    this.profileForm.value.deleted_at = this.profileForm.value.deleted_at ? null : new Date();
    if (this.submitToUpdate) {
      let objFinal;
      objFinal = {
        'description': this.profileForm.value.description,
        'deleted_at': this.profileForm.value.deleted_at,
        'permissions': this.permissions
        // "categorias":this.categoriasId
      };

      let params;
      params = {
        route: 'profiles',
        objectToUpdate: objFinal,
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
          string = 'Atualização feita com sucesso ';
          snackClass =  'success-snackbar';
        }
        this._snackbar.open(string, '', {
          duration: 2000,
          // extraClasses: [snackClass]

        });
        formDirective.reset();
        this._router.navigate(['/main/profile']);
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          // this.snackBarService.add(rej['errors'][i]);
        }
      });

    } else if (this.submitToCreate) {
      let objFinal;
      objFinal = {
        'description': this.profileForm.value.description,
        'deleted_at': this.profileForm.value.deleted_at,
        'permissoes': this.permissions
        // "categorias":this.categoriasId
      };

      let params;
      params = {
        route: 'profiles',
        objectToCreate: objFinal
      };

      this._crud.create(params)
      .then(res => {
        this._snackbar.open(res['message'], '', {
          duration: 2000,
          // extraClasses:['success-snackbar']
        });
        formDirective.reset();
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          // this.snackBarService.add(rej['errors'][i]);
        }
      });
    }
  }

  listMenuNotTrashed = () => {
    let rules = [];
    let menuRules;
    this._crud.read({route: 'profiles/rules/not-trashed'}).then(res => {
      this.rules = res['obj'];
      rules = res['obj'];
      this._crud.read({route: 'profiles/menus/not-trashed'}).then(res2 => {
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


  clearForm = () => {
    this.profileForm.controls.description.reset();
    this.categoriasId = [];
    this.fieldArray = [];
    let myCheckboxes;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      myCheckboxes[i].checked = false;
    }
  }

  checkallRule = (id, event) => {
    let  myCheckboxes;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      if (myCheckboxes[i].name === id) {
        myCheckboxes[i].checked = event.checked;
      }
    }
  }

  checkallMenu = (id, event) => {
    let myCheckboxes;
    myCheckboxes = this.myCheckboxes.toArray();
    for (let i = 0; i < myCheckboxes.length; i++) {
      if (myCheckboxes[i].value === id) {
        myCheckboxes[i].checked = event.checked;
      }
    }
  }

}
