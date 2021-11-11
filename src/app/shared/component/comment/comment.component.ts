import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../services/env.service';
import { Storage } from  '@ionic/storage';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() avatar: string;
  @Input() date: string;
  @Input() time: string;
  @Input() name: string;
  @Input() comment: string;
  @Input() reply: number;
  @Input() subComment: any[];
  @Input() depth = 0;
  @Input() client_id : number;
  @Input() album_id : number;
  @Input() photo_id : number;
  @Input() parent_id : number;

  replyStatus: boolean;
  showReply: boolean;
  commentContent: string;
  token: string;
  comment_list: any[];

  constructor(
    private alert: AlertController,
    private storage: Storage,
    private httpClient: HttpClient,
    private env: EnvService,
  ) { 
    this.storage.get('TOKEN_INFO').then((info) => {
      this.token = info['token'];
    });
  }

  ngOnInit() {
    this.replyStatus = false;
    this.showReply = true;
  }

  replyInput() {
    this.replyStatus = !this.replyStatus;
  }

  async giveComment(client_id, album_id, photo_id, parent_id, commentContent) {
    if(!this.commentContent) {
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
    this.httpClient.post(`${this.env.API_URL}/comments/create`, {client_id: client_id, album_id: album_id, photo_id: photo_id, parent_id: parent_id, comment: commentContent}, { headers })
    .subscribe((res) => {
      if(res) {
        this.commentContent = '';
        this.getRecentCommentList(parent_id);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getRecentCommentList(parent_id) {
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
        this.subComment = this.list_to_tree(res).filter((rs) => rs.id === parent_id)[0]['children'];
      }
    }, (err) => {
      console.log(err);
    })    
  }

  list_to_tree(list) {
    var map = {}, node, roots = [], i;
    
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
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

  hideReply() {
    this.showReply = !this.showReply;
  }
}
