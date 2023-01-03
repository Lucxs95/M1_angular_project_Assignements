import { Component, OnInit } from '@angular/core';
import {Assignment} from "../../assignments/assignment.model";
import {AssignmentsService} from "../../shared/assignments.service";

@Component({
  selector: 'app-corrections-prof',
  templateUrl: './corrections-prof.component.html',
  styleUrls: ['./corrections-prof.component.css']
})
export class CorrectionsProfComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;
  assignments!: Assignment[];

  constructor(private assignmentsService: AssignmentsService) {
  }

  droits = localStorage.getItem('ROLE');

  ngOnInit() {
    let matiereProf = '';
    switch (localStorage.getItem('ROLE')) {
      case 'buffa':
        matiereProf = 'JavaScript';
        break;
      case 'tounsi':
        matiereProf = 'Marketing';
        break;
      case 'syska':
        matiereProf = 'Reseaux';
        break;
      case 'menez':
        matiereProf = 'Systeme';
        break;
      default:
        matiereProf = '';
    }
    this.assignmentsService.getAssignmentsPagineWhereProf(this.page, this.limit)
      .subscribe(data => {
        let assignments = data.docs.filter(
          assignment => assignment.matiere === matiereProf && assignment.rendu === true && assignment.note === null);
        this.assignments = assignments;
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = assignments.length;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });

  }



  columnsToDisplay = [];

  displayColumn() {
    if (localStorage.getItem('ACCESS_TOKEN')) {
      if (localStorage.getItem('DROITS') === 'modif/lecture/suppr') {
        this.columnsToDisplay = ['nom', 'rendu', 'dateDeRendu', 'auteur', 'matiere', 'note', 'remarques', 'actions', 'actions2', 'actions3'];
        return this.columnsToDisplay;
      } else {
        this.columnsToDisplay = ['nom', 'rendu', 'dateDeRendu', 'auteur', 'matiere', 'note', 'remarques', 'actions2', 'actions3'];
        return this.columnsToDisplay;
      }
    } else {
      this.columnsToDisplay = ['nom', 'rendu', 'dateDeRendu', 'auteur', 'matiere', 'note', 'remarques', 'actions3'];
      return this.columnsToDisplay;

    }
  }

  onDeleteRendu(id) {
    this.assignmentsService.getAssignment(id).subscribe(
      (assignement) => {
        this.assignmentsService.deleteAssignment(assignement).subscribe(
          (data) => {
            console.log(data);
            window.location.reload();
          }
        )
      }
    )

  }

  updating(page: number, limit: number) {
    let matiereProf = '';
    switch (localStorage.getItem('ROLE')) {
      case 'buffa':
        matiereProf = 'JavaScript';
        break;
      case 'tounsi':
        matiereProf = 'Marketing';
        break;
      case 'syska':
        matiereProf = 'Reseaux';
        break;
      case 'menez':
        matiereProf = 'Systeme';
        break;
      default:
        matiereProf = '';
    }
    this.assignmentsService.getAssignmentsPagineWhereProf(this.page, this.limit)
      .subscribe(data => {
        let assignments = data.docs.filter(
          assignment => assignment.matiere === matiereProf && assignment.rendu === true);
        this.assignments = assignments;
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });
  }

  paginatorUpdate(event: any) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.updating(this.page, this.limit);
  }

}
