import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';

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
import { AuthenticationService } from './services/laravel/authentication.service';
import { CrudService } from './services/laravel/crud.service';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { TextMaskModule } from 'angular2-text-mask';
import { NtmTableDataComponent } from './components/ntm-table-data/ntm-table-data.component';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    TextMaskModule
  ], exports: [
    ComponentModule,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    TextMaskModule,
    NtmTableDataComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatListModule,
    MatTooltipModule,
    MatSidenavModule,

  ], declarations: [
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    NtmTableDataComponent
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
