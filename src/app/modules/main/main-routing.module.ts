import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { RuleComponent } from './components/rule/rule.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserComponent } from './components/user/user.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProfileRegisterComponent } from './components/profile-register/profile-register.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [{
  path: '', component: MainComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'menu',
    component: MenuComponent
  }, {
    path: 'menu/:id',
    component: MenuComponent
  }, {
    path: 'rule',
    component: RuleComponent
  }, {
    path: 'playground',
    component: PlaygroundComponent
  }, {
    path: 'profile',
    component: ProfileComponent
  }, {
    path: 'profile-register',
    component: ProfileRegisterComponent
  }, {
    path: 'profile-update/:id',
    component: ProfileRegisterComponent
  }, {
    path: 'user',
    component: UserComponent
  }, {
    path: 'user-register',
    component: UserRegisterComponent
  }, {
    path: 'user-update/:id',
    component: UserRegisterComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MainRoutingModule { }
