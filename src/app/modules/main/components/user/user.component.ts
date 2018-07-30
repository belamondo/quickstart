import { Component,OnInit} from '@angular/core';
import {FormControl,FormGroup,Validators,FormBuilder} from '@angular/forms';
import {MatDialogRef,MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import {ActivatedRoute,Router} from '@angular/router';

/**
 * Services
 */
import {CrudService} from './../../../shared/services/laravel/crud.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public userForm: FormGroup;
  title: string = "Usuários";
  passwordErrors: any;

  public paramToSearch: any;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public submitButton: string;
  public paramsToTableData: any;
  public userPemissions:any;

  constructor(
    private _personFormBuilder: FormBuilder,
    private crud: CrudService,
    public matsnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    let menu = JSON.parse(sessionStorage.getItem('menu'));
    let arrPermissions =  menu.filter(function(el){
      if(el.description=="Usuários")
        return el.rules
    })
    
    this.userPemissions = arrPermissions[0].rules

    this.crud.read({
      route: "users"
    })
    .then(res => {
      //console.log(res);
    });
    this.makeList();
  }
  
  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Usuários",
        delete: [{
          routeAfterDelete: '/main/user',
          routeToApi: 'users',
          fieldToDelete: 'id'
        }],
        actionButton:{
          type: 'raised',
          value: 'ADICIONAR USUÁRIO',
          color: 'accent'
        },
        deleteMessage: "ATENÇÃO: Deseja realmente desativar o(s) usuário(s) selecionado(s) ?"
      },
      list: {
        route: "users",
        limit: 10,
        columns: [
          { columnDef: 'name', header: 'Nome', cell: (row: User) => `${row.name}` },
          { columnDef: 'uf', header: 'UF', cell: (row: User) => `${row.uf == null ? "" : row.uf}`},
          { columnDef: 'email', header: 'Descrição', cell: (row: User) => `${row.email}` },
          { columnDef: 'profiles', header: 'Perfis de acesso', cell: (row: User) => `${row.profiles}` },
          { columnDef: 'deleted_at', header: 'Status', cell: (row: User) => `${row.deleted_at}`}
        ],
        edit: {route: '/main/user-update/', param: 'id'},
        permissions: this.userPemissions
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  eventUserParticipation = (event) => {
    if(event.referenceToAction === "ADICIONAR USUÁRIO") {
      this.router.navigate(['/main/user-register']);
    }
  }
}

export interface User {
  name: string;
  uf: any;
  email: string;
  deleted_at: string;
  profiles:any;
}
