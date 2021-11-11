import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { Storage } from  '@ionic/storage';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  photo_id: number;
  album_id: number;
  comment_list: any[];
  parent_id: number;
  comment_content: string;
  token: string;
  user_id: number;

  constructor(
    public modalController: ModalController,
    public route: ActivatedRoute,
    private httpClient: HttpClient, 
    private env: EnvService,
    private storage: Storage,
    private authService: AuthService,
  ) {
    this.storage.get('TOKEN_INFO').then((info) => {
      if(info) {
        this.token = info['token'];
      }
    });
    this.user_id = this.authService.getUser()['id'];
    this.photo_id = Number(this.route.snapshot.paramMap.get('id'));
   }

  ngOnInit() {
    this.getAlbumId();
  }

  async getAlbumId() {
    await this.httpClient.post(`${this.env.API_URL}/albums/getId`, { photo_id: this.photo_id })
    .subscribe((res) => {
      if(res) {
        this.album_id = res['album_id'];
        this.getCommentList();
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
        });
        this.comment_list = this.list_to_tree(res);
      }
    }, (err) => {
      console.log(err);
    })
  }

  giveComment() {
    const headers = new HttpHeaders()
                          .set('Content-Type', 'application/json')
                          .set('Accept', 'application/json')
                          .set('Authorization', this.token);
    this.parent_id = 0;
    this.httpClient.post(`${this.env.API_URL}/comments/create`, {client_id: this.user_id, album_id: this.album_id, photo_id: this.photo_id, parent_id: this.parent_id, comment: this.comment_content}, { headers })
    .subscribe((res) => {
      if(res) {
        this.comment_content = '';
        this.getRecentCommentList();
      }
    }, (err) => {
      console.log(err);
    })
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
        });
        this.comment_list = this.list_to_tree(res);
      }
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
