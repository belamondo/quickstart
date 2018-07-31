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

const routes: Routes = [{
  path: '', component: MainComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
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
    path: 'access_profile/:id',
    component: ProfileRegisterComponent
  }, {
    path: 'user',
    component: UserComponent
  }, {
    path: 'user-register',
    component: UserRegisterComponent
  }, {
    path: 'user-register/:id',
    component: UserRegisterComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MainRoutingModule { }
