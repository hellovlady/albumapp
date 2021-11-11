import { Component, OnInit } from '@angular/core';
import { AlertController, IonRouterOutlet, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { ImagePopoverComponent } from '../shared/component/image-popover/image-popover.component';
import { CommentModalComponent } from '../shared/component/modal/comment-modal/comment-modal.component';
import { ViewComponent } from '../shared/component/modal/view/view.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AuthService } from '../services/auth/auth.service';
import { Storage } from  '@ionic/storage';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

// import { Share } from '@capacitor/share';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {

  photo_id: number;
  caption: string;
  uploadcare_url: string;
  user_id: number;
  like_status: boolean;
  no_like_status: boolean;
  like_count: number;
  client_id: number;
  token: string;
  album_id: number;
  public loading: any;

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private storage: Storage,
    private loadingController: LoadingController,
    private alert: AlertController,
    private socialSharing: SocialSharing,
    )
    {
      this.user_id = this.authService.getUser().id;
      this.photo_id = Number(this.route.snapshot.paramMap.get('id'));
      this.storage.get('TOKEN_INFO').then((info) => {
        if(info) {
          this.token = info.token;
        }
      });
    }

  ngOnInit() {
    this.getInitData();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  async handleImage(ev: any) {
    const popover = await this.popoverController.create({
      component: ImagePopoverComponent,
      cssClass: 'imageview-popover-class',
      event: ev,
      translucent: true,
      componentProps: {photo_url: this.uploadcare_url, caption: this.caption}
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async handleModal() {
    const modal = await this.modalController.create({
      component: CommentModalComponent,
      cssClass: 'comment-modal-class',
      backdropDismiss: true,
      componentProps: {
        photo_id: this.photo_id, 
        album_id: this.album_id, 
        client_id: this.client_id
      }
    });

    return await modal.present();
  }

  async getInitData() {
      await this.getLikeStatus();
      await this.getLikeCount();
      await this.getPhotoInfo();
  }

  getPhotoInfo() {
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/photos/get`, { photo_id: this.photo_id })
      .subscribe((res) => {
        this.loadingController.dismiss();
        if(res) {
          this.album_id = res['album_id'];
          this.caption = res['caption'];
          this.uploadcare_url = res['uploadcare_url'];
        }
      }, async (err) => {
        this.loadingController.dismiss();
        if(err.status === 0) {
          const statusAlert = await this.alert.create({
            cssClass: 'status-alert',
            header: 'Server is not available',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              }
            ]
          });
          await statusAlert.present();
        }
        console.log(err);
      });
    });
  }

  // like_status = 0: not like
  // like_status = 1: like
  // like_status = 2: no record
  getLikeStatus() {
    this.httpClient.post(`${this.env.API_URL}/likes/getLikeStatus`, {photo_id: this.photo_id, user_id: this.user_id})
    .subscribe((res) => {
      if(res) {
        // this.like_status = res['like_status'];
        if(res['like_status'] == 1) {
          this.like_status = true;
        } else {
          this.no_like_status = true;
        }
      } else {
        // this.like_status = 2;
        this.no_like_status = true;
      }
    }, (err) => {
      console.log(err);
    });
  }

  getLikeCount() {
    this.httpClient.post(`${this.env.API_URL}/photos/getUserInfoByPhotoId`, {photo_id: this.photo_id}).subscribe((res: any[]) => {
      this.client_id = res['user_id'];
      const by = {
        photo_id: this.photo_id
      };
      this.httpClient.post(`${this.env.API_URL}/likes/get`, {user_id: this.client_id, by}).subscribe((res: any[]) => {
        this.like_count = res['like_count'];
      });
    }, (err) => {
      console.log(err);
    });
  }

  giveLike() {
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
    const photo_id = this.photo_id;

    this.httpClient.post(`${this.env.API_URL}/likes/give`, { photo_id }, { headers })
    .subscribe((res) => {
      if(res) {
        if(res['like_status'] == 1) {
          this.like_status = true;
          this.no_like_status = false;
        } else {
          this.no_like_status = true;
          this.like_status = false;
        }
        if(res['like_status'] == undefined || res['like_status'] == null) {
          this.like_status = true;
          this.no_like_status = false;
        }
        this.getLikeCount();
      }
    }, (err) => {
      console.log(err);
    });
  }

  async socialShare() {
    this.socialSharing.share('Really awesome thing you need to see right now', 'Social Sharing @lbum APP', null, this.uploadcare_url);
  }

}
