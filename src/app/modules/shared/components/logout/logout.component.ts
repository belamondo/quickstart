import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'ntm-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  @Input() params: any;

  errors = [];
  mdIcon: string;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    if (this.params) {
      if (!this.params.mdIcon) {
        this.mdIcon = "exit_to_app";
      }

      if (!this.params.routeAfterLogout) {
        this.errors.push({
          cod: 'bm-lo-01',
          message: "Definir rota do logout"
        });
      }
    } else {
      this.errors.push({
        cod: 'p-01',
        message: "Definir parâmetros mínimos do componente"
      });
    }
  }

  logout = () => {
    sessionStorage.clear();
    this.router.navigate(this.params.routeAfterLogout);
  }
}
