import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, query, where, doc, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public env = environment;

  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  public general: GeneralService = inject(GeneralService);

  // Identifica a coleção.
  private Collection = collection(this.firestore, 'documents');
  // Declara a variável para armazenar a referência do onSnapshot
  private unsubscribeSnapshot: Function | null = null;

  // Varíavel com observable
  public documentsId: Array<any> = new Array();
  public documents: Array<any> = new Array();

  ngOnInit(): void {
    this.getDocuments()
  }

  ngOnDestroy() {
    this.documents = [];
    this.documentsId = [];

    // Cancela a inscrição anterior antes de criar uma nova
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot()
    }
  }

  getDocuments() {
    this.documents = [];
    this.documentsId = [];

    // Cancela a inscrição anterior antes de criar uma nova
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot()
    }

    const q = query(this.Collection, where("status", "==", "received"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          this.documentsId.push(change.doc.id);
          this.documents.push(change.doc.data())
        }

        if (change.type === "modified") {
          for (let i = 0; i < this.documentsId.length; i++) {
            if (this.documentsId[i] === change.doc.id) {
              this.documents.splice(i, 1);
              this.documents.splice(i, 0, change.doc.data());
              break
            }
          }
        }

        if (change.type === "removed") {
          for (let i = 0; i < this.documents.length; i++) {
            if (this.arraysEqual(this.documents[i], change.doc.data())) {
              this.documents.splice(i, 1);
              break
            }
          }

          for (let i = 0; i < this.documentsId.length; i++) {
            if (this.documentsId[i] === change.doc.id) {
              this.documentsId.splice(i, 1);
              break
            }
          }
        }
      })
    })
  }

  arraysEqual(arr1: any, arr2: any): boolean {
    if (arr1.length !== arr2.length) {
      return false
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }

    return true
  }

  viewDoc(index: number) {
    this.router.navigate(['/view'], { state: { index } })
  }
}
