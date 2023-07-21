import { Component, OnInit, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contacts',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  public env = environment;
  public logged = false;
  public idSaved: any;

  // Modela entidade form.
  public form = {
    name: '',
    email: '',
    subject: '',
    message: '',
    date: '',
    status: 'received'
  };
  public sending = false;
  public sended = false;

  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private general: GeneralService = inject(GeneralService);

  // Referência à coleção "contacts" no Firestore.
  // Se a coleção não existe, será criada.
  contactsCollection = collection(this.firestore, 'contacts');

  // Prepara a autenticação do usuário.
  authState = authState(this.auth);
  authStateSubscription = new Subscription;

  ngOnInit() {
    // Observer que obtém status de usuário logado.
    this.authStateSubscription = this.authState.subscribe(
      (userData: User | null) => {
        // Se tem alguém logado.
        if (userData) {
          this.logged = true;
          this.form.name = userData.displayName + '';
          this.form.email = userData.email + '';
          return
        }

        this.logged = false
      }
    )
  }

  ngOnDestroy() {
    // Remove o observer ao concluir o componente.
    this.authStateSubscription.unsubscribe()
  }

  // Salva contato.
  async sendForm() {
    // Se enviando(sending) for verdadeiro pare aqui, senão, continue.
    if (this.sending) return;
    this.sending = true;

    // Regex de email
    const regexEmail = /^[a-z0-9]+[a-z0-9._%+-]{2,}@[a-z0-9.-]+\.[a-z]{2,}$/;

    // Valida preenchimento dos campos.
    if (
      this.form.name.length < 3 ||
      !regexEmail.test(this.form.email.trim()) ||
      this.form.subject.length < 3 ||
      this.form.message.length < 5
    ) return;

    // Gera a data atual no formato ISO.
    const dt = new Date();
    this.form.date = dt.toISOString().split('.')[0].replace('T', ' ');

    // Salva contato no Firestore.
    await addDoc(this.contactsCollection, this.form)
      .then(
        (data) => {
          this.idSaved = data.id;
          this.sended = true
        }
      );
    this.general.formValues(this.form, null);
    this.form.status = 'received';
    this.sending = false
  }

  // Gera um nome aleatório.
  getRandomChars(n: number) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let sequence = '';
    for (let i = 0; i < n; i++) {
      const random = Math.floor(Math.random() * chars.length);
      sequence += chars.charAt(random)
    }
    return sequence
  }
}
