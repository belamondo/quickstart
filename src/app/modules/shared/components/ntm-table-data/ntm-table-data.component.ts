import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatPaginatorIntl, MatDialog, MatColumnDef, MatInput, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { CrudService } from '../../services/laravel/crud.service';

@Component({
  selector: 'app-ntm-table-data',
  templateUrl: './ntm-table-data.component.html',
  styleUrls: ['./ntm-table-data.component.css'],
  providers: [MatPaginatorIntl]
})
export class NtmTableDataComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchKey', { read: MatInput }) searchKeyFocus: MatInput;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren('myCheckbox') private myCheckboxes : QueryList<any>;
  @Input() params;
  @Input('matColumnDef') public matColumnDef: MatColumnDef;
  @Output() actionToOutput = new EventEmitter();
  public progress = "";
  color = 'primary';
  mode = 'indeterminate';
  diameter = 5;
  displayedColumns = [];
  dataSource = new MatTableDataSource([]);
  searchInput: boolean = false;
  limit: number = 5;
  prepositionLabel: string = 'de';
  checkedItem: boolean = false;
  arraySource: any = [];
  itensToDeleteIds:any = [];
  itensToCredential:any = [];
  checkAllController: boolean = false;
  public checkAllItens;
  public iconDelete = "lock";
  public justify = false;
  public includeDelate = "DELETE";
  public notEdit:boolean = false;
  public isLoadingList: boolean = true;

  constructor(
    private _crud: CrudService,
    private _paginator: MatPaginatorIntl,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar,
    private router: Router
  ) {
    this._paginator.nextPageLabel = "Próximo";  
    this._paginator.previousPageLabel = "Anterior";  
    this._paginator.itemsPerPageLabel = "Itens por página";    
    this._paginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) { return `0 ${this.prepositionLabel} ${length}`; }  
      length = Math.max(length, 0);  
      const startIndex = page * pageSize;  
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
  
      return `${startIndex + 1} - ${endIndex} ${this.prepositionLabel} ${length}`;
    }
   }

  columns = [];

  ngOnInit() {
    if(!this.params.list.permissionsOuther)
      this.params.list.permissionsOuther = [];
    if(this.params.list.limit)
      this.limit = this.params.list.limit;
    this.columns = this.params.list.columns;
    if(this.params.toolbar.delete[0].icon){
      this.iconDelete = this.params.toolbar.delete[0].icon;
      this.includeDelate = "PATCH";
    }
    if(this.params.list.notEdit)
      this.notEdit = true;
    if(this.params.list.permissions.includes(this.includeDelate))
      this.displayedColumns.push("id");
    this.columns.map(x => this.displayedColumns.push(x.columnDef));
    if(this.params.list.permissions.includes("PATCH") && !this.notEdit)
      this.displayedColumns.push("updated_at");
    if(!this.params.list.edit)
      this.displayedColumns.splice(0,1);
    
    this.readData();
  }

  ngOnChanges(){
    this.readData();
    if(!this.params.list.permissionsOuther)
      this.params.list.permissionsOuther = [];
  }
  
  readData(){
    this._crud.newRead({route: this.params.list.route}).then(res => {
      this.arraySource = res['obj']; 
      for(let i = 0, lim = this.arraySource.length; i < lim; i++ ){
        if(typeof(this.arraySource[i].is_active)!="undefined"){
          this.arraySource[i].is_active = this.arraySource[i].is_active ? "Ativo" : "Inativo"; 
        }

        if(typeof(this.arraySource[i].city)!="undefined" && this.arraySource[i].city != null){
          this.arraySource[i].city = this.arraySource[i].city.description;
        }

        if(typeof(this.arraySource[i].invited)!="undefined" && this.arraySource[i].invited != null){
          this.arraySource[i].invited = this.arraySource[i].invited.name;
        }

        if(typeof(this.arraySource[i].inviter)!="undefined" && this.arraySource[i].inviter != null){
          this.arraySource[i].inviter = this.arraySource[i].inviter.name;
        }

        if(typeof(this.arraySource[i].economic_activity)!="undefined" && this.arraySource[i].economic_activity != null){
          this.arraySource[i].economic_activity = this.arraySource[i].economic_activity.description;
        }

        if(typeof(this.arraySource[i].parent)!="undefined" && this.arraySource[i].parent != null){
          this.arraySource[i].parent = this.arraySource[i].parent.description;
        }

        if(typeof(this.arraySource[i].uf)!="undefined" && this.arraySource[i].uf != null){
          this.arraySource[i].uf = this.arraySource[i].uf.description;
        }

        if(typeof(this.arraySource[i].addresses)!="undefined"){
          if(this.arraySource[i].addresses.length > 0)this.arraySource[i].uf = this.arraySource[i].addresses[0].state.uf;
        }

        if(typeof(this.arraySource[i].profiles)!="undefined" && this.arraySource[i].profiles != null){
          this.arraySource[i].profiles = this.arraySource[i].profiles[0].description;
        }

        if(typeof(this.arraySource[i].http_verb)!="undefined" && this.arraySource[i].http_verb != null){
          this.arraySource[i].http_verb = this.arraySource[i].http_verb.description;
        }
        
        if(typeof(this.arraySource[i].type)!="undefined" && this.arraySource[i].type != null){
          this.arraySource[i].type = this.arraySource[i].type.description;
        }
      }
      this.dataSource = new MatTableDataSource(this.arraySource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoadingList = false;
    },rej=>{
      this.isLoadingList = false;
    });
  }

  dateFormatToDMY = (date) => {
    if(date && date != "") {      
      let newDate = date.split("-"),
      day = newDate[2],
      month = newDate[1],
      year = newDate[0];
      
      let final = day + "/" + month + "/" + year;
      return final;
    }
    return "";
  }

  dateFormatToDMYHM = (date) => {
    if(date && date != "") { 
        let dateFinal = '';
        try {
          let newDate = new Date(date);
          dateFinal = newDate.toLocaleString();
        } catch (error) {
          console.log(error);
        }
        
      return dateFinal;  
    }
    return "";
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    sessionStorage.setItem("pesquisa",filterValue);
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchInputToggle = () => {
    this.searchInput = !this.searchInput;
    this.searchKeyFocus.focus();
    if(!this.searchInput) {
      this.searchKeyFocus.value = "";
      this.readData();
    }  
  }

  checkItem = (id, e) => {
    let count = 0;
    if(e.checked){
      this.checkAllController = e.checked;
      this.itensToDeleteIds.push(id);
      let myCheckboxes = this.myCheckboxes.toArray(); 
      let all = true;
      for(let i = 0; i < myCheckboxes.length; i++) { 
       if(!myCheckboxes[i]._checked)all = false;
      }

      if (all) this.checkAllItens = true;
    }else{
      this.itensToDeleteIds.splice(this.itensToDeleteIds.indexOf(id), 1);
      this.checkAllItens = e.checked;
      if(this.itensToDeleteIds.length == 0)
        this.checkAllController = e.checked;
    }    
  }

  checkAllToggle = (event) => {
    this.checkAllController = event.checked;
    this.checkAllItens = event.checked;

    if (event.checked) {
      this.checkAll();
    } else {
      this.uncheckAll();
    }
  }

  checkAll = () => {
    let myCheckboxes = this.myCheckboxes.toArray();
    for(let i = 0; i < myCheckboxes.length; i++) { 
      this.itensToDeleteIds.push(myCheckboxes[i].value);
      myCheckboxes[i]._checked = true;
    }
  }

  uncheckAll = () => {
    let myCheckboxes = this.myCheckboxes.toArray();
    for(let i = 0; i < myCheckboxes.length; i++) { 
      this.itensToDeleteIds.splice(this.itensToDeleteIds.indexOf(myCheckboxes[i].value), 1);
      myCheckboxes[i]._checked = false;
    }
  }

  onClickEdit = (route, param) => {
    let finalRoute = [route + ":" + param.id];
    // let finalRoute = [route + param.id]
    this.router.navigate(finalRoute);
  }

  openDialogToDelete = (fieldToUseInDelete,element) => {
    let dialogMessage = "", height = "250px";
    if (this.params.toolbar && this.params.toolbar.deleteMessage) {
      dialogMessage = this.params.toolbar.deleteMessage;
    }

    if(this.params.toolbar.delete[0].justify){
      this.justify = this.params.toolbar.delete[0].justify;
      height = "303px";
    }

    let arrItems = []
    if(element){
      this.itensToDeleteIds.push(element.id);
    }
 
    
    let dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '350px',
      height: height,
      data: {
        routeToApi: this.params.toolbar.delete[0].routeToApi,
        routeAfterDelete: this.params.toolbar.delete[0].routeAfterDelete,
        paramToDelete: this.itensToDeleteIds,
        justify: this.justify,
        dialogMessage: dialogMessage
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      let array: any;
      let string: string;

      this.uncheckAll();
      this.readData();
      this.setOutput('toggle')
      
      this.checkAllController = false;
    });
    
  }

  setOutput = (value) => {    
    let response = {
      referenceToAction: value
    }  
    this.actionToOutput.emit(response);
  }
}