import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionSnapshots } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addDoc',
  templateUrl: './addDoc.page.html',
  styleUrls: ['./addDoc.page.scss'],
})
export class AddDocPage {
  public env = environment;
  public idSaved: any;

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
    status: ''
  };
  public sending = false;
  public sended = false;

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  public general: GeneralService = inject(GeneralService);

  // Referência à coleção "documents" no Firestore.
  // Se a coleção não existe, será criada.
  contactsCollection = collection(this.firestore, 'documents');

  // Salva contato.
  async sendForm() {
    // Valida preenchimento dos campos.
    if (
      this.form.name.length < 3 ||
      this.form.location.length < 3 ||
      this.form.description.length < 5 ||
      this.imagem.url === ''
    ) return;

    // Se enviando(sending) for verdadeiro pare aqui, senão, continue.
    if (this.sending) return;
    this.sending = true;

    try {
      // Cria um nome aleatório e dps cria uma referência para o novo arquivo.
      const nameImg = this.general.getRandomChars(10);
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
      this.form.imagem.name = nameImg;

      // Gera a data atual no formato ISO.
      const dt = new Date();
      this.form.date = dt.toISOString().split('.')[0].replace('T', ' ');

      // Define o status do documento como enviado(received)
      this.form.status = 'received';

      // Salva contato no Firestore.
      const data = await addDoc(this.contactsCollection, this.form);
      this.idSaved = data.id;
      this.sended = true

    } catch (error) {
      console.error('Opsss, deu erro', error)

    } finally {
      this.general.formValues(this.form, null);
      this.sending = false
    }
  }
}
