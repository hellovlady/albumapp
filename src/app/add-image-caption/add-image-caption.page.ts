import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import uploadcare from 'uploadcare-widget';

@Component({
  selector: 'app-add-image-caption',
  templateUrl: './add-image-caption.page.html',
  styleUrls: ['./add-image-caption.page.scss'],
})
export class AddImageCaptionPage implements OnInit {

  cdn_url: string;
  caption: string;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private alert: AlertController,
    private env: EnvService,
    private navCtr: NavController,
    ) {
        this.route.queryParams.subscribe(params => {
          if (this.router.getCurrentNavigation().extras.state) {
            this.cdn_url= this.router.getCurrentNavigation().extras.state.cdn_url;
          }
      });
  }

  ngOnInit() {
  }

  async addPhoto() {
    let navigationExtras: NavigationExtras = { state: { uploadcare_url: this.cdn_url, caption: this.caption } };
    if(this.caption) {
      this.navCtr.navigateRoot('/select-album', navigationExtras);
    } else {
      const statusAlert = await this.alert.create({
        cssClass: 'status-alert',
        header: 'Please provide caption',
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
  }

}
