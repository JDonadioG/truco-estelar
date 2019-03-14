import { Component, OnInit, NgZone } from '@angular/core';
import { SharingService } from '../services/sharing.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public users: any;
  public selectedUsers: any;
  public firstTeam: any;
  public secondTeam: any;
  public searchText: string;
  public isSixth: boolean;
  private enabledFor: any;

  constructor(
    private sharingService: SharingService,
    private myRouter: Router,
    private zone: NgZone,
    private alertCtrl: AlertController
  ) {
    this.searchText = null;
    this.users = [];
    this.selectedUsers = [];
    this.firstTeam = [];
    this.secondTeam = [];
    this.enabledFor = {};
    this.isSixth = true;
  }
  
  ngOnInit() {
    this.sharingService.currentUsers.subscribe(users => {
      this.zone.run(() => {
        this.users = _.orderBy(_.clone(users), ['alias'],['asc']);
      });
    });
  }

  add(user: any) {
    var limit = this.isSixth ? 6 : 4;
    if (this.selectedUsers.length == limit) return;
    if (_.find(this.selectedUsers, ['key', user.key])) return;
    
    this.enabledFor[user.key] = true;
    this.selectedUsers.push(user);
    this.selectedUsers = _.uniqBy(this.selectedUsers, 'key');
    
    if (this.firstTeam.length < (limit / 2)) {
      this.firstTeam.push(user);
      this.firstTeam = _.uniqBy(this.firstTeam, 'key');
    } else {
      this.secondTeam.push(user);
      this.secondTeam = _.uniqBy(this.secondTeam, 'key');
    }
  }
  
  shuffle() {
    var limit = this.isSixth ? 3 : 2;
    this.selectedUsers = _.shuffle(this.selectedUsers);
    this.firstTeam = _.slice(this.selectedUsers, 0, limit);
    this.secondTeam = _.slice(this.selectedUsers, limit);
  }

  remove(user) {
    try {
      delete this.enabledFor[user.key];
      _.remove(this.selectedUsers, { key: user.key });
      _.remove(this.firstTeam, { key: user.key });
      _.remove(this.secondTeam, { key: user.key });
    } catch (error) {
      console.log(error);
    }
  }

  select(sixth?: boolean) {
    this.isSixth = sixth ? true : false;
    this.firstTeam = [];
    this.secondTeam = [];
    _.each(_.clone(this.selectedUsers), su => { this.remove(su) });
  }

  next() {
    this.sharingService.setGame({ isSixth: this.isSixth, users: this.selectedUsers, reward: 50 });
    this.myRouter.navigate(['/points']);
  }

  async setUserName() {
    if (this.secondTeam[this.isSixth ? 2 : 1]) return;
    
    const alert = await this.alertCtrl.create({
      header: 'Nombrar invitado',
      inputs: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data: any) => {
            if (data && data.name != '') this.add(this.createUserDummy(data.name));
            else return false;
          }
        }
      ],
      backdropDismiss: false,
      keyboardClose: false
    });

    await alert.present();
  }

  createUserDummy(name) {
    let user = {
      key: Math.random().toString(36).substring(10),
      alias: name,
      type: 'dummy'
    }

    return user;
  }
}
