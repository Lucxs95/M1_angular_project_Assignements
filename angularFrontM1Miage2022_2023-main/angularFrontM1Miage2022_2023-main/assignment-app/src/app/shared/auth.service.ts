import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  logIn() {
    this.loggedIn = true;
  }
  logOut() {
    this.loggedIn = false;
  }

  // renvoie une promesse qui, lorsqu'elle est "resolved", renvoie si l'utilisateur
  // est admin ou non. Pour le moment, renvoie true si l'utilisateur est connecté
  isAdmin(): Promise<boolean> {
    const isUserAdmin = new Promise<boolean>(
      (resolve, reject) => {
        resolve(this.loggedIn)
      }
    );
    return isUserAdmin;
  }
  constructor() { }
}
