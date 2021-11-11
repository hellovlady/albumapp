import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';

import { EnvService } from '../../../../services/env.service';

import uploadcare from 'uploadcare-widget';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss'],
})
export class AddImageComponent implements OnInit {

  photos: Array<string>;
  public loading: any;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private route: NavController,
    private env: EnvService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

   uploadcare() {
    let dialog =  uploadcare.Widget("#uploader", {
      publicKey: this.env.PUBLICK_KEY,
      imageOnly: true,
      crop: this.env.ALBUM_SIZE,
    });

    dialog.openDialog().done(res => {
      res.promise().done( async info => {
        this.presentLoading().then(async () => {
          this.dismiss();
          this.photos = await info.cdnUrl;
          let navigationExtras: NavigationExtras = await { state: { cdn_url: this.photos } };
          await this.route.navigateRoot('/add-image-caption', navigationExtras);
          this.loadingController.dismiss();
        });
      });
    });
  }
}
