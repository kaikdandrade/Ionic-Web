import { Component, OnInit, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  // Injeta Firestore e Router.
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Armazena id do documento.
  private docId: string = '';

  // Armazena documento.
  private docSnap !: DocumentSnapshot;

  // Armazena dados do documento para a view.
  public thing: any;

  async ngOnInit() {
    // Recupera o Id da rota.
    // this.docId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.docId = (history.state.index === undefined) ? '0' : history.state.index;
    
    if(this.docId == '0') this.router.navigate(['/home']);

    // Obtém o documento pelo Id.
    this.docSnap = await getDoc(doc(this.firestore, 'things', this.docId));

    // Extrai dados do documento.
    this.thing = this.docSnap.data();
  }
}
