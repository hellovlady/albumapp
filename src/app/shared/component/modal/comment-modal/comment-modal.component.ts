import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, NavParams, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../../services/env.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Storage } from  '@ionic/storage';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {

  comment_content: string;
  user_id: number;
  client_id: number;
  photo_id: number;
  album_id: number;
  parent_id: number;
  token: string;
  comment_list: any[];

  constructor(
    public popoverController: PopoverController,
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private storage: Storage,
    public modalController: ModalController,
    public navParams:NavParams,
    private alert: AlertController,
  ) { 
    this.storage.get('TOKEN_INFO').then((info) => {
      this.token = info['token'];
    });
    // this.user_id = this.authService.getUser()['id'];
    this.photo_id = this.navParams.get('photo_id');
    this.album_id = this.navParams.get('album_id');
    this.client_id = this.navParams.get('client_id');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getCommentList();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async giveComment() {
    if(!this.comment_content) {
      const warnAlert = await this.alert.create({
        cssClass: 'warn-comment',
        header: "Please provide comment!",
        buttons: [
          {
            text: 'Close',
            handler: (value) => {
            }
          }
        ]
      });
      await warnAlert.present();
      return;
    }
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
    this.parent_id = 0;
    this.httpClient.post(`${this.env.API_URL}/comments/create`, {client_id: this.client_id, album_id: this.album_id, photo_id: this.photo_id, parent_id: this.parent_id, comment: this.comment_content}, { headers })
    .subscribe((res) => {
      if(res) {
        console.log(res);
        this.comment_content = '';
        this.getRecentCommentList();
      }
    }, (err) => {
      console.log(err);
    });
  }

  getRecentCommentList() {
    this.httpClient.post(`${this.env.API_URL}/comments/getRecent`, {album_id: this.album_id, photo_id: this.photo_id})
    .subscribe((res : any[]) => {
      if(res) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        res.map((rs, i) => {
          let date = new Date(rs['created_date']);
          res[i]['date'] = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
          res[i]['time'] = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + ':' + ((date.getMinutes() <10 ) ? ('0' + date.getMinutes()) : date.getMinutes());
          res[i]['children'] = null;
        });
        this.comment_list = this.list_to_tree(res);
      }
    }, (err) => {
      console.log(err);
    })    
  }

  getCommentList() {
    this.httpClient.post(`${this.env.API_URL}/comments/get`, {album_id: this.album_id, photo_id: this.photo_id})
    .subscribe((res : any[]) => {
      if(res) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        res.map((rs, i) => {
          let date = new Date(rs['created_date']);
          res[i]['date'] = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
          res[i]['time'] = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + ':' + ((date.getMinutes() <10 ) ? ('0' + date.getMinutes()) : date.getMinutes());
          res[i]['children'] = null;
        });
        this.comment_list = this.list_to_tree(res);
      }
    }, (err) => {
      console.log(err);
    })    
  }

  list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i]['children'] = []; // initialize the children
    }
    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent_id !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parent_id]].children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
  

}
