import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ViewComponent } from '../shared/component/modal/view/view.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { Storage } from  '@ionic/storage';

@Component({
  selector: 'app-caption-page',
  templateUrl: './caption.page.html',
  styleUrls: ['./caption.page.scss'],
})
export class CaptionPage implements OnInit {

  album_id: number;
  photo_list: any[];
  grid: any[][];
  rowCount: number;
  album_name: string;
  user_name: string;
  user_id: number;
  like_count: number;
  token: string;
  public loading: any;

  constructor(
    public modalController: ModalController,
    public route: ActivatedRoute,
    private httpClient: HttpClient, 
    private env: EnvService,
    private storage: Storage,
    private loadingController: LoadingController,
  ) { 
    this.album_id = Number(this.route.snapshot.paramMap.get('id'));
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

  async handleModal() {

    const modal = await this.modalController.create({
      component: ViewComponent,
      cssClass: 'view-modal-class',
      componentProps: {album_id: this.album_id}
    });

    return await modal.present();
  }

  async getInitData() {
      await this.getUserInfoInCaption();
      this.storage.get('TOKEN_INFO').then((info) => {
        if(info) {
          this.token = info['token'];
          this.createVisit(this.token);
        }
      });
      await this.getPhoto();
  }

  getPhoto() {
    this.presentLoading().then(() => {

    this.httpClient.post(`${this.env.API_URL}/photos/getByAlbum`, {album_id: this.album_id}).subscribe((res: any[]) => {
      this.loadingController.dismiss();
      this.photo_list = res;
      this.rowCount = Math.floor(res.length / 2);

      let rowNum = 0;
      if(this.photo_list) {
        this.grid = [];
        for (let i = 0; i < this.photo_list.length; i += 2) { 
          this.grid[rowNum] = Array(2); 
           if (this.photo_list[i]) { 
            this.grid[rowNum][0] = this.photo_list[i]
           }
           if (this.photo_list[i + 1]) { 
            this.grid[rowNum][1] = this.photo_list[i + 1]
           }
           rowNum++; 
        }
      }
    }, (err) => {
      this.loadingController.dismiss();
      console.log(err);
    });
  
  });
  }

  getUserInfoInCaption() {
    this.httpClient.post(`${this.env.API_URL}/albums/getUserInfoByAlbumId`, {album_id: this.album_id}).subscribe((res: any[]) => {
      this.user_name = res['first_name'] + ' ' + res['last_name'];
      this.album_name = res['album_name'];
      this.user_id = res['user_id'];

      let by = {
        album_id: this.album_id
      }
      this.httpClient.post(`${this.env.API_URL}/likes/get`, {user_id: this.user_id, by: by}).subscribe((res: any[]) => {
        this.like_count = res['like_count'];
      })
    })
  }

  createVisit(token) {
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', token);
    const album_id = this.album_id;

    this.httpClient.post(`${this.env.API_URL}/visits/create`, { album_id }, { headers })
    .subscribe((res) => {
      if(res) {
        console.log(res);
      }
    }, (err) => console.log(err));
  }

}
