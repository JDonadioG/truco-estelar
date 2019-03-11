import { Component, OnInit, NgZone } from '@angular/core';
import { SharingService } from '../services/sharing.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import * as _ from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public user: any;
  public rankingUrl: string;
  public record: any;
  public photoURL: any;
  public imageLoaded: boolean;
  private loading: any;

  constructor(
    private sharingService: SharingService,
    private zone: NgZone,
    private db: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.photoURL = null;
    this.imageLoaded = false;
    this.sharingService.currentUser.subscribe(user => {
      console.log(user);
      if (user.history) user.history = _.orderBy(user.history, ['updatedAt'], ['desc']);

      this.rankingUrl = `assets/icon/rank-${user.category.value}.jpg`;
      this.record = user.history ? _.countBy(user.history, 'winners') : null;

      this.zone.run(() => {
        this.user = _.clone(user);
      });
    });
  }

  ngOnInit() {}

  loadPhoto(event) {
    this.user.imgURL = null;
    this.readThis(event.target);
  }

  private readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.photoURL = myReader.result;
      this.imageLoaded = true;
    }
    myReader.readAsDataURL(file);
  }

  async uploadPhoto() {
    let storageRef = firebase.storage().ref();
    const filename = Math.random().toString(36).substring(7);
    const imageRef = storageRef.child(`users/${this.user.alias}/${filename}.jpg`);

    this.loading = await this.loadingCtrl.create({ message: 'Actualizando imagen...' });
    this.loading.present();

    try {
      imageRef.putString(this.photoURL, 'data_url')
        .then((snapshot) => { 
          snapshot.ref.getDownloadURL()
          .then(url => { this.updateUser(url) });
      });
    } catch (error) {
      this.propagateError(error);
    }
  }

  private updateUser(url) {
    try {
      this.db.object('users/' + this.user.key).update({ imgURL: url });
      this.loading.dismiss();
      this.imageLoaded = false;
    } catch(err) {
      this.propagateError(err);
    }
  }

  async propagateError(error) {
    console.log(error);
    this.loading.dismiss();
    const toast = await this.toastCtrl.create({
      message: error,
      duration: 4000
    });
    toast.present();
  }
}
