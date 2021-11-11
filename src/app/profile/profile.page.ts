import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { Storage } from  '@ionic/storage';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import uploadcare from 'uploadcare-widget';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  httpOptions: {};
  token: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  avatar: string;
  noavatar: boolean = true;
  user_id: number;
  public loading: any;

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private storage: Storage,
    private navCtrl: NavController,
    private alert: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
  ) { 
    if(this.authService.getUser() !== null) {
      this.user_id = this.authService.getUser()['id'];
    }
    this.storage.get('TOKEN_INFO').then((info) => {
      this.token = info['token'];
    });
  }

  ngOnInit() {
    this.getUserInfo();
  }

  goContactList() {
    this.navCtrl.navigateForward('/contact-list', { animated: false});
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 3000
    });
    return await this.loading.present();
  }

  getUserInfo() {
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/users/get`, {user_id: this.user_id})
      .subscribe((res) => {
        this.loadingController.dismiss();
        if(res) {
          this.first_name = res['first_name'];
          this.last_name = res['last_name'];
          this.phone_number = res['phone_number'];
          this.status = res['status'];
          if(res['avatar']) {
            this.avatar = res['avatar'];
            this.noavatar = false;
          }
        } else {
          this.noavatar = true;
        }
      }, (err) => {
        this.loadingController.dismiss();
        console.log(err);
      });
    });
  }

  updateProfile() {
    const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', this.token);
    this.httpClient.put(`${this.env.API_URL}/users/updateProfile`, {first_name: this.first_name, last_name: this.last_name, phone_number: this.convertPhone(this.phone_number)}, { headers })
    .subscribe((res) => {
      if(res) {
        if(res['status'] == 'success') {
          this.navCtrl.navigateRoot('/contact-list');
        }
      }
    })
  }

  async editStatus() {
    const statusAlert = await this.alert.create({
      cssClass: 'status-alert',
      header: 'Edit Status',
      inputs: [
        {
          name: 'user_status',
          type: 'textarea',
          value: this.status,
          placeholder: 'Please write your status'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (value) => {
            const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', this.token);
            this.httpClient.put(`${this.env.API_URL}/users/updateStatus`, {newStatus: value.user_status}, { headers })
            .subscribe((res) => {
              if(res) {                
                  console.log(res);
                  this.status = value.user_status;
              }
            })
          }
        }
      ]
    });
    await statusAlert.present();
  }

  uploadAvatar() {
    let dialog =  uploadcare.openDialog(null, {
      publicKey: this.env.PUBLICK_KEY,
      imageOnly: true,
      crop: this.env.PROFILE_SIZE
    });
    dialog.done(res => {
      if(res) {
        res.promise().done(async info => {
          this.presentLoading().then(() => {
            this.avatar = info.cdnUrl;
            this.noavatar = false;
            const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
            this.httpClient.put(`${this.env.API_URL}/users/updateAvatar`, { avatar_url: this.avatar }, { headers })
            .subscribe((res) => {
              if(res) {
                console.log(res['status']);
              }
              this.loadingController.dismiss();
            }, (err) => {
              console.log(err);
              this.loadingController.dismiss();
            });
          }, (err) => {
            console.log(err);
            this.loadingController.dismiss();
          });
        });
      } else {
        return;
      }
    });
  }

  signOut() {
    this.authService.logout();
  }

  convertPhone(phone) {
    if(phone) {
      const num =  phone.replace(/[^\d]/g, '');
      return num;
    }
  }

}
