import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // API_URL = 'http://192.168.114.14:5000/api';
  // API_URL = 'https://myalbum-app.herokuapp.com/api';
  API_URL = 'https://album-app-server.herokuapp.com/api';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PUBLICK_KEY = 'a6ce3a42c1d1be653179';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PROFILE_SIZE = '100x100';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ALBUM_SIZE = '500x500';
  constructor() { }
}
