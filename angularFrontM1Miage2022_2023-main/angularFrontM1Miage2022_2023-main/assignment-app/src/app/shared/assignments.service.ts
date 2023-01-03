import {Injectable} from '@angular/core';
import {Assignment} from '../assignments/assignment.model';
import {Observable, of} from 'rxjs';
import {LoggingService} from './logging.service';
import {HttpClient} from "@angular/common/http";
import {bdInitialAssignments} from "./data";

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  ajoutActive = false;
  nomDevoir: string = "";
  dateDeRendu: Date = new Date();
  assignementSelectionne?: Assignment;
  formVisible = false;
  id!: number;
  assignments: Assignment[] = [];

  constructor(private loggingService: LoggingService, private http: HttpClient) {
  }

  url = "https://lucas-api.angular.bdemiagenice.fr/api/assignments";

  ngOnInit(): void {
    this.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
    });
  }

  getAssignments(): Observable<Assignment[]> {
    // return of(this.assignments);
    return this.http.get<Assignment[]>(this.url);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    // this.assignments.push(assignment);
    // this.loggingService.log(assignment.nom, "ajouté");
    // return of("Assignment ajouté");
    return this.http.post<Assignment>(this.url, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    // return of("Assignment service: assignment mis à jour");
    return this.http.put<Assignment>(this.url + "/" + assignment.id + "/updateAssignment", assignment);

  }

  deleteAssignment(assignment: Assignment): Observable<string> {
    // let pos = this.assignments.indexOf(assignment);
    // this.assignments.splice(pos, 1);
    // return of("Assignment service: assignment supprimé !");
    let deleteURI = this.url + "/" + assignment._id;
    return this.http.delete<string>(deleteURI);
  }

  getAssignment(id: number): Observable<Assignment | undefined> {
    // return of(this.assignments.find(a => a.id === id));
    return this.http.get<Assignment>(this.url + "/" + id);

  }

  getAssignmentsPagine(page: number, limit: number,search ?: string): Observable<any> {
    return this.http.get(this.url + "?page=" + page + "&limit=" + limit +"&search=" + search);
  }

  getAssignmentsPagineWhereProf(page: number, limit: number): Observable<any> {
    return this.http.get(this.url + "?page=" + page + "&limit=" + limit);
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.id = a.id;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;
      nouvelAssignment.note = a.note;
      nouvelAssignment.remarques = a.remarques;
      nouvelAssignment.matiere = a.matiere;
      nouvelAssignment.auteur = a.auteur;

      this.addAssignment(nouvelAssignment).subscribe();

      // this.addAssignment(nouvelAssignment)
      //   .subscribe(response => console.log(response.message));

    })
  }

}
