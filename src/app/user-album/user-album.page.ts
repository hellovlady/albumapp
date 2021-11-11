import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, LoadingController, AlertController, Config } from '@ionic/angular';
import { UserPopoverComponent } from '../shared/component/user-popover/user-popover.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { ResponseUserInfo } from './response-user';

@Component({
  selector: 'app-user-album',
  templateUrl: './user-album.page.html',
  styleUrls: ['./user-album.page.scss'],
  providers: [NavParams]
})

export class UserAlbumPage implements OnInit {

  currentPopover: null;
  user_id: number;
  album_list: any[];
  grid: any[][];
  rowCount: number;

  first_name: string;
  last_name: string;
  total_likes: number;
  status: string;
  showAlbum: boolean;
  phone_number: string;

  public loading: any;

  constructor(
    public popoverController: PopoverController,
    public route: ActivatedRoute,
    private httpClient: HttpClient, 
    private env: EnvService,
    private router: Router,
    private loadingController: LoadingController,
    private alert: AlertController,
    private config: Config,
    ) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.phone_number= this.router.getCurrentNavigation().extras.state.phone_number;
        }
      });
      this.user_id = Number(this.route.snapshot.paramMap.get('id'));
    }

  ngOnInit() {
    this.getInitData();
    this.config.set('animated', true);
  }
  
  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  async handleUser(ev: any) {
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      cssClass: 'user-popover-class',
      event: ev,
      translucent: true,
      componentProps: {phone_number: this.phone_number}
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async getInitData() {
    await this.presentLoading().then(async () => {
      await this.getAlbum();
      await this.getUserInfo();
      await this.getTotalLikes();
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 2000);
    });
  }

  getAlbum() {
    this.httpClient.post(`${this.env.API_URL}/albums/get`, {user_id: this.user_id}).subscribe((res: any[]) => {
      this.album_list = res;
      this.rowCount = Math.floor(res.length / 2);

      let rowNum = 0;
      if(this.album_list) {
        this.grid = [];
        for (let i = 0; i < this.album_list.length; i += 2) { 
          this.grid[rowNum] = Array(2); 
           if (this.album_list[i]) { 
             if(this.album_list[i]['uploadcare_url']) {
               this.album_list[i]['isAlbumImage'] = true;
               this.album_list[i]['noAlbumImage'] = false;
             } else {
              this.album_list[i]['isAlbumImage'] = false;
              this.album_list[i]['noAlbumImage'] = true;
             }
              this.grid[rowNum][0] = this.album_list[i];
           }
           if (this.album_list[i + 1]) { 
            if(this.album_list[i + 1]['uploadcare_url']) {
              this.album_list[i + 1]['isAlbumImage'] = true;
              this.album_list[i + 1]['noAlbumImage'] = false;
            } else {
             this.album_list[i + 1]['isAlbumImage'] = false;
             this.album_list[i + 1]['noAlbumImage'] = true;
            }
            this.grid[rowNum][1] = this.album_list[i + 1]
           }
           rowNum++; 
        }
        console.log(this.grid);
      }
    }, async (err) => {
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
    })
  }

  getUserInfo() {
    this.httpClient.post(`${this.env.API_URL}/users/get`, {user_id: this.user_id})
    .subscribe((res : ResponseUserInfo) => {
      this.first_name = res['first_name'];
      this.last_name = res['last_name'];
      this.status = res['status'];
    })
  }

  getTotalLikes() {
    this.httpClient.post(`${this.env.API_URL}/likes/get`, {user_id: this.user_id})
    .subscribe((res : ResponseUserInfo) => {
      this.total_likes = res['total_likes'];
    })
  }
}
