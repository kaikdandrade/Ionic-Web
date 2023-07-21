import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.page.html',
  styleUrls: ['./e404.page.scss'],
})
export class E404Page {
  public env = environment;
}
