import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, LoadingController, AlertController, Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';

declare let cordova: any;

@Component({
  selector: 'app-image-popover',
  templateUrl: './image-popover.component.html',
  styleUrls: ['./image-popover.component.scss'],
})
export class ImagePopoverComponent implements OnInit {

  photo_url: string;
  caption: string;
  public loading: any;
  private downloadedFile;
  rootDir: string = '';

  constructor(
    public navParams: NavParams,
    private http: HTTP,
    private file: File,
    private loadingController: LoadingController,
    private alert: AlertController,
    private platform: Platform,
  ) {
    this.photo_url = this.navParams.get('photo_url');
    this.caption = this.navParams.get('caption');

  

    if(this.platform.is('android')) {
      this.rootDir = this.file.externalRootDirectory
    } else if (this.platform.is('ios')) {
      this.rootDir = this.file.documentsDirectory;
    }
   }

  ngOnInit() {
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      duration: 2000
    });
    return await this.loading.present();
  }

  saveImage() {
    this.presentLoading().then(() => {
      const url = this.photo_url;
      this.http.sendRequest(url, { method: 'get', responseType: 'arraybuffer' }).then(
        httpResponse => {
          console.log('File dowloaded successfully');
          this.downloadedFile = new Blob([httpResponse.data], { type: 'image/jpeg' });
          this.writeFile();
          this.successMsg();
        }
      ).catch(err => {
        console.error(err);
      });
      this.loadingController.dismiss();
    });
  }

  async successMsg() {
    const statusAlert = await this.alert.create({
      cssClass: 'status-alert',
      header: 'Image saved successfully',
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

  async writeFile() {
    if (this.downloadedFile == null) {return;}
    alert(this.rootDir);
    const filename = this.caption + '.jpg';
    await this.createFile(filename);
    await this.writeToFile(filename);
  }

  async createFile(filename) {
    return this.file.createFile(this.rootDir + '/Download/', filename, false).then((res) => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    });
  }

  writeToFile(filename) {
    // eslint-disable-next-line max-len
    return this.file.writeFile(this.rootDir + '/Download/', filename, this.downloadedFile, { replace: true, append: false }).then(createdFile => {
      console.log('File written successfully.');
    }).catch(err => {
      console.error(err);
    });
  }

}
