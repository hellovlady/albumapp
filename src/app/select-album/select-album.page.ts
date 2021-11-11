import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, AlertController, LoadingController, Config } from '@ionic/angular';
import { UserPopoverComponent } from '../shared/component/user-popover/user-popover.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-select-album',
  templateUrl: './select-album.page.html',
  styleUrls: ['./select-album.page.scss'],
})
export class SelectAlbumPage implements OnInit {

  currentPopover: null;
  user_id: number;
  album_list: any[];
  grid: any[][];
  rowCount: number;

  first_name: string;
  last_name: string;
  total_likes: number;
  status: string;

  uploadcare_url: string;
  caption: string;
  token: string;
  public loading: any;

  constructor(
    public popoverController: PopoverController,
    private route: ActivatedRoute, 
    private router: Router,
    private httpClient: HttpClient, 
    private env: EnvService,
    private alert: AlertController,
    private storage: Storage,
    private authService: AuthService,
    private loadingController: LoadingController,
    private config: Config,
    ) {
      this.user_id = this.authService.getUser()['id'];
      this.storage.get('TOKEN_INFO').then((info) => {
        if(info) {
          this.token = info['token'];
        }
      });
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.uploadcare_url= this.router.getCurrentNavigation().extras.state.uploadcare_url;
          this.caption = this.router.getCurrentNavigation().extras.state.caption;
        }
      });
  }

  ngOnInit() {
    this.getAlbum();
    this.config.set('animated', true);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  getAlbum() {
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/albums/get`, {user_id: this.user_id}).subscribe((res: any[]) => {
        this.loadingController.dismiss();
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

  async createAlbumModal() {
    const album_alert = await this.alert.create({
      cssClass: 'photo-alert',
      header: 'New Album',
      inputs: [
        {
          name: 'album',
          type: 'text',
          placeholder: 'Please type your album name',
          value: '',
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
            if(!value.album) return;
            const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', this.token);
            this.httpClient.post(`${this.env.API_URL}/albums/create`, { name: value.album }, { headers })
            .subscribe((res) => {
              if(res) {                
                  this.getAlbum();
              }
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    await album_alert.present();
  }

}
