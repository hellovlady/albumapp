import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  user_id: number;
  photo_list: any[];
  grid: any[][];
  rowCount: number;
  public loading: any

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private loadingController: LoadingController,
  ) { 
    this.user_id = this.authService.getUser()['id'];
  }

  ngOnInit() {
  }
  
  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  ionViewWillEnter() {
    this.getNewCommentList();
  }

  getNewCommentList() {
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/comments/getNewCommentPhoto`, { user_id: this.user_id })
      .subscribe((res : any[]) => {
        this.loadingController.dismiss();
        if(res) {
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
        }
      }, (err) => {
        this.loadingController.dismiss();
        console.log(err);
      });
    });
  }

}
