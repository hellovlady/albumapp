import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { EnvService } from '../services/env.service';

@Component({
  selector: 'app-all-album',
  templateUrl: './all-album.page.html',
  styleUrls: ['./all-album.page.scss'],
})
export class AllAlbumPage implements OnInit {
  photos: Array<string>;

  constructor(
    private route: NavController,
    private env: EnvService
  ) { }

  ngOnInit() {
  }


}
