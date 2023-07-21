import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, updateDoc, doc, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Storage, getStorage, deleteObject, getDownloadURL, ref, uploadString, listAll } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { CameraResultType, Camera } from '@capacitor/camera';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  public env = environment;
  public alertSend = false;
  public alertButtons = [
    {
      text: 'Cancel',
      handler: () => {
        this.alertSend = false
      }
    },
    {
      text: 'Confirm',
      handler: () => {
        this.sendForm()
      }
    }
  ];

  // Modela entidade imagem
  public imagem = {
    url: '',
    format: '',
    uploaded: false
  };

  // Modela entidade form.
  public form = {
    name: '',
    location: '',
    description: '',
    imagem: {
      url: '',
      name: '',
      format: ''
    },
    date: '',
    status: 'received'
  };
  public sending = false;
  private docId = '0';

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private router: Router = inject(Router);
  public general: GeneralService = inject(GeneralService);

  // Referência à coleção "documents" no Firestore.
  // Se a coleção não existe, será criada.
  contactsCollection = collection(this.firestore, 'documents');

  // Armazena documento
  private docSnap !: DocumentSnapshot;

  // Armazena dados do documento para edição
  public documents: any;

  async ngOnInit() {
    // Recupera o index via post
    this.docId = (history.state.index === undefined) ? '0' : history.state.index;

    // Se não tiver nenhum dado no post volta para o ínicio
    if (this.docId == '0') this.router.navigate(['/home']);

    // Obtém o documento pelo Id
    this.docSnap = await getDoc(doc(this.firestore, 'documents', this.docId));

    // Extrai dados do documento
    this.documents = this.docSnap.data();

    // Adiciona os dados do documento no formulário
    this.general.formValues(this.form, this.documents);
  }

  ngOnDestroy() {
    this.general.formValues(this.form, null);
    this.general.formValues(this.documents, null)
  }

  async sendForm() {
    // Valida preenchimento dos campos.
    if (
      this.form.name.length < 3 ||
      this.form.location.length < 3 ||
      this.form.description.length < 5 ||
      this.form.imagem.url === ''
    ) return;

    // Se enviando(sending) for verdadeiro pare aqui, senão, continue.
    if (this.sending) return;
    this.sending = true;

    try {
      var nameImg = this.form.imagem.name;
      if (this.imagem.uploaded) {
        const storage = getStorage();
        const desertRef = ref(storage, `${this.form.imagem.name}.${this.form.imagem.format}`);

        // Deleta o arquivo
        await deleteObject(desertRef).catch((error) => {
          console.log("Erro ao deletar a imagem", error);
          return
        });

        // Cria um nome aleatório para o novo arquivo.
        nameImg = this.general.getRandomChars(10);
        const storageRef = ref(this.storage, `${nameImg}.${this.imagem.format}`);

        // Envia o arquivo para o servidor.
        await uploadString(
          storageRef,
          // Extrai apenas o 'Base64' do arquivo.
          this.imagem.url.split(',')[1],
          'base64',
          { contentType: `image/${this.imagem.format}` }
        );

        // Se salvou a imagem, obtém o URL da imagem salva.
        const res = await getDownloadURL(ref(storageRef));
        this.form.imagem.url = res;
        this.form.imagem.format = this.imagem.format;
      }

      // O método 'updateDoc()' do Firestore atualiza um campo de um documento
      await updateDoc(
        doc(this.firestore, 'documents', this.docId),   // Referência do documento
        {                                               // campos + valores a serem alterados
          'name': this.form.name,
          'location': this.form.location,
          'description': this.form.description,
          'imagem': {
            'url': this.form.imagem.url,
            'format': this.form.imagem.format,
            'name': nameImg
          }
        }
      )

    } catch (error) {
      console.error('Erro ao enviar o formulário', error);
      this.sending = false;
      return

    } finally {
      this.general.formValues(this.form, null);
      this.general.formValues(this.documents, null);
      this.sending = false;
      setTimeout(() => {
        this.router.navigate(['/home'])
      }, 1000)
    }
  }
}
