import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public env = environment;
private auth: Auth = inject(Auth);

  constructor() { }

  login() {
    if (this.env.signInMethod == 'redirect')
      signInWithRedirect(this.auth, new GoogleAuthProvider());
    else
      signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}
