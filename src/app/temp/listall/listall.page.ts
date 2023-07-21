import { Component, OnInit, inject } from '@angular/core';
import { Storage, getDownloadURL, listAll, ref } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listall',
  templateUrl: './listall.page.html',
  styleUrls: ['./listall.page.scss'],
})
export class ListallPage implements OnInit {
  public env = environment;

  private storage: Storage = inject(Storage);
  public listImg: Array<any> = new Array();

  ngOnInit(): void {
    let storageRef = ref(this.storage);

    listAll(storageRef).then(
      (res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then(
            (response) => {
              this.listImg.push(response)
            }
          )
        })
      }
    )
  }
}
