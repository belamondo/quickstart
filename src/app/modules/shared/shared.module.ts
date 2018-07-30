import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

/**
 * Guards
 */
import { AuthGuard } from './guards/auth.guard';

/**
 * Modules
 */
import { ComponentModule } from './component.module';
import { MaterialModule } from './material.module';

/**
 * Services
 */
import { AuthenticationService } from './services/firebase/authentication.service';
import { CrudService } from './services/laravel/crud.service';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule
  ], exports: [
    ComponentModule,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    TextMaskModule

  ], declarations: [
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    LogoutComponent
  ], providers: [
    AuthenticationService,
    AuthGuard,
    CrudService
  ], entryComponents: [
    DeleteConfirmComponent,
    ForgotPasswordComponent
  ]
})
export class SharedModule { }
