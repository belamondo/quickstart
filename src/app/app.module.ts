import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

/**
 * Modules
 */
import { SharedModule } from './modules/shared/shared.module';

/**
 * Routing
 */
import { AppRoutingModule } from './app-routing.module';
import { ResetPasswordComponent } from './modules/shared/components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    RegisterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ResetPasswordComponent,
    RegisterComponent
  ]
})
export class AppModule { }
