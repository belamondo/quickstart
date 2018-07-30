import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Services
 */
//import {WindowService} from './../../../shared/services/window.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  public widthHalf: string;
  public widthThird: string;
  public widthQuarter: string;
  public userPemissions;
  public paramsToTableData: any;

  constructor(
    private _router: Router,
    //private _windowService: WindowService
  ) {}

  ngOnInit() {
    // let menu = JSON.parse(sessionStorage.getItem('menu'));
    // let arrPermissions =  menu.filter(function(el){
    //   if(el.route=="/main/profile")
    //     return el.rules
    // })
    
    // this.userPemissions = arrPermissions[0].rules;
    // this.userPemissions = ["POST","GET","DELETE","PUT","PATCH"];
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
    // });

    //this.makeList();
  }

  eventProfileadd = (event) => {
    if(event.referenceToAction === "ADICIONAR PERFIL") {
      this._router.navigate(['/main/profile-register']);
    }
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Perfis",
        delete: [{
          routeAfterDelete: '/main/profile',
          routeToApi: 'profiles',
          fieldToDelete: 'id'
        }],
        actionButton:{
          type: 'raised',
          value: 'ADICIONAR PERFIL',
          color: 'accent'
        },
        deleteMessage: "ATENÇÃO: Deseja realmente excluir o(s) perfil(s) selecionado(s) ?"
      },
      list: {
        route: "profiles",
        limit: 5,
        columns: [
          { columnDef: 'description', header: 'Perfil', cell: (row: Profile) => `${row.description}` }
        ],
        edit: {route: '/main/profile-update/', param: 'id'},
        permissions:this.userPemissions
      }
    }
  }
}

export interface Profile {
  description: string; 
}