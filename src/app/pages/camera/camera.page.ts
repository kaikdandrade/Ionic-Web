import { Component, inject } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage {
  public env = environment;
  public photoURL: any;
  public photoFormat = '';
  public saved = false;
  public savedURL = '';
  private uploading = false;

  private storage: Storage = inject(Storage);

  // Obtém uma foto da API da câmera.
  getPhoto() {
    this.saved = false;
    this.savedURL = '';
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      // Retorna o arquivo da câmera no formato 'BASE64' (jpg).
      resultType: CameraResultType.DataUrl
    }).then((x) => {
      console.log('Foto escolhida: ', x);
      this.photoURL = x.dataUrl;
      this.photoFormat = x.format;
    }).catch(() => {
      // Ignore os erros
    })
  }

  // Salva a foto atual.
  savePhoto() {
    // Verifica se já esta fazendo upload se sim encerra por aqui, senão, segue em frente
    if (this.uploading) return;
    this.uploading = true;

    // Cria um nome aleatório para o novo arquivo.
    let storageRef = ref(this.storage, `${this.getRandomChars(10)}.${this.photoFormat}`);

    // Envia o arquivo para o servidor.
    uploadString(
      storageRef,
      // Extrai apenas o 'Base64' do arquivo.
      this.photoURL.split(',')[1],
      'base64',
      { contentType: `image/${this.photoFormat}` }
    ).then(() => {
      // Se salvou a imagem.
      // Obtém o URL da imagem salva.
      getDownloadURL(ref(storageRef))
        .then((response) => {
          alert('Imagem salva com sucesso!');
          this.savedURL = response;
          this.saved = true;
        })
    });

    this.uploading = false;
  }

  // Gera um nome aleatório.
  getRandomChars(n: number) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let sequence = '';
    for (let i = 0; i < n; i++) {
      const rndi = Math.floor(Math.random() * chars.length);
      sequence += chars.charAt(rndi);
    }
    return sequence;
  }
}
