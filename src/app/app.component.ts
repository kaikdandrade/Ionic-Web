import { Component, inject } from '@angular/core';
import { environment } from './../environments/environment';
import { Auth, authState, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public env = environment;
  private auth: Auth = inject(Auth);
  authState = authState(this.auth);
  authStateSubscription: Subscription;

  public appPages = [
    { title: 'Ínicio', url: '/home', icon: 'home' },
    { title: 'Faça contato', url: '/contact', icon: 'chatbox-ellipses' },
    { title: 'Tirar foto', url: '/camera', icon: 'camera' },
    { title: 'Novo documento', url: '/addDoc', icon: 'document-text' },
    { title: 'Sobre', url: '/about', icon: 'information-circle' },
    { title: 'Privacidade', url: '/policies', icon: 'document-lock' }
  ];

  public labels = ['Família', 'Amigos', 'Nota', 'Trabalho', 'Viagem', 'Lembrete'];

  public appUser = {
    logged: false,
    title: 'Login / Entrar',
    url: '/login',
    icon: 'log-in',
    avatar: ''
  }

  constructor() {
    this.authStateSubscription = this.authState.subscribe((aUser: User | null) => {
      if (aUser !== null) {
        this.appUser = {
          logged: true,
          title: aUser.displayName + '',
          url: '/profile',
          icon: 'log-out',
          avatar: aUser.photoURL + ''
        }
      }
    })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }
}
