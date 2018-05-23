import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * MOdules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { ProfileChoiceComponent } from './components/profile-choice/profile-choice.component';
import { RuleComponent } from './components/rule/rule.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    MainComponent, 
    PlaygroundComponent, 
    ProfileChoiceComponent,
    RuleComponent,
  ]
})
export class MainModule { }
