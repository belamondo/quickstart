import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * MOdules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask'

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

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    TextMaskModule
  ],
  declarations: [
    DashboardComponent,
    MainComponent,
    PlaygroundComponent,
    RuleComponent,
    ProfileComponent,
    ProfileRegisterComponent,
    UserComponent,
    UserRegisterComponent
  ]
})
export class MainModule { }
