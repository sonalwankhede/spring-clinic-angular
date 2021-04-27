import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  invalidLogin = false;
  hide = true;

  @Input() error: string | null;
  @Output() isRegister: EventEmitter<Boolean> = new EventEmitter(false);
  showSpinner: boolean;

  constructor(private router: Router,
    private loginservice: AuthenticationService) { }

    openRegistrationForm: boolean = false;

  ngOnInit() {
  }

  checkLogin() {
    this.showSpinner = true;
    (this.loginservice.authenticate(this.username, this.password).subscribe(
      data => {
        this.router.navigate(['']);
        this.invalidLogin = false;
        this.showSpinner = false;
      },
      error => {
        this.invalidLogin = true;
        this.error = error.message;
        this.showSpinner = false;
      })
    );
  }
  redirectToRegisterationForm() {
    this.isRegister.emit(true);
  }
}