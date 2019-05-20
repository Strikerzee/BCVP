import { Component} from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { SendLoginDataService } from '../send-login-data.service';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.pattern(/.+/g)]),
    password: new FormControl('', [Validators.pattern(/.+/g)])
  })
  submit(){
    if(!this.loginForm.controls.username.errors && !this.loginForm.controls.password.errors)
    fetch('https://localhost:8443/users/login',{
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      })
    })
  }
}
