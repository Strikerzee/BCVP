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
    username: new FormControl('', Validators.nullValidator),
    password: new FormControl('', [Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)]),
    cnfpassword: new FormControl('', this.cnfpass)
  })
  submit(){
    if(!this.loginForm.controls.username.errors && !this.loginForm.controls.password.errors && !this.loginForm.controls.cnfpassword.errors)
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
  cnfpass(control: FormControl) {
    let cnfpass = control.value;
    if(control.parent){
      let pass = control.parent.value.password;
      if(!cnfpass || (cnfpass && cnfpass != pass)){
        return{
          Error: "passwords don't match"
        }
      }
      return null;
    }
  }
}
