import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/laravel/crud.service';
import { SnackBarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menuForm: FormGroup;
  public paramToSearch: any;
  public paramsToTableData: any;
  public profiles: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  private updatedDescription: string;
  private updatedMenu: string;
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public status = 'Ativo';
  public userPemissions: any;
  public ruleArray: any;
  public rulesToAdd: any = [];

  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;
  @ViewChildren('checkMaster') private checkMaster: QueryList<any>;

  constructor(
    private _crud: CrudService,
    public snackBarService: SnackBarService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    // const menu = JSON.parse(sessionStorage.getItem('menu'));
    // const arrPermissions =  menu.filter(function(el) {
    //   if (el.route === '/main/menu') {
    //     return el.rules;
    //   }
    // });

    // this.userPemissions = arrPermissions[0].rules;
    this.userPemissions = ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'];

    this.menuForm = new FormGroup({
      'description': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'route': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'route_back': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'is_active': new FormControl(true),
      'deleted_at': new FormControl(null)
    });

    this.menuFormInit();
    this.makeList();
  }

  active = (event) => {
    if (event.checked) {
      this.status = 'Ativo';
    } else {
      this.status = 'Inativo';
    }
  }

  menuFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar menu';
        this.submitButton = 'Atualizar';

        const param = this.paramToSearch.replace(':', '');
        this._crud
        .newRead({route: 'menu/' + param}).then(res => {
          res['obj'].is_active = res['obj'].is_active ? true : false;
          this.status = res['obj'].is_active ? 'Ativo' : 'Inativo';
          this.menuForm.patchValue(res['obj']);

        });
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastrar menu';
        this.submitButton = 'Salvar';
      }
    });
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: 'Menus',
        delete: [{
          routeAfterDelete: '/main/menu',
          routeToApi: 'menu',
          fieldToDelete: 'id'
        }],
        search: [{
          field: 'description',
          option: 'Menu'
        }, {
          field: 'route',
          option: 'Rota'
        }, {
          field: 'route_back',
          option: 'Rota Back'
        }],
        deleteMessage: 'ATENÇÃO: Deseja realmente desativar o(s) menu(s) selecionado(s) ?'
      },
      list: {
        route: 'menu',
        limit: 5,
        columns: [
          { columnDef: 'description', header: 'Menu', cell: (row: Menu) => `${row.description}` },
          { columnDef: 'route', header: 'Rota', cell: (row: Menu) => `${row.route}` },
          { columnDef: 'route_back', header: 'Rota Back', cell: (row: Menu) => `${row.route_back}` },
          { columnDef: 'deleted_at', header: 'Status', cell: (row: Menu) => `${row.is_active}`}
        ],
        edit: {route: '/main/menu/', param: 'id'},
        permissions: this.userPemissions
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  clearForm = (formDirective: FormGroupDirective) => {
    formDirective.resetForm();
    const matHints = document.querySelectorAll('mat-hint');
    for ( let hint = 0; hint < matHints.length; hint++) {
      matHints[hint].remove();
    }
    this.menuForm.get('is_active').setValue(true);
    // this.status = this.menuForm.controls.is_active ? 'Ativo' : 'Ativo';
  }

  onMenuSubmit = (formDirective: FormGroupDirective) => {
    this.menuForm.value.is_active ? this.menuForm.value.deleted_at = null : this.menuForm.value.deleted_at = new Date();
    if (this.submitToUpdate) {
      let params;
      params = {
        route: 'menu',
        objectToUpdate: this.menuForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };

      params.objectToUpdate.id = this.paramToSearch.replace(':', '');
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
          panelClass: [snackClass]

        });
        this.makeList();
        // this.status = this.menuForm.controls.is_active ? 'Inativo' : 'Ativo';
        this._router.navigate(['/main/menu']);
      }, rej => {
          for (let i = 0; i < rej['errors'].length; i++) {
            this.snackBarService.add(rej['errors'][i]);
          }
      });
      // this.status = this.menuForm.controls.is_active ? 'Inativo' : 'Ativo';
      // formDirective.resetForm();

    } else if (this.submitToCreate) {
      let params;
      params = {
        route: 'menu',
        objectToCreate: this.menuForm.value
      };
      this._crud.create(params)
      .then(res => {
        const message = 'Menu cadastrado com sucesso.';
        this._snackbar.open(message, '', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        formDirective.resetForm();
        this.menuForm.get('is_active').setValue(true);
        // this.status = this.menuForm.controls.is_active ? 'Inativo' : 'Ativo';
        this.makeList();
      }, rej => {
        for (let i = 0; i < rej['errors'].length; i++) {
          this.snackBarService.add(rej['errors'][i]);
        }
      });

    }
  }

}

export interface Menu {
  description: string;
  route: string;
  deleted_at: string;
  is_active: string;
  route_back: String;
}
