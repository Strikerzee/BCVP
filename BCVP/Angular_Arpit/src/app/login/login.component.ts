import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { SendLoginDataService } from '../services/send-login-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  logged_in = false;
  userForm: FormGroup;
  serviceErrors:any = {};
  token: string;
  constructor(private formBuilder: FormBuilder, private service: SendLoginDataService, private router: Router) {
  }
  // Generate a reactive form with appropriate validators
  invalidVoterID()
  {
  	return (this.submitted && (this.serviceErrors.username != null || this.userForm.controls.username.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && (this.serviceErrors.password != null || this.userForm.controls.password.errors != null));
  }

  ngOnInit()
  {
    this.userForm = this.formBuilder.group({
  		username: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
  	});
  }

  onSubmit()
  {
    this.submitted = true;
    // Checked validity of form inputs. DONE
    if(this.userForm.invalid == true)
    {
      return;
    }
    else
    {
      // Now send data to the backend MySQL and check
      // if password is correct, get token in return and 
      // redirect or error if password is wrong.
      let token;
      this.service.sendData(this.userForm.value)
        .subscribe(response => {
          token = response;
          this.router.navigate(['/vote']);
          this.logged_in = true;
        });
    }
  }
}
