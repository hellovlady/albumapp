import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../services/env.service';
import { Storage } from  '@ionic/storage';
import { PopoverController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})

export class UserPopoverComponent implements OnInit {

  httpOptions: {}
  token: string;
  client_phone_number: string;
  user_phone_number: string;

  constructor(
    private httpClient: HttpClient, 
    private env: EnvService,
    private storage: Storage,
    public navParams:NavParams,
    private alert: AlertController,
  ) {
    this.storage.get('TOKEN_INFO').then((info) => {
      this.token = info['token'];
      this.user_phone_number = info['phone_number'];
    });
    this.client_phone_number= this.navParams.get('phone_number');
   }

  ngOnInit() {
  }

  blockStatus(block_status) {
    const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', this.token);
    
    this.httpClient.put(`${this.env.API_URL}/contacts/block`, {user_phone_number: this.user_phone_number, client_phone_number: this.client_phone_number, block_status: block_status}, { headers })
    .subscribe((res) => {
      if(res) {
        if(res['status'] == 'warn') {
          this.warnContact(res['message']);
        } else {
          console.log(res['contactInfo']);
        }
      }
    })
  }

  async warnContact(msg) {
    const warnAlert = await this.alert.create({
      cssClass: 'warn-contact',
      header: `${msg}`,
      buttons: [
        {
          text: 'Close',
          handler: (value) => {
          }
        }
      ]
    });
    await warnAlert.present();
  }

}
