import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  // Injeta Firestore e Router.
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Identifica a coleção.
  private fbCollection = collection(this.firestore, 'things');

  // Armazena response da coleção para a view.
  public things: Observable<any>;

  public env = environment;

  constructor() {
    // Obtém coleção e armazena em 'things'.
    this.things = collectionData(this.fbCollection, { idField: 'id' }) as Observable<any>;
  }

  handleClick(index: number) {
    this.router.navigate(['view'], { state: { index } })
  }
}
