import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { Platform, AlertController, NavController, LoadingController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  first_name: string;
  last_name: string;
  phone_number: string;
  errMsg = {};
  tc: boolean = false;

  public loading: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alert: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goLogin() {
    this.navCtrl.navigateForward('login', { animated: false });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  register() {
    let user = {first_name: this.first_name, last_name: this.last_name, phone_number: this.convertPhone(this.phone_number), tc: this.tc}
    this.presentLoading().then(() => {
      this.authService.register(user)
      .subscribe(value => {
      this.loadingController.dismiss();

        if(value) {
          this.router.navigate([`/otp/${this.phone_number}`]);
        } else {
          this.navCtrl.navigateRoot('/register');
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
        this.errMsg = err.error;
      })
    });
  }

  convertPhone(phone) {
    if(phone) {
      const num =  phone.replace(/[^\d]/g, '');
      return num;
    }
  }

}
