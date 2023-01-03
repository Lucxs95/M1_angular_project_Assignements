import {Component, OnInit} from '@angular/core';
import {AssignmentsService} from '../shared/assignments.service';
import {Assignment} from '../assignments/assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;
  titre = "Mon application sur les assignments ! ";
  formVisible = false;
  assignementSelectionne?: Assignment;
  assignments!: Assignment[];
  booleanRendusFiltre: boolean = false;
  searchText: string = "";

  constructor(private assignmentsService: AssignmentsService) {
  }

  droits = localStorage.getItem('ROLE');


  ngOnInit() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        this.assignments = data.docs;
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

  updating(page: number, limit: number, search?: string) {
    this.assignmentsService.getAssignmentsPagine(page, limit, search)
      .subscribe(data => {
        this.assignments = data.docs.filter(
          (assignment) => {
            if (this.booleanRendusFiltre) {
              return assignment.rendu === true;
            } else {
              return assignment;
            }
          }
        ).filter(
          (assignment) => {
            if (this.searchText) {
              return assignment.nom.toLowerCase().includes(this.searchText.toLowerCase()) || assignment.auteur.toLowerCase().includes(this.searchText.toLowerCase()) || assignment.matiere.toLowerCase().includes(this.searchText.toLowerCase());
            } else {
              return assignment;
            }
          }
        );
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

  onChangeBooleanRenduFiltre() {
    this.booleanRendusFiltre = !this.booleanRendusFiltre;
    this.updating(this.page, this.limit);
  }

  paginatorUpdate(event: any) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.updating(this.page, this.limit);
  }


  getAssignments() {
    this.assignmentsService.getAssignments()
      .subscribe(assignments => this.assignments = assignments);
  }

  onAddAssignmentBtnClick() {
    //this.formVisible = true;
  }

  onSearchTextChange() {
    this.updating(this.page, this.limit,this.searchText);
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

  // columnsToDisplay = ['nom','rendu','dateDeRendu','auteur','note','matiere','remarques','actions','actions2','actions3'];


  deleteAssignmentByNom(nom: string) {
    let index = this.assignments.findIndex(assignment => assignment.nom === nom);
    this.assignments.splice(index, 1);
  }

  onAssignmentDeleted(event: Assignment) {
    this.deleteAssignmentByNom(event.nom);
    this.assignementSelectionne = undefined;
  }

  assignmentClique(assignment: Assignment) {
    this.assignementSelectionne = assignment;
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
}
