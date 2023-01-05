import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AssignmentsService} from '../shared/assignments.service';
import {Assignment} from '../assignments/assignment.model';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  @ViewChild('paginatorAssignment') paginatorAssignment: MatPaginator;
  assignments!: Assignment[];
  booleanRendusFiltre: boolean = false;
  searchText: string = "";
  dataSourceAssignments: MatTableDataSource<Assignment>;
  columnsToDisplay = [];
  droits = localStorage.getItem('ROLE');

  constructor(private assignmentsService: AssignmentsService) {
    this.dataSourceAssignments = new MatTableDataSource(this.assignments);
  }

  ngOnInit() {
    this.assignmentsService.getAssignments()
      .subscribe(data => {
        console.log("data", data);
        this.assignments = data;
        this.dataSourceAssignments.data = data;
      })
  }
  ngAfterViewInit() {
    this.dataSourceAssignments.paginator = this.paginatorAssignment;
  }
  updating() {
    this.dataSourceAssignments.data = this.assignments.filter(
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
          return assignment.nom.toLowerCase().includes(this.searchText.toLowerCase())
            || assignment.auteur.toLowerCase().includes(this.searchText.toLowerCase())
            || assignment.matiere.toLowerCase().includes(this.searchText.toLowerCase());
        } else {
          return assignment;
        }
      }
    );

    console.log("données reçues");

  }
  onChangeBooleanRenduFiltre() {
    this.booleanRendusFiltre = !this.booleanRendusFiltre;
    this.updating();
  }
  onSearchTextChange() {
    this.updating();
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
