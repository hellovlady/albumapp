import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  @Input() avatar: string;
  @Input() phone: string;
  @Input() name: string;
  @Input() block: boolean;
  @Input() notification: number;
  @Input() user_id: number;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private alert: AlertController,
  ) { }

  ngOnInit() {}

  goUserAlbumPage(id: number, phone_number: string, block: number) {
    if(block == 0) {
      this.warnContact();
      return;
    }
    let navigationExtras: NavigationExtras = { state: { phone_number } };
    this.navCtrl.navigateRoot(`/user-album/${id}`, navigationExtras);
  }

  async warnContact() {
    const warnAlert = await this.alert.create({
      cssClass: 'warn-contact',
      header: "You can't visit this user's album because this user blocked you",
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
