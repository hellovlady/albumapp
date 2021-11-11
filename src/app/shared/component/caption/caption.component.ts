import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../services/env.service';
import { CaptionPage } from 'src/app/caption/caption.page';
import { Storage } from  '@ionic/storage';

@Component({
  selector: 'app-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent implements AfterViewInit {
  @Input() thumbnail: string;
  @Input() url: string;
  @Input() title: string;
  @Input() comments: number;
  @Input() notification: number;
  @Input() photo_id: number;
  @ViewChild('caption', { read: ElementRef }) caption: ElementRef;

  longPressActive = false;
  edit = false;
  disableedit = false;
  user_id: number;
  token: string;

  constructor(
    private router: Router,
    private gestureCtrl: GestureController,
    public route: ActivatedRoute,
    public authService: AuthService,
    private httpClient: HttpClient, 
    private env: EnvService,
    private alert: AlertController,
    private captionPage: CaptionPage,
    private storage: Storage,
  ) {
    this.user_id = this.authService.getUser()['id'];
    this.storage.get('TOKEN_INFO').then((info) => {
      if(info) {
        this.token = info['token'];
      }
    });
   }

  ngAfterViewInit() {
    const longPress = this.gestureCtrl.create({
      el: this.caption.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        if (this.edit) {
          this.disableedit = true;
        } else {
          this.longPressActive = true;
          this.disableedit = false;
          this.longPress();
        }
      },
      onEnd: ev => {
        this.longPressActive = false;
        if(!this.edit && !this.disableedit) {
          this.router.navigate([`/image-view/${this.photo_id}`]);
        }
        if(this.edit && this.disableedit) {
          this.edit = false;
        }
      }
    }, true); // Passing true will run the gesture callback inside of NgZone!

    // Don't forget to enable!
    longPress.enable(true);
  }

  longPress(timeout = 200) {
    setTimeout(() => {
      this.checkAbleEdit(this.photo_id);
    }, timeout);
  }

  checkAbleEdit(id: number) {
    this.httpClient.post(`${this.env.API_URL}/users/getByPhoto`, {photo_id: id})
    .subscribe((res) => {
      if(res) {
        if(res['user_id'] == this.user_id) {
          if (this.longPressActive) {
            this.edit = true;
          }
        } else {
          this.edit = false;
        }
      } else {
        this.edit = false;
      }
    })
  }

  async editCaption(id) { 
    this.edit = true;
    console.log(id);

    const album_alert = await this.alert.create({
      cssClass: 'photo-alert',
      header: 'Edit Photo',
      inputs: [
        {
          name: 'caption',
          type: 'text',
          value: this.title,
          placeholder: 'Please type your status'
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
            this.httpClient.put(`${this.env.API_URL}/photos/edit`, {newCaption: value.caption, photo_id: id}, { headers })
            .subscribe((res) => {
              if(res) {                
                  this.captionPage.getPhoto();
              }
            })
          }
        }
      ]
    });
    await album_alert.present();
  }

  async deleteCaption(id) {
    this.edit = true;
    const photo_id = id;
    const delete_album_alert = await this.alert.create({
      cssClass: 'photo-alert',
      header: 'Delete This Photo?',
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
          handler: () => {
            const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', this.token);
            this.httpClient.delete(`${this.env.API_URL}/photos/delete/${photo_id}`)
            .subscribe((res) => {
              if(res) {                
                  console.log(res);
                  this.captionPage.getPhoto();
              }
            })
          }
        }
      ]
    });
    await delete_album_alert.present();
  }
}
