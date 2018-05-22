import { Component, OnInit } from '@angular/core';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _crud: CrudService
  ) { }

  ngOnInit() {
    let params = {
      route: 'test'
    };
    this._crud.read(params)
    .then(res => {
      console.log(res)
    })
  }
}
