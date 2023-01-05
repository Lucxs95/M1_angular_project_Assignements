import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {AssignmentsService} from './shared/assignments.service';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatBasicComponent } from './ng-material/mat-basic/mat-basic.component';


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
              private assignmentsService: AssignmentsService, private http: HttpClient, private snackBar: MatSnackBar,public dialog: MatDialog) {
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

  openDialog() {
    const dialogRef = this.dialog.open(MatBasicComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



  droits = localStorage.getItem('ROLE');
  utilisateur = this.getUtilisateur();


  setAssignments() {

    this.assignmentsService.getAssignments()
      .subscribe(data => {
        let assignments = data.filter(
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
}
