import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/laravel/crud.service';
// import { WindowService } from './../../../shared/services/window.service';
// import { SnackBarService } from '../../../shared/services/snackbar.service';

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
  public submitToUpdate: boolean;route
  public title: string;
  private updatedDescription: string;
  private updatedMenu: string;
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public status:string = "Ativo";
  public userPemissions: any;

  constructor(
    private _crud: CrudService,
    //public snackBarService: SnackBarService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    //private _windowService: WindowService
  ) { }

  ngOnInit() {
    let menu = JSON.parse(sessionStorage.getItem('menu'));
    let arrPermissions =  menu.filter(function(el){
      if(el.route=="/main/menu")
        return el.rules
    })
    
    this.userPemissions = arrPermissions[0].rules

    // this._windowService.width$
    // .subscribe(res => {
    //   if (res < 500) {
    //     this.widthQuarter = "form-pattern";
    //     this.widthThird = "form-pattern";
    //     this.widthHalf = "form-pattern";
    //   } else if (res < 800) {
    //     this.widthQuarter = "form-pattern-half"
    //     this.widthThird = "form-pattern";
    //     this.widthHalf = "form-pattern";
    //   } else {
    //     this.widthQuarter = "form-pattern-quarter"
    //     this.widthThird = "form-pattern-third";
    //     this.widthHalf = "form-pattern-half";
    //   }
    // })
    this.menuForm = new FormGroup({
      'description': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'route': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'route_back': new FormControl(null, [Validators.required, Validators.maxLength(191)]),
      'deleted_at': new FormControl(true)
    })

    this.menuFormInit();

    this.makeList();

    this._crud
    .read({
      route: "profiles"
    }).then(res => { 
      this.profiles = res['obj']; 
    })
  }

  active = (event) => {
    if(event.checked){
      this.status = "Ativo"
    }else{
      this.status = "Inativo"
    }
  }

  menuFormInit = () => {
    this._route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar menu";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');
        
        this._crud
        .read({route: "menus/" + param}).then(res => {
          res['obj'].deleted_at = res['obj'].deleted_at ? false : true;
          this.menuForm.patchValue(res['obj']);

        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar menu";
        this.submitButton = "Salvar";
      }
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Menus",
        delete: [{
          routeAfterDelete: '/main/menu',
          routeToApi: 'menus',
          fieldToDelete: 'id'
        }],
        search: [{
          field: 'description',
          option: 'Menu'
        }, {
          field: 'route',
          option: 'Rota'
        },{
          field: 'route_back',
          option: 'Rota Bacl'
        }],
        deleteMessage: "ATENÇÃO: Deseja realmente desativar o(s) menu(s) selecionado(s) ?"
      },
      list: {
        route: "menus",
        limit: 5,
        columns: [
          { columnDef: 'description', header: 'Menu', cell: (row: Menu) => `${row.description}` },
          { columnDef: 'route', header: 'Rota', cell: (row: Menu) => `${row.route}` },
          { columnDef: 'route_back', header: 'Rota Back', cell: (row: Menu) => `${row.route_back}` },
          { columnDef: 'deleted_at', header: 'Status', cell: (row: Menu) => `${row.deleted_at}`}
        ],
        edit: {route: '/main/menu/', param: 'id'},
        permissions:this.userPemissions
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  clearForm = (formDirective: FormGroupDirective) =>{
    formDirective.resetForm();
    let matHints = document.querySelectorAll('mat-hint');
    for (var hint = 0; hint < matHints.length; hint++){
      // if(typeof(matHints[hint])=="object")
      matHints[hint].remove();
    }
    this.status = this.menuForm.controls.deleted_at ? "Inativo" : "Ativo";
  }

  onMenuSubmit = (formDirective: FormGroupDirective) => {
    this.menuForm.value.deleted_at = this.menuForm.value.deleted_at ? null : new Date();
    if(this.submitToUpdate) {
      let params = {
        route: 'menus',
        objectToUpdate: this.menuForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
  
      this._crud.update(params)
      .then(res => {
        let resObj = res['apiBody']
        let snackClass,string
        snackClass =  'success-snackbar'

        if(resObj && resObj["status"]=="ERROR"){
          string = "ERRO: "+resObj['message']
          snackClass =  'error-snackbar'
        }else{        
          string = "Atualização feita com sucesso "
          snackClass =  'success-snackbar'
        }
        this._snackbar.open(string, '', {
          duration: 2000,
          //extraClasses: [snackClass]

        })
      }, rej => {
          // for(let i = 0; i < rej['errors'].length; i++){ 
          //   this.snackBarService.add(rej['errors'][i]);          
          // }
      })

      formDirective.resetForm();

      this.makeList();

      this._router.navigate(['/main/menu']);
    } else if(this.submitToCreate) {
      let params = {
        route: 'menus',
        objectToCreate: this.menuForm.value
      };

      this._crud.create(params)
      .then(res => {
        this._snackbar.open(res['message'], '', {
          duration: 2000,
          //extraClasses:['success-snackbar']
        })
        formDirective.resetForm();
        this.status = this.menuForm.controls.deleted_at ? "Inativo" : "Ativo";
        this.makeList();
      }, rej => {
        // for(let i = 0; i < rej['errors'].length; i++){ 
        //   this.snackBarService.add(rej['errors'][i]);          
        // }
      })

    }
  }
}

export interface Menu {
  description: string;
  route: string;
  deleted_at: string;
  route_back: String;
}
