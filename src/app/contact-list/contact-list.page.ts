import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AddImageComponent } from '../shared/component/modal/add-image/add-image.component';
import { Storage } from  '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})

export class ContactListPage implements OnInit {

  httpOptions: {}
  searchValue: string;
  contactStatus: number;
  user_id: number;
  user_avatar: string;
  token: string;

  comment_count: number;
  like_count: number;
  contact_list: any;
  contact_list_value: any;
  recent_contact_list: any;
  phone_number: string;

  public loading: any;
  public globalInterval: any;

  constructor(
    public modalController: ModalController,
    private storage: Storage,
    private httpClient: HttpClient,
    private authService: AuthService,
    private env: EnvService,
    private loadingController: LoadingController,
    private alert: AlertController,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.user_id = this.authService.getUser()['id'];
    this.phone_number = this.authService.getUser()['phone_number'];
    this.storage.get('TOKEN_INFO').then(async res => {
      if(res) {
        this.token = await res['token'];
      }
    });

  }

  goProfile() {
    this.navCtrl.navigateForward('profile', { animated: false });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      cssClass: 'custom-loading',
      duration: 3000
    });
    return await this.loading.present();
  }

  ionViewWillEnter() {
    this.presentLoading().then(() => {
      this.getInitData();
      this.loadingController.dismiss();
    });
  }

  ionViewWillLeave() {
    clearInterval(this.globalInterval);
  }

  async handleAddPhoto() {
    const modal = await this.modalController.create({
      component: AddImageComponent,
      cssClass: 'addimage-modal-class'
    });
    return await modal.present();
  }

  getInitData() {
    this.getGroupData();
    this.globalInterval = setInterval(() => { 
      this.getGroupData();
   }, 30000);
  }

  async getGroupData() {
    await this.getUserInfo();
    await this.getRecentContactList();
    await this.getNewLikeCount();
    await this.getNewCommentCount();
    await this.getContactList();
  }

  getUserInfo() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
  
    this.httpClient.post(`${this.env.API_URL}/users/get`, {user_id: this.user_id}, {headers})
    .subscribe((res) => {
      if(res) {
        this.user_avatar = res['avatar'];
        this.phone_number = res['phone_number'];
      }
    }, (err) => {
      console.log(err);
    })
  }

  getContactList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
  
    let contact = {searchValue: '', contactStatus: 0, phone_number: this.phone_number}; 
      this.httpClient.post(`${this.env.API_URL}/contacts/get`, { contact }, { headers })
      .subscribe((res) => {
        if(res) {
          this.contact_list = res;
          this.contact_list_value = res;
        }
      }, async (err) => {
        console.log(err);
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
    });
  }

  getContactListSearch(evt) {
    this.contact_list = this.contact_list_value.filter((contact) => {
      return ((contact.phone_number).includes(evt.srcElement.value.trim()) || 
              (contact.first_name + contact.last_name).includes(evt.srcElement.value.trim()) ||
              (contact.first_name + ' ' + contact.last_name).includes(evt.srcElement.value.trim())
              );
    });
  }

  getRecentContactList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
  
    this.httpClient.post(`${this.env.API_URL}/photos/getRecent`, { headers })
    .subscribe((res) => {
      if(res) {
        this.recent_contact_list = res;
      }
    }, (err) => {
      console.log(err);
    });
  }

  getNewLikeCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
  
    this.httpClient.post(`${this.env.API_URL}/likes/getLikesCount`, { user_id: this.user_id }, { headers })
    .subscribe((res) => {
      this.like_count = res['count'];
    }), (err) => {
      console.log(err);
    }
  }

  getNewCommentCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
  
    this.httpClient.post(`${this.env.API_URL}/comments/getCount`, { user_id: this.user_id }, { headers })
    .subscribe((res) => {
      this.comment_count = res['count'];
    }), (err) => {
      console.log(err);
    }
  }

}
