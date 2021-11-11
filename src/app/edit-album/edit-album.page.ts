import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { Storage } from  '@ionic/storage';
import { LoadingController, NavController, Config } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.page.html',
  styleUrls: ['./edit-album.page.scss'],
})
export class EditAlbumPage implements OnInit {

  httpOptions: {}
  token: string;
  first_name: string;
  last_name: string;
  status: string;
  user_id: number;
  album_list: any[];
  grid: any[][];
  rowCount: number;
  public loading: any;

  constructor(
    private httpClient: HttpClient, 
    private env: EnvService,
    private storage: Storage,
    private navCtrl: NavController,
    private alert: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private config: Config,
  ) { 
    this.storage.get('TOKEN_INFO').then((info) => {
      this.token = info['token'];
    });
  }

  ngOnInit() {
    this.getAlbum();
    this.getUserInfo(this.authService.getUser()['id']);
    this.config.set('animated', true);
  }

  getUserInfo(id) {
    this.httpClient.post(`${this.env.API_URL}/users/get`, {user_id: id}).subscribe((res : any) => {
      this.first_name = res.first_name;
      this.last_name = res.last_name;
      this.status = res.status;
    }, (err) => {
      console.log(err);
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  public getAlbum() {
    this.user_id = this.authService.getUser()['id'];
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/albums/get`, {user_id: this.user_id}).subscribe((res: any[]) => {
        this.album_list = res;
        this.rowCount = Math.floor(res.length / 2);
        let rowNum = 0;
        if(this.album_list) {
        this.loadingController.dismiss();

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
      // setTimeout(() => {
      //   this.loadingController.dismiss();
      // }, 2000);
    });
  }

}
