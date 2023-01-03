import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AssignmentsService} from 'src/app/shared/assignments.service';
import {Assignment} from '../assignment.model';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  matiere!: string;
  auteur!: string;
  note ?: number;
  remarques ?: string;
  rendu !: boolean;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAssignment();
    // affichage des query params dans la console
    console.log("Query Params :");
    console.log(this.route.snapshot.queryParams);
    // affichage des fragments dans la console
    console.log("Fragment :");
    console.log(this.route.snapshot.fragment);
  }


  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;
      this.assignment = assignment;
      // Pour pré-remplir le formulaire
      this.nomAssignment = assignment.nom;
      this.dateDeRendu = assignment.dateDeRendu;
      this.auteur = assignment.auteur;
      this.matiere = assignment.matiere;
      this.rendu = assignment.rendu;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.auteur = this.auteur;
    this.assignment.matiere = this.matiere;
    this.assignment.note = this.note;
    this.assignment.remarques = this.remarques;

    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }

  droits = localStorage.getItem('ROLE');
  utilisateur = this.getUtilisateur();

  getNbCopies() {
    return 10;
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

}
