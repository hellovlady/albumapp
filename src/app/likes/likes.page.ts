import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController, Config } from '@ionic/angular';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.page.html',
  styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit {

  user_id: number;
  like_list: any[];
  public loading: any;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private env: EnvService,
    private loadingController: LoadingController,
    private config: Config,
  ) { 
    this.user_id = this.authService.getUser()['id'];
  }

  ngOnInit() {
    this.getLikeList();
    this.config.set('animated', true);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  getLikeList() {
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/likes/getLists`, { user_id: this.user_id })
      .subscribe((res : any[]) => {
        if(res) {
          let days = '', hours = '', minutes = '';
          res.map((rs, i) => {
            if(rs['past_time']['days']) {
              days = rs['past_time']['days'] + ' Days ';
            }
            if(rs['past_time']['hours']) {
              hours = rs['past_time']['hours'] + ' Hours ';
            }
            if(rs['past_time']['minutes']) {
              if(rs['past_time']['minutes'] <= 1) {
                minutes = ' Just Now ';
              } else {
                minutes = rs['past_time']['minutes'] + ' Mins ';
              }
            }
            res[i]['past_time'] = days + hours + minutes;
          })
          this.like_list = res;
        }
        this.loadingController.dismiss();
      }, (err) => {
        console.log(err);
        this.loadingController.dismiss();
      });
    }) ;
  }

}
