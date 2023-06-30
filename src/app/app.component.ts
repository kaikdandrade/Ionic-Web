import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  public env = environment;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Faça contato', url: '/contact', icon: 'chatbox-ellipses' },
    { title: 'Sobre', url: '/about', icon: 'information-circle'}
  ];
  public labels = ['Família', 'Amigos', 'Nota', 'Trabalho', 'Viagem', 'Lembrete'];
  constructor() {}
}
