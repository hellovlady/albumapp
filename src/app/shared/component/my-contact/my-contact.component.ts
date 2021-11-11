import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../services/env.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-contact',
  templateUrl: './my-contact.component.html',
  styleUrls: ['./my-contact.component.scss'],
})
export class MyContactComponent implements OnInit {

  @Input() avatar: string;
  @Input() name: string;
  @Input() statusText: string;
  @Input() user_id: number;

  u_id: number;

  constructor(
    private route: Router,
    private authService: AuthService,
    private httpClient: HttpClient, 
    private env: EnvService,
    private alert: AlertController,
  ) {
    this.u_id = this.authService.getUser()['id'];
   }

  ngOnInit() {}

  // gotoUserAlbum(id) {
  //   this.checkBlockStatus(id);
  // }

  // checkBlockStatus(id) {
  //   this.httpClient.post(`${this.env.API_URL}/contacts/blockStatus`, {client_id: this.u_id, user_id: this.user_id})
  //   .subscribe((res) => {
  //     if(res) {
  //       if(res['block_status'] != 1) {
  //         this.warnContact();
  //       } else {
  //         this.route.navigate([`./user-album/${id}`]);
  //       }
  //     } else {
  //       this.route.navigate([`./user-album/${id}`]);
  //     }
  //   })
  // }

  // async warnContact() {
  //   const warnAlert = await this.alert.create({
  //     cssClass: 'warn-contact',
  //     header: "You can't visit this user's album because this user blocked you",
  //     buttons: [
  //       {
  //         text: 'Close',
  //         handler: (value) => {
  //         }
  //       }
  //     ]
  //   });
  //   await warnAlert.present();
  // }

}
