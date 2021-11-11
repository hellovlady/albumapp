import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-like-card',
  templateUrl: './like-card.component.html',
  styleUrls: ['./like-card.component.scss'],
})
export class LikeCardComponent implements OnInit {

  @Input() avatar: string;
  @Input() photo: string;
  @Input() name: string;
  @Input() time: string;
  @Input() photo_id: number;
  constructor(
    private route: Router
  ) { }

  ngOnInit() {}

  gotoUserAlbum() {
    const id = this.photo_id;
    this.route.navigate([`./image-view/${id}`]);
  }
}
