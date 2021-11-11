import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, NavController} from '@ionic/angular';
import { EnvService } from '../../../services/env.service';
import { Storage } from  '@ionic/storage';
import { EditAlbumPage } from 'src/app/edit-album/edit-album.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  providers: [EditAlbumPage]
})
export class AlbumComponent implements OnInit {
  @Input() thumbnail: string;
  @Input() url = 'caption';
  @Input() title: string;
  @Input() comments: number;
  @Input() edit: boolean;
  @Input() notification: number;
  @Input() album_id: number;
  @Input() album_name: string;
  @Input() up_url: string;
  @Input() caption: string;

  token: string;

  constructor(
    private alert: AlertController,
    private httpClient: HttpClient, 
    private env: EnvService,
    private storage: Storage,
    public editAlbum: EditAlbumPage,
    public route: NavController,
    public router: Router,
  ) { 
    this.storage.get('TOKEN_INFO').then((info) => {
      if(info) {
        this.token = info['token'];
      }
    });
  }

  ngOnInit() {}

  gotoCaption(id, up_url = '', caption = '') {
    if(up_url && caption) {
      this.savePhoto(id, up_url, caption)
    } else {
      this.router.navigate([`${this.url}/${id}`]);
    }
  }

  async editAlbumTitle(id, name) {
    const album_id = id;
    const album_name = name;
    if(album_id && album_name) {
      const statusAlert = await this.alert.create({
        cssClass: 'status-alert',
        header: 'Edit Album',
        inputs: [
          {
            name: 'album_name',
            type: 'text',
            value: album_name,
            placeholder: 'Please write your status'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (value) => {
              const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
              this.httpClient.put(`${this.env.API_URL}/albums/edit`, {newName: value.album_name, album_id: album_id}, { headers })
              .subscribe((res) => {
                if(res) {                
                    console.log(res);
                    this.editAlbum.getAlbum();
                }
              })
            }
          }
        ]
      });
      await statusAlert.present();
    }
  }

  savePhoto(id, up_url, caption) {
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
    this.httpClient.post(`${this.env.API_URL}/photos/save`, {album_id: id, uploadcare_url: up_url, caption: caption}, { headers })
    .subscribe((res) => {
      if(res) {
        console.log(res);
        this.route.navigateRoot('edit-album');
      }
    }, (err) => {
      console.log(err);
    })
  }
}
