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
import { CrudService } from './services/firebase/crud.service';

/**
 * Third party modules
 */
import { TextMaskModule } from 'angular2-text-mask';

import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule
  ], exports: [
    DeleteConfirmComponent,
    ComponentModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule
  ], providers: [
    AuthenticationService,
    AuthGuard,
    CrudService
  ], declarations: [
    DeleteConfirmComponent
  ], entryComponents: [
    DeleteConfirmComponent
  ]
})
export class SharedModule { }
