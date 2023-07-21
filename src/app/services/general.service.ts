import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  formValues(destination: any, source: any) {
    if (source === null) {
      for (const key in destination) {
        if (Object.prototype.hasOwnProperty.call(destination, key)) {
          destination[key] = ''
        }
      }
      return
    }

    for (const key in source) {
      destination[key] = source[key]
    }
  }

  // Obtém uma foto da API da câmera.
  getPhoto(imagem: object) {
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      // Retorna o arquivo da câmera no formato 'BASE64' (jpg).
      resultType: CameraResultType.DataUrl
    }).then((cam) => {
      this.formValues(imagem, { 'url': cam.dataUrl, 'format': cam.format, 'uploaded': true })
    }).catch(() => {
      // Ignore os erros
    })
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

  public formatText(str: string): string {
    if (!str.trim().match(/[./]$/)) {
      return str.trim() + "."
    }
    return str.trim()
  }
}
