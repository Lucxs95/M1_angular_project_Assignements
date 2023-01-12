import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-mat-basic',
  templateUrl: './mat-basic.component.html',
  styleUrls: ['./mat-basic.component.css']
})
export class MatBasicComponent implements OnInit {
  username: string;
  password: string;

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  private validCredentials = [
    {username: 'user', password: 'password'},
    {username: 'admin', password: 'password'},
    {username: 'syska', password: 'password'},
    {username: 'menez', password: 'password'},
    {username: 'buffa', password: 'password'},
    {username: 'tounsi', password: 'password'}
  ];

  login(username: string, password: string): Observable<boolean> {
    const isValid = this.validCredentials.some(credential => {
      return credential.username === username && credential.password === password;
    });
    if (isValid) {
      localStorage.setItem('ACCESS_TOKEN', "access_token");
      if (username === "admin") {
        localStorage.setItem('DROITS', "modif/lecture/suppr");
        localStorage.setItem('ROLE', "admin");
      } else if (username === "user") {
        localStorage.setItem('DROITS', "modif/lecture");
        localStorage.setItem('ROLE', "user");
      } else if (username === "syska") {
        localStorage.setItem('DROITS', "modif/lecture");
        localStorage.setItem('ROLE', "syska");
      } else if (username === "menez") {
        localStorage.setItem('DROITS', "modif/lecture");
        localStorage.setItem('ROLE', "menez");
      } else if (username === "buffa") {
        localStorage.setItem('DROITS', "modif/lecture");
        localStorage.setItem('ROLE', "buffa");
      } else if (username === "tounsi") {
        localStorage.setItem('DROITS', "modif/lecture");
        localStorage.setItem('ROLE', "tounsi");
      }


      window.location.reload();
      this.snackBar.open('Vous êtes maintenant connecté !', 'OK', {
        duration: 2000,
      });


      return of(true);
    }
    // sinon, retournez un observable qui émet la valeur false
    return of(false);
  }
}
