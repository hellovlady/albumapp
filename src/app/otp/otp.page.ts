import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/user';
import { EnvService } from '../services/env.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

  otp0:string='';
  otp1:string='';
  otp2:string='';
  otp3:string='';
  errMsg = {};
  user:User;
  phoneNumber: string;

  constructor(
    private route: ActivatedRoute, 
    private navCtrl: NavController,
    private authService: AuthService,
    private httpClient: HttpClient, 
    private env: EnvService,
    private alert: AlertController,
    private router: Router
  ) {
    this.phoneNumber = this.convertPhone(this.route.snapshot.paramMap.get('phone_number'));
   }

  ngOnInit() {
  }

  roleSelection() {
    const otpCode = '' + this.otp0 + this.otp1 + this.otp2 + this.otp3;
    const phoneNumber = this.convertPhone(this.phoneNumber);
    this.httpClient.post(`${this.env.API_URL}/users/otpverify`, {otpCode, phoneNumber}).subscribe((res) => {
      if(res['message'] == 'success') {
        if(this.authService.getUser()) {
          this.router.navigateByUrl('/contact-list');            
        } else {
          this.router.navigateByUrl('/login');  
        }
      } else {
        this.warnContact();
      }
    }, err => {
      console.error(err);
    })
  }

  reSend() {
    const phoneNumber = this.convertPhone(this.phoneNumber);
    console.log(phoneNumber);
    this.httpClient.post(`${this.env.API_URL}/users/resendOtp`, {phoneNumber}).subscribe((res) => {
      this.successResend();
    }, (err) => {
      console.error(err);
    })
  }

  async warnContact() {
    const warnAlert = await this.alert.create({
      cssClass: 'warn-contact',
      header: "OTP verification failed, please try again or resend your phone number",
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

  async successResend() {
    const warnAlert = await this.alert.create({
      cssClass: 'success-resend',
      header: "Resending is success. please check your sms.",
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

  async chnagePhone() {
    const phoneNumber = await this.alert.create({
      cssClass: 'chagen-phoneNumber',
      header: "Change Phone Number",
      inputs: [
        {
          name: 'phoneNumber',
          type: 'textarea',
          value: this.convertPhone(this.phoneNumber),
          placeholder: 'Please change your phone number'
        }
      ],
      buttons: [
        {
          text: 'Close',
          handler: (value) => {
          },
          
        },
        {
          text: 'Ok',
          handler: (value) => {
            this.httpClient.post(`${this.env.API_URL}/users/updatePhoneNumber`, {newNumber: value.phoneNumber, oldNumber: this.convertPhone(this.phoneNumber)})
            .subscribe((res) => {
              if(res) {                
                this.phoneNumber = this.convertPhone(value.phoneNumber);
              }
            })
          }
        }
      ]
    });
    await phoneNumber.present();
  }

  convertPhone(phone) {
    if(phone) {
      const num =  phone.replace(/[^\d]/g, '');
      return num;
    }
  }
  
  moveFocus(field) {
    field.setFocus();
  }

}
