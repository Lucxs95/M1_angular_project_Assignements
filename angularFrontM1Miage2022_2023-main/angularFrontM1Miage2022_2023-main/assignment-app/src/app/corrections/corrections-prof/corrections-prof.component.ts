import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Assignment} from "../../assignments/assignment.model";
import {AssignmentsService} from "../../shared/assignments.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-corrections-prof',
  templateUrl: './corrections-prof.component.html',
  styleUrls: ['./corrections-prof.component.css']
})
export class CorrectionsProfComponent implements OnInit, AfterViewInit {
  @ViewChild('paginatorAssignment') paginatorAssignment: MatPaginator;
  assignments!: Assignment[];
  dataSourceAssignments: MatTableDataSource<Assignment>;
  columnsToDisplay = [];
  droits = localStorage.getItem('ROLE');
  constructor(private assignmentsService: AssignmentsService) {
    this.dataSourceAssignments = new MatTableDataSource(this.assignments);
  }

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
    this.assignmentsService.getAssignments()
      .subscribe(data => {
        this.assignments = data;
        this.dataSourceAssignments.data = data.filter(
          assignment => assignment.matiere === matiereProf && assignment.rendu
            === true && assignment.note === null);
      });
  }

  ngAfterViewInit() {
    this.dataSourceAssignments.paginator = this.paginatorAssignment;
  }

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
}
