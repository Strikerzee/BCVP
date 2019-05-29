import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { SendLoginDataService } from './services/send-login-data.service';
import { VoteComponent } from './vote/vote.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
    {
      path: '',
      component: LoginComponent
    },
    {
      path: 'vote',
      component: VoteComponent
    }
  ])
  ],
  providers: [
    SendLoginDataService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
