import { Component, OnInit } from '@angular/core';
import { Storage } from  '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AuthService } from '../services/auth/auth.service';
import { NavController, AlertController, LoadingController, Config } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.page.html',
  styleUrls: ['./my-contacts.page.scss'],
})

export class MyContactsPage implements OnInit {

  user_id: number;
  contact_list: any[];
  contact_list_value: any;
  contact_count: number;
  searchValue: string;
  all_contact: any[];
  token: string;
  phone_number: string;
  public loading: any;

  constructor(
    private storage: Storage,
    private httpClient: HttpClient, 
    private authService: AuthService,
    private env: EnvService,
    private loadingController: LoadingController,
    private config: Config,
    private router: Router,
  ) {
    this.user_id = this.authService.getUser()['id'];
    this.phone_number = this.authService.getUser()['phone_number'];
    this.storage.get('TOKEN_INFO').then(async res => {
      if(res) {
        this.token = await res['token'];
      }
    });
   }

  ngOnInit() {
    this.config.set('animated', true);
  }

  ionViewWillEnter() {
    this.getContactList();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  handleAddContact() {
    this.router.navigateByUrl('/add-my-contact');
  }

  getContactList() {
    const contact = { searchValue: '', contactStatus: 1, phone_number: this.phone_number }; 
    this.presentLoading().then(() => {
      this.httpClient.post(`${this.env.API_URL}/contacts/get`, { contact })
      .subscribe((res : [{}]) => {
        this.loadingController.dismiss();
        if(res) {
          this.contact_list = res;
          this.contact_list_value = res;
          this.contact_count = res.length;
        }
      }, (err) => {
        this.loadingController.dismiss();
        console.log(err);
      });
    });
  }

  getContactListSearch(evt) {
    this.contact_list = this.contact_list_value.filter((contact) => {
      return (
        (contact.client_phone_number?contact.client_phone_number:'')
        .includes(evt.srcElement.value.trim()) || 
        ((contact.first_name?contact.first_name:'') + (contact.last_name?contact.last_name:''))
        .includes(evt.srcElement.value.trim()) ||
        ((contact.first_name?contact.first_name:'') + ' ' + (contact.last_name?contact.last_name:''))
        .includes(evt.srcElement.value.trim()) ||
        (contact.clientname?contact.clientname:'')
        .includes(evt.srcElement.value.trim())
            );
    });
    this.contact_count = this.contact_list.length;
  }

  createContact(contact_list) {
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
    this.httpClient.post(`${this.env.API_URL}/contacts/create`, { contact_list }, { headers })
    .subscribe((res) => {
      if(res['message'] == 'success') {
        this.getContactList();
      }
    }, (err) => {
      console.log(err);
    })
  }

}
