import { Component } from '@angular/core';
import { AlertController, ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { SharingService } from '../services/sharing.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as _ from 'lodash';

const categories = [
  { name: 'No merezco categoría', value: 0 },
  { name: 'Aprendiz de Pedro', value: 1 },
  { name: 'Una verga todavía', value: 2 },
  { name: 'Va queriendo', value: 3 },
  { name: 'Intermedio', value: 4 },
  { name: 'Avanzado', value: 5 },
  { name: 'Profesional', value: 6 },
  { name: 'Kakaroto', value: 7 },
];

@Component({
  selector: 'app-points',
  templateUrl: './points.page.html',
  styleUrls: ['./points.page.scss'],
})
export class PointsPage {

  public isSixth: boolean;
  public us: any;
  public them: any;
  public counterUs: number;
  public counterThem: number;
  public reward: number;
  private users: any;
  private loading: any;
  private gameEndAlert: any;
  private appleAssignAlert: any;
  private repeatGameAlert: any;
  
  constructor(
    private alertCtrl: AlertController,
    private sharingService: SharingService,
    private db: AngularFireDatabase,
    private myRouter: Router,
    private asCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.init();
  }

  init() {
    this.us = {
      row1: 0,
      row2: 0,
      row3: 0,
      row4: 0,
      row5: 0,
      row6: 0,
    };
    this.them = {
      row1: 0,
      row2: 0,
      row3: 0,
      row4: 0,
      row5: 0,
      row6: 0,
    };
    this.counterUs = 0;
    this.counterThem = 0;
    this.alertDismiss();
    this.sharingService.currentGame.subscribe(game => {
      this.isSixth = game.isSixth;
      this.users = game.users;
      this.us.team = game.users.slice(0, game.isSixth ? 3 : 2);
      this.them.team = game.users.slice(game.isSixth ? 3 : 2);
      this.reward = game.reward;
      console.log('game', game);
    });
  }

  add(us?: boolean) {
    if (us) {
      this.counterUs < (this.isSixth ? 30 : 18) ? this.counterUs++ : null;
      this.processPointsForUs();
    } else {
      this.counterThem < (this.isSixth ? 30 : 18) ? this.counterThem++ : null;
      this.processPointsForThem();
    }
  }

  processPointsForUs() {
    if (this.isSixth) {
      if (this.counterUs == 0) this.us.row1 = 0;
      if (this.counterUs > 0 && this.counterUs <= 5) {
        this.us.row1 = this.counterUs;
        this.us.row2 = 0;
      }
      if (this.counterUs > 5 && this.counterUs <= 10) {
        this.us.row2 = this.counterUs - 5;
        this.us.row3 = 0;
      }
      if (this.counterUs > 10 && this.counterUs <= 15) {
        this.us.row3 = this.counterUs - 10;
        this.us.row4 = 0;
      }
      if (this.counterUs > 15 && this.counterUs <= 20) {
        this.us.row4 = this.counterUs - 15;
        this.us.row5 = 0;
      }
      if (this.counterUs > 20 && this.counterUs <= 25) {
        this.us.row5 = this.counterUs - 20;
        this.us.row6 = 0;
      }
      if (this.counterUs > 25 && this.counterUs <= 30) this.us.row6 = this.counterUs - 25;
      if (this.counterUs == 30) {
        this.showMessage();
      }
    } else {
      if (this.counterUs == 0) this.us.row1 = 0;
      if (this.counterUs > 0 && this.counterUs <= 5) {
        this.us.row1 = this.counterUs;
        this.us.row2 = 0;
      }
      if (this.counterUs > 5 && this.counterUs <= 9) {
        this.us.row2 = this.counterUs - 5;
        this.us.row4 = 0;
      }
      if (this.counterUs > 9 && this.counterUs <= 14) {
        this.us.row4 = this.counterUs - 9;
        this.us.row5 = 0;
      }
      if (this.counterUs > 14 && this.counterUs <= 18) {
        this.us.row5 = this.counterUs - 14;
        this.us.row6 = 0;
      }
      if (this.counterUs == 18) {
        this.showMessage();
      }
    }
  }
  
  processPointsForThem() {
    if (this.isSixth) {
      if (this.counterThem == 0) this.them.row1 = 0;
      if (this.counterThem > 0 && this.counterThem <= 5) {
        this.them.row1 = this.counterThem;
        this.them.row2 = 0;
      }
      if (this.counterThem > 5 && this.counterThem <= 10) {
        this.them.row2 = this.counterThem - 5;
        this.them.row3 = 0;
      }
      if (this.counterThem > 10 && this.counterThem <= 15) {
        this.them.row3 = this.counterThem - 10;
        this.them.row4 = 0;
      }
      if (this.counterThem > 15 && this.counterThem <= 20) {
        this.them.row4 = this.counterThem - 15;
        this.them.row5 = 0;
      }
      if (this.counterThem > 20 && this.counterThem <= 25) {
        this.them.row5 = this.counterThem - 20;
        this.them.row6 = 0;
      }
      if (this.counterThem > 25 && this.counterThem <= 30) this.them.row6 = this.counterThem - 25;
      if (this.counterThem == 30) {
        this.showMessage();
      }
    } else {
      if (this.counterThem == 0) this.them.row1 = 0;
      if (this.counterThem > 0 && this.counterThem <= 5) {
        this.them.row1 = this.counterThem;
        this.them.row2 = 0;
      }
      if (this.counterThem > 5 && this.counterThem <= 9) {
        this.them.row2 = this.counterThem - 5;
        this.them.row4 = 0;
      }
      if (this.counterThem > 9 && this.counterThem <= 14) {
        this.them.row4 = this.counterThem - 9;
        this.them.row5 = 0;
      }
      if (this.counterThem > 14 && this.counterThem <= 18) {
        this.them.row5 = this.counterThem - 14;
        this.them.row6 = 0;
      }
      if (this.counterThem == 18) {
        this.showMessage();
      }
    }
  }
  
  remove(us?: boolean) {
    if (us) this.removeUs();
    else this.removeThem();
  }

  removeUs() {
    if (this.counterUs == 0) return;
    this.counterUs--;
    this.processPointsForUs();
  }
  
  removeThem() {
    if (this.counterThem == 0) return;
    this.counterThem--;
    this.processPointsForThem();
  }

  alertDismiss() {
    if (this.gameEndAlert) this.gameEndAlert = null;
    if (this.appleAssignAlert) this.appleAssignAlert = null;
    if (this.repeatGameAlert) this.repeatGameAlert = null;
  }
  
  async processUserPoints(weWon: boolean) {
    let points = this.isSixth ? 10 : 5;
    let limit = this.isSixth ? 3 : 2;
    let winners;
    let losers;
    
    if (weWon) {
      winners = _.slice(this.users, 0, limit);
      losers = _.slice(this.users, limit);
    } else {
      losers = _.slice(this.users, 0, limit);
      winners = _.slice(this.users, limit);
    }
    
    /** Remove dummy users **/
    _.remove(winners, (u: any) => { return u.type == 'dummy' });
    _.remove(losers, (u: any) => { return u.type == 'dummy' });
    
    let sleepedOut;
    
    if (weWon) sleepedOut = this.counterThem <= (this.isSixth ? 15 : 9) ? true : false;
    else sleepedOut = this.counterUs <= (this.isSixth ? 15 : 9) ? true : false;

    this.loading = await this.loadingCtrl.create({ message: 'Asignando puntos...' });
    this.loading.present();

    this.updateUsers(winners, losers, { sleepedOut, points })
      .then(() => {
        setTimeout(() => {
          this.loading.dismiss();
          this.repeatGame();
          this.showToastMessage('Puntos asignados correctamente.');
        }, 1000);
      })
      .catch(err => { 
        this.loading.dismiss();
        this.showToastMessage(err);
      })
  }
 
  updateUsers(winners, losers, opts) {
    return new Promise((resolve, reject) => {
      _.each(winners, u => {
        let history = u.history || [];
        history.push({
          isSixth: this.isSixth,
          sleepedOut: opts.sleepedOut,
          score: { us: this.counterUs, them: this.counterThem },
          winners: true,
          reward: this.reward * (opts.sleepedOut ? 2 : 1),
          updatedAt: _.now()
        });
        let score = (u.score + opts.points) + (opts.sleepedOut ? (this.isSixth ? 3 : 1) : 0);
        let category = categories[this.getCategory(score)];
        let amount = u.amount ? (u.amount + this.reward * (opts.sleepedOut ? 2 : 1)) : this.reward * (opts.sleepedOut ? 2 : 1);
        let apples = u.apples ? u.apples : 0;
        try {
          this.db.object('users/' + u.key).update({ score, history, category, amount, apples });
          console.log('Done for winner user ' + u.alias);
        } catch(err) {
          console.log(err);
          return reject(err);
        }
      });
      
      _.each(losers, u => {
        let history = u.history || [];
        history.push({
          isSixth: this.isSixth,
          sleepedOut: opts.sleepedOut,
          score: { us: this.counterUs, them: this.counterThem },
          winners: false,
          reward: this.reward * (opts.sleepedOut ? (-2) : (-1)),
          updatedAt: _.now()
        });
        let amount = u.amount ? (u.amount - this.reward * (opts.sleepedOut ? 2 : 1)) : this.reward * (opts.sleepedOut ? (-2) : (-1));
        let apples = u.apples ? u.apples : 0;
        try {
          this.db.object('users/' + u.key).update({ history, amount, apples });
          console.log('Done for loser user ' + u.alias);
        } catch(err) {
          console.log(err);
          return reject(err);
        }
      });

      return resolve();
    });
  }

  getCategory(score) {
    var result;

    if (score < 100) result = 0;
    if (score >= 100 && score < 200) result = 1;
    if (score >= 200 && score < 300) result = 2;
    if (score >= 300 && score < 450) result = 3;
    if (score >= 450 && score < 600) result = 4;
    if (score >= 600 && score < 850) result = 5;
    if (score >= 850 && score < 1000) result = 6;
    if (score >= 1000) result = 7;
    
    return result;
  }

  async showToastMessage(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async showMessage() {
    if (this.gameEndAlert) return;
    
    let msg = '';
    let weWon = false;

    if (this.counterUs == (this.isSixth ? 30 : 18)) {
      msg = 'Vaaaamooo le reventamos el orto!';
      weWon = true;
    }
    if (this.counterThem == (this.isSixth ? 30 : 18)) {
      msg = 'Ganaron ellos que culiao...';
    }

    this.gameEndAlert = await this.alertCtrl.create({
      header: 'Partiro terminado',
      message: msg,
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
          handler: () => {
            this.alertDismiss();
          }
        },
        {
          text: 'Asignar puntos',
          handler: () => {
            this.processUserPoints(weWon);
          }
        }
      ],
      backdropDismiss: false,
      keyboardClose: false
    });

    await this.gameEndAlert.present();
  }

  async repeatGame() {
    this.repeatGameAlert = await this.alertCtrl.create({
      header: '¿Repetir mesa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.alertDismiss();
            this.myRouter.navigate(['/home'], { replaceUrl: true });
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.init();
          }
        }
      ],
      backdropDismiss: false,
      keyboardClose: false
    });

    await this.repeatGameAlert.present();
  }

  async settings() {
    const actionSheet = await this.asCtrl.create({
      buttons: [{
        text: 'Configurar monto',
        icon: 'logo-usd',
        handler: () => {
          this.setReward();
        }
      }, {
        text: 'Asignar manzana',
        icon: 'logo-apple',
        handler: () => {
          this.setApple();
        }
      }]
    });
    await actionSheet.present();
  }

  async setReward() {
    const alert = await this.alertCtrl.create({
      header: '¿Por cuanto se juega?',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: '25-50',
          value: 25,
        },
        {
          name: 'radio2',
          type: 'radio',
          label: '50-100',
          value: 50,
          checked: true
        },
        {
          name: 'radio3',
          type: 'radio',
          label: '100-200',
          value: 100 
        },
        {
          name: 'radio4',
          type: 'radio',
          label: '200-400',
          value: 200 
        },
        {
          name: 'radio5',
          type: 'radio',
          label: '300-600',
          value: 300 
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data) => {
            this.reward = data;
          }
        }
      ],
      backdropDismiss: false,
      keyboardClose: false
    });

    await alert.present();
  }

  async setApple() {
    let users = _.filter(this.users, u => { return !u.type });
    users = _.map(users, u => { return { name: u.alias, type: 'radio', label: u.alias, value: u.key } });

    this.appleAssignAlert = await this.alertCtrl.create({
      header: 'Manzana para...',
      inputs: users,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.alertDismiss();
          }
        },
        {
          text: 'Ok',
          handler: (data) => {
            let user = _.find(this.users, { key: data }) as any;
            user.apples ? user.apples++ : user.apples = 1;
          }
        }
      ],
      backdropDismiss: false,
      keyboardClose: false
    });

    await this.appleAssignAlert.present();
  }
}
