import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PopoverController, NavParams } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../../services/env.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {

  album_id: number;
  view_count: number;
  view_list: any[];
  public loading: any;

  constructor(
    private httpClient: HttpClient, 
    private env: EnvService,
    public modalController: ModalController,
    public navParams:NavParams,
    private loadingController: LoadingController,
  ) { 
    this.album_id= this.navParams.get('album_id');
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  async ngOnInit() {
    await this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/visits/get`, {album_id: this.album_id})
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
                minutes = rs['past_time']['minutes'] + ' Mins Ago';
              }
            } else {
              minutes = ' Just Now ';
            }
            res[i]['past_time'] = days + hours + minutes;
          })
          this.view_count = res.length;
          this.view_list = res;
        }
        this.loadingController.dismiss();
      }, (err) => {
        console.log(err);
        this.loadingController.dismiss();
      });
    });

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
