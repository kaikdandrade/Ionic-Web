import { Component, OnInit, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { getStorage, ref, deleteObject } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  public env = environment;
  public alertDelete = false;
  public alertButtons = [
    {
      text: 'Cancel',
      handler: () => {
        this.alertDelete = false
      }
    },
    {
      text: 'Confirm',
      handler: () => {
        this.delDoc()
      }
    }
  ];
  public deleting = false;

  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  public general: GeneralService = inject(GeneralService);

  // Armazena id do documento
  public docId = '';

  // Armazena documento
  private docSnap !: DocumentSnapshot;

  // Armazena dados do documento para a view
  public documents: any;

  async ngOnInit() {
    // Recupera o index da rota via get, porém, o nosso é via post
    // this.docId = this.activatedRoute.snapshot.paramMap.get('id') as string

    // Via post
    this.docId = (history.state.index === undefined) ? '0' : history.state.index;

    // Se não tiver nenhum dado no post volta para o ínicio
    if (this.docId == '0') this.router.navigate(['/home']);

    // Obtém o documento pelo Id
    this.docSnap = await getDoc(doc(this.firestore, 'documents', this.docId));

    // Extrai dados do documento
    this.documents = this.docSnap.data()
  }

  ngOnDestroy() {
    this.general.formValues(this.documents, null)
  }

  editDoc(indice: string) {
    this.router.navigate(['/edit'], { state: { index: indice } })
  }

  async delDoc() {
    this.deleting = true;

    // O trecho de código abaixo não deve ir para um aplicativo final de uma empresa
    // Ela é apenas para limpar o storage do meu firebase
    const storage = getStorage();
    const desertRef = ref(storage, `${this.documents.imagem.name}.${this.documents.imagem.format}`);

    // Deleta o arquivo
    await deleteObject(desertRef).catch((error) => {
      console.log("Erro ao deletar a imagem", error);
      return
    });

    // O método 'updateDoc()' do Firestore atualiza um campo de um documento
    await updateDoc(
      await doc(this.firestore, 'documents', this.docId),  // Referência do documento
      { 'status': 'deleted' }                        // campo: valor a ser alterado
    ).then(() => {
      this.deleting = false;
      setTimeout(() => {
      this.router.navigate(['/home'])
      }, 1000)
    })
  }
}
