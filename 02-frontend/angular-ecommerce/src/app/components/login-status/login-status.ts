import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  standalone: false,
  selector: 'app-login-status',
  templateUrl: './login-status.html',
  styleUrl: './login-status.css'
})
export class LoginStatus implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.auth.isAuthenticated$.subscribe(isAuthenticated => {
    this.isAuthenticated = isAuthenticated;

    if (isAuthenticated) {
      this.auth.user$.subscribe(user => {
        this.userFullName = user?.name ?? '';
        const theEmail = user?.email;
        
        // Store email directly without JSON.stringify
        if (theEmail) {
          this.storage.setItem('userEmail', theEmail);
          console.log('Stored email:', theEmail); // Debug log
        }

        this.cdr.detectChanges();
      });
    }

    this.cdr.detectChanges();
  });
}

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin }
    });
  }
}
