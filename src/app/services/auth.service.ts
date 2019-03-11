import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private myRoute: Router
  ) {
    this.user = null;
  }
  
  isLoggedIn() {
    return this.user && this.user !== null;
  }

  async login(email: string, password: string) {
    try {
      this.user = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.myRoute.navigate(['home']);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      localStorage.removeItem('user');
      console.log(error);
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.myRoute.navigate(['login']);
  }
}
