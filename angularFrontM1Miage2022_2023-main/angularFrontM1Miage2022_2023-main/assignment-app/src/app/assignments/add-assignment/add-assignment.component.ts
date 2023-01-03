import {Component, OnInit, /*EventEmitter, Output*/} from '@angular/core';
import {Assignment} from '../assignment.model';
import {AssignmentsService} from '../../shared/assignments.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  //@Output() nouvelAssignment = new EventEmitter<Assignment>();

  nomDevoir: string = "";
  dateDeRendu: Date = new Date();
  matiere: string = "";
  auteur : string = "";

  droits = localStorage.getItem('ROLE');

  constructor(private assignmentsService: AssignmentsService,private route: ActivatedRoute,
  private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const newAssignment = new Assignment();
    newAssignment.id = Math.floor(Math.random() * 1000);
    newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;
    newAssignment.matiere = this.matiere;
    newAssignment.auteur = this.auteur;
    newAssignment.note = null;
    newAssignment.remarques = null;

    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(message => console.log(message));

    this.router.navigate(["/home"]);
  }

}
