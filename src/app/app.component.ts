import { Component } from '@angular/core';

@Component({
  selector: 'body',
  host:{
    "[class.login]": 'login'
  },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BCVP';
  login = true;
}
