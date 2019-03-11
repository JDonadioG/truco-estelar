import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private users = new BehaviorSubject<any>(null);
  currentUsers = this.users.asObservable();

  private user = new BehaviorSubject<any>(null);
  currentUser = this.user.asObservable();

  private game = new BehaviorSubject<any>(null);
  currentGame = this.game.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) {
    var a = this.db.database.ref('users');
    a.orderByChild('surname').on('value', snap => {
      var users = [];
      snap.forEach(data => { users.push({ key: data.key, ...data.val() }) });
      this.setUsers(users);
    })
  }
  
  setUsers(users: any) {
    this.users.next(users);
  }

  setUser(user: any) {
    this.user.next(user);
  }

  setGame(game: any) {
    this.game.next(game);
  }
}
