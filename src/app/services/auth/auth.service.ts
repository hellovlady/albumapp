import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, take, map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from , of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform, AlertController, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from './user';
import { AuthResponse } from './auth-response';
import { EnvService } from '../env.service';
import { Router } from '@angular/router';
// import { HTTP } from '@ionic-native/http/ngx';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  expiredIn: number;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentDate: Date;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  expDate: Date;

  public loading: any;

  constructor(
    private storage: Storage,
    private env: EnvService,
    private plt: Platform,
    private navCtrl: NavController,
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.storage.create();
    this.loadStoredToken();
   }

   loadStoredToken() {
    const platformObs = from(this.plt.ready());
    platformObs.pipe(
      switchMap(() => from(this.storage.get('TOKEN_INFO'))),
      map(info => {
        if(info) {
          if(info['token']) {
            const decoded = helper.decodeToken(info['token']);
            this.userData.next(decoded);
            this.expiredIn = decoded.exp;
            this.currentDate = new Date();
            this.expDate = new Date(this.expiredIn * 1000);
            if (this.expDate < this.currentDate)
            {
              this.logout();
            }
            return of(true);
          } else {
            return of(false);
          }
        }
        return of(false);
      })
    ).subscribe((res) => {
      this.user = res;
    });
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.env.API_URL}/users/register`, {user}).pipe(
      tap(async (res: any) => {
        if (res) {
            console.log(res);
            console.log(res['tc']);
        }
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  login(phone_number: string): Observable<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.httpClient.post(`${this.env.API_URL}/users/login`, {phone_number}).pipe(
      tap((res: AuthResponse) => {
        if(res) {
          this.storage.set('TOKEN_INFO', res);
          const decoded = helper.decodeToken(res['token']);
          this.userData.next(decoded);
          this.loadStoredToken();
        }
      }, (err) => {
        console.log(err);
      })
    )
  }

  getUser() {
    return this.userData.getValue();
  }

  async logout() {
    await this.storage.remove('TOKEN_INFO');
    this.userData.next(null);
    this.navCtrl.navigateRoot('/login');
  }

  isLoggedIn() {
    return this.userData.asObservable();
  }

}

