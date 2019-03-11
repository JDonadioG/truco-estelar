import { Component, OnInit, NgZone } from '@angular/core';
import { SharingService } from '../services/sharing.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public users: any;
  public searchText: string;

  constructor(
    private sharingService: SharingService,
    private myRouter: Router,
    private zone: NgZone,
  ) {
    this.searchText = null;
    this.users = [];
  }
  
  ngOnInit() {
    this.sharingService.currentUsers.subscribe(users => {
      this.zone.run(() => {
        this.users = _.orderBy(_.clone(users), ['score'], ['desc']);
      });
    });
  }

  userDetails(user) {
    this.sharingService.setUser(user);
    this.myRouter.navigate(['user']);
  }

  createGame() {
    this.myRouter.navigate(['game']);
  }
}
