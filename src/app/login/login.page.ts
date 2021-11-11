import { Component, OnInit, Injectable  } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

@Injectable({
  providedIn: 'root'
})

export class LoginPage implements OnInit {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number: string;
  device: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  login_error: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  errMsg: {};
  plt: string;

  public loading: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alert: AlertController,
    private router: Router,
  ) {
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.navCtrl.navigateRoot('/contact-list');
    }
  }

  goRegister() {
    this.navCtrl.navigateForward('register', { animated: false });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  login() {
    this.presentLoading().then(()=>{
      this.authService.login(this.convertPhone(this.phone_number))
      .subscribe(value => {
        if(value) {
          this.router.navigateByUrl(`/otp/${this.phone_number}`);
          // this.navCtrl.navigateRoot('/contact-list');
        } else {
          this.navCtrl.navigateRoot('/login');
        }
        this.loadingController.dismiss();
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
          setTimeout(() => {
            this.errMsg = '';
            this.phone_number = '';
          }, 2000);
      });
    });
  }

  convertPhone(phone) {
    if(phone) {
      const num =  phone.replace(/[^\d]/g, '');
      return num;
    }
  }
}
