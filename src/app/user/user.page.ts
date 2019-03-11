import { Component, OnInit, NgZone } from '@angular/core';
import { SharingService } from '../services/sharing.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: any;
  rankingUrl: string;
  record: any;
  photo: any;
  private photoURL: any;

  constructor(
    private sharingService: SharingService,
    private zone: NgZone,
    private db: AngularFireDatabase,
  ) {
    this.photoURL = null;
    this.sharingService.currentUser.subscribe(user => {
      this.zone.run(() => {
        this.user = _.clone(user);
        this.rankingUrl = `assets/icon/rank-${user.category.value}.jpg`;
        this.record = user.history ? _.countBy(user.history, 'winners') : null;
        console.log(user);
      });
    });
  }

  ngOnInit() {}

  loadPhoto(event) {
    this.readThis(event.target);
  }

  private readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.photo = myReader.result;
      this.photoURL = this.photo;
      // this.photoURL = 'data:image/jpeg;base64,' + this.photo;
    }
    myReader.readAsDataURL(file);
  }

  uploadPhoto() {
    let storageRef = firebase.storage().ref();
    const filename = this.user.alias;
    const imageRef = storageRef.child(`users/${filename}.jpg`);

    imageRef.putString(this.photoURL, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      this.updateUser(snapshot.downloadURL);
    });
  }

  private updateUser(url) {
    try {
      this.db.object('users/' + this.user.key).update({ imgURL: url });
      this.photoURL = null;
    } catch(err) {
      console.log(err);
    }
  }
}
