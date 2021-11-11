import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Storage } from  '@ionic/storage';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-my-contact',
  templateUrl: './add-my-contact.component.html',
  styleUrls: ['./add-my-contact.component.scss'],
})
export class AddMyContactComponent implements OnInit {

  username: string;
  phone_number: string;
  contactList: any[];
  phoneBookList: any[];
  user_id: number;
  token: string;
  displayList: any[];
  allDisplayList: any[] = [];
  public loading : any;

  constructor(
    private modalController: ModalController,
    private httpClient: HttpClient,
    private env: EnvService,
    private storage: Storage,
    private authService: AuthService,
    public contacts: Contacts,
    private alert: AlertController,
    private loadingController: LoadingController,
    private router: Router,
  ) {
    this.phone_number = this.authService.getUser()['phone_number'];
    this.user_id = this.authService.getUser()['id'];
    this.storage.get('TOKEN_INFO').then((info) => {
      if(info) {
        this.token = info['token'];
      }
    });
   }

  ngOnInit() {
    this.getContacts();
  }

  dismiss() {
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

  async insertContacts() {
    const insertList = this.allDisplayList.filter((contact) => contact.isChecked === true);
    if(insertList.length > 0) {
      const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);

      await this.presentLoading().then(() => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        // eslint-disable-next-line max-len
        this.httpClient.post(`${this.env.API_URL}/contacts/create`, { contact_list: insertList, phone_number: this.phone_number }, { headers })
        .subscribe( async (res) => {
          if(res['message'] === 'success') {
            this.loadingController.dismiss();
            this.router.navigateByUrl('my-contacts');
            await this.dismiss();
          }
        }, (err) => {
          console.log(err);
        });
      });

    } else {
      const album_alert = await this.alert.create({
        cssClass: 'contact-insert-alert',
        header: 'Please select contact!',
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
      await album_alert.present();
    }
  }

  async getContacts() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const contact = { searchValue: '', contactStatus: 1, phone_number: this.phone_number };
    this.presentLoading().then(() => {

    this.httpClient.post(`${this.env.API_URL}/contacts/get`, { contact })
      // eslint-disable-next-line @typescript-eslint/ban-types
      .subscribe(async (res: any[]) => {
        this.loadingController.dismiss();
          this.contactList = await res;
          await this.contacts.find(["displayName", "phoneNumbers"]).then(async (data) => {
            this.phoneBookList = await data;
            // eslint-disable-next-line max-len
            this.displayList = await this.phoneBookList.filter((pb) => !this.contactList.some((cl) => this.convertPhone(pb.phoneNumbers[0].value) == cl.client_phone_number));
            await this.displayList.map((dl, i) => {
              let userName = '';
              if(dl.displayName) {
                userName = dl.displayName;
              } else {
                userName = dl.name.givenName + ' ' + dl.name.familyName;
              }
              const item = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                user_name: userName,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                phone_number: this.convertPhone(dl.phoneNumbers[0].value),
                isChecked: false
              };
              this.allDisplayList.push(item);
            });
          }, (err) => {
            console.error(err);
          });
      }, (err) => {
        this.loadingController.dismiss();
        console.error(err);
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

