import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.loginWithRedirect();
  }
}
