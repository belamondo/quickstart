import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
//import { WindowService } from '../../../shared/services/window.service'; 
import { CrudService } from '../../../shared/services/laravel/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, MatDialog } from '@angular/material';
// import { RegisterComponent } from '../../../../components/register/register.component'; 
// import { SnackBarService } from '../../../shared/services/snackbar.service';
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
  public show: boolean = true; 
  public chengePassword: boolean = true; 
  public status:string = "Ativo";
  public title: string;
  public paramToSearch: any;
  public submitButton: string;
  
  constructor(
    //private _windowService: WindowService,
    //public snackBarService: SnackBarService,
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  ngOnInit() { 
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
    this.mask = {
      cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/]
    };

    this.userRegisterForm = new FormGroup({
      'name': new FormControl(null,[Validators.required, Validators.maxLength(191)]),
      'email': new FormControl(null,[Validators.required, Validators.maxLength(191), Validators.email]),
      'password': new FormControl(null),
      'repeatPassword': new FormControl(null),
      'telephone_number': new FormControl(null),
      'mobilephone_number': new FormControl(null),
      'uf_id': new FormControl(null,Validators.required), 
      'profiles_id': new FormControl(null,Validators.required),
      'deleted_at': new FormControl(true),
      'change_password': new FormControl(false)
    });

    this.listRulesNotTrashed();

    this.listUf();

    this.userFormInit();
  }

  active = (event) => {
    if(event.checked){
      this.status = "Ativo"
    }else{
      this.status = "Inativo"
    }
  }

  userFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar usuário";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this._crud
        .read({route: 'users/' + param}).then(res => {
          let user = res['obj'];
          if(res['obj'].is_user_ad)this.chengePassword = false;
          res['obj'].profiles_id = user.profiles[0].id;
          this.status = res['obj'].deleted_at ? "Inativo" : "Ativo";
          res['obj'].deleted_at = res['obj'].deleted_at ? false : true;
          res['obj'].change_password = false;
          this.show = false;
          this.userRegisterForm.patchValue(res['obj']);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar Usuário";
        this.submitButton = "Salvar";
      }
    })
  }

  listUf = () => { 
    this._crud.read({route: 'uf'}).then(res => {
      this.ufArray = res['obj'];
    });
  }

  listRulesNotTrashed = () => { 
    this._crud.read({route: 'users/profiles/not-trashed'}).then(res => {
      this.profileArray = res['obj'];
    });
  }

  searchLogin = () => {
    this.progress = true;
    if(this.userRegisterForm.value.name){      
      this._crud.read({route: 'users/ad/search',data:{"name":this.userRegisterForm.value.name}}).then(res => {
        this.progress = false;
        this.show = false;
        this.chengePassword = false;
        
        if(res['obj'].length > 1){
          // let dialogRef = this._dialog.open(AdDialogComponent, {
          //   // width: '450px',
          //   data: res['obj']
          // });
          // dialogRef.afterClosed().subscribe(result => {
          //   if(result){    
          //     this.userRegisterForm.patchValue(result[0]);
          //   }else{
          //     this.show = true;
          //     this.chengePassword = true;
          //   }
          // });
        }else{  
          this.userRegisterForm.patchValue(res['obj'][0]);
        } 
      }, rej => {
        this.progress = false;
        this.show = true;
        this.chengePassword = true;
        let message = "Usuário não encontrado";
        if(rej['status']==500)
        this._snackbar.open(message, '', {
          duration: 3000
        })
      })
    }else{
      this.progress = false;
    }

  }

  private isInstanceVisible; 
  onUserSubmit = (formDirective: FormGroupDirective) => {
    this.userRegisterForm.value.deleted_at = this.userRegisterForm.value.deleted_at ? null : new Date();
    if (this.submitToUpdate) {
      let params = { 
        route: 'users',
        objectToUpdate: this.userRegisterForm.value,
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
        for(let i = 0; i < rej['errors'].length; i++){ 
          //this.snackBarService.add(rej['errors'][i]);          
        }
      })

      // this.userRegisterForm.reset();

      for (var name in this.userRegisterForm.controls) {
        this.userRegisterForm.controls[name].setErrors(null);
      }

      this._router.navigate(['/main/user']);
    } else if (this.submitToCreate) { 
      
      let params = {
        route: 'users',
        objectToCreate: this.userRegisterForm.value
      };

      this._crud.create(params)
      .then(res => { 
        let message = res['message'];
        if(res['status'] == 200 || res['status'] == 201){
          message = "Usuário registrado com sucesso, realize seu login para ter acessoao sistema."; 
        }
        formDirective.resetForm();
        this.userRegisterForm.controls.deleted_at.setValue(true);
        this._snackbar.open(message, '', {
          duration: 2000
        }) 
      }, rej => { 
        for(let i = 0; i < rej['errors'].length; i++){ 
          //this.snackBarService.add(rej['errors'][i]);          
        }
      })
      

    }
  }

  clearForm = () => {
    this.userRegisterForm.reset();
    this.show = true;
    this.chengePassword = true;
    this.status = this.userRegisterForm.controls.deleted_at ? "Inativo" : "Ativo";
    this.status = this.userRegisterForm.controls.deleted_at ? "Inativo" : "Ativo";
  }
}