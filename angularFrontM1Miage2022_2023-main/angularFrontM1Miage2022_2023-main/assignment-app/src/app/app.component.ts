import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {AssignmentsService} from './shared/assignments.service';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Application de gestion des devoirs à rendre (Assignments)';
  opened = true;
  username: string;
  password: string;
  showDiv: boolean;
  totalDocs: number;
  page: number = 1;
  limit: number = 10;
  nbCopies: number;
  matiereProf: string;
  connexionClicked:boolean = false;


  constructor(private authService: AuthService, private router: Router,
              private assignmentsService: AssignmentsService, private http: HttpClient, private snackBar: MatSnackBar) {
    // get local storage token
    const token = localStorage.getItem('ACCESS_TOKEN');


    // if token is not null, user is logged in
    if (token) {
      this.showDiv = true;
    }

  }

  ngOnInit(): void {
    this.setMatiereProf();
    this.setAssignments();
  }

  private validCredentials = [
    {username: 'user', password: 'password'},
    {username: 'admin', password: 'password'},
    {username: 'syska', password: 'password'},
    {username: 'menez', password: 'password'},
    {username: 'buffa', password: 'password'},
    {username: 'tounsi', password: 'password'}
  ];

  droits = localStorage.getItem('ROLE');
  utilisateur = this.getUtilisateur();


  setAssignments() {

    this.assignmentsService.getAssignmentsPagineWhereProf(this.page, this.limit)
      .subscribe(data => {
        let assignments = data.docs.filter(
          assignment => assignment.matiere === this.matiereProf && assignment.rendu === true && assignment.note === null);
        console.log(assignments);
        this.nbCopies = assignments.length;
      });
  }

  setMatiereProf() {
    switch (localStorage.getItem('ROLE')) {
      case 'buffa':
        this.matiereProf = 'JavaScript';
        break;
      case 'tounsi':
        this.matiereProf = 'Marketing';
        break;
      case 'syska':
        this.matiereProf = 'Reseaux';
        break;
      case 'menez':
        this.matiereProf = 'Systeme';
        break;
      default:
        this.matiereProf = '';
    }
  }

  getUtilisateur() {
    if (this.droits === "admin") {
      return "admin";
    } else if (this.droits === "user") {
      return "user";
    } else if (this.droits === "syska") {
      return "syska";
    } else if (this.droits === "menez") {
      return "menez";
    } else if (this.droits === "buffa") {
      return "buffa";
    } else if (this.droits === "tounsi") {
      return "tounsi";
    }
    return "non connecté";
  }

  login(username: string, password: string): Observable<boolean> {
    // vérifiez si les informations de connexion de l'utilisateur sont valides
    // en comparant avec la liste de login/passwords valides
    const isValid = this.validCredentials.some(credential => {
      return credential.username === username && credential.password === password;
    });

    // si les informations de connexion sont valides, connectez l'utilisateur
    // et retournez un observable qui émet la valeur true
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

  logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('DROITS')
    localStorage.removeItem('ROLE')
    this.showDiv = false;
    window.location.reload();
    this.snackBar.open('Vous êtes maintenant déconnecté !', 'OK', {
      duration: 2000,
    });
  }


  initialiserlabase() {
    this.assignmentsService.peuplerBD();
    window.location.reload();
  }

  connexion() {
    this.connexionClicked = !this.connexionClicked;
  }

}
