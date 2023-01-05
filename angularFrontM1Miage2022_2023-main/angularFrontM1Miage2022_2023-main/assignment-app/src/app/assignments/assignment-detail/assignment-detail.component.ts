import { Component, EventEmitter, /*Input,*/ OnInit, Output} from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsComponent } from '../assignments.component';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  //@Input()
  assignementTransmis: Assignment = new Assignment;
  @Output() assignmentASupprimer  = new EventEmitter<Assignment>();

  droits = localStorage.getItem('DROITS');
  token = localStorage.getItem('ACCESS_TOKEN');

  onAssignmentRendu() {
    this.assignementTransmis.rendu = true;

    this.assignmentService.updateAssignment(this.assignementTransmis)
      .subscribe(message => {
        console.log(message);

        window.location.reload();
      });

  }

  onDeleteRendu(){
    this.assignmentService.deleteAssignment(this.assignementTransmis)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(["/home"]);
      });
  }

  onClickEdit(){
    const id = +this.route.snapshot.params['id'];
    this.router.navigate(["assignment/"+id+"/edit"]);
  }

  constructor(private assignmentService: AssignmentsService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getAssignment();
  }
  getAssignment() {
    // on recupere l'id de l'assignment passé par le router
    // le + devant le this.route.snapshot.paramMap.get('id') permet de convertir la chaine de caractère en nombre
    const id = +this.route.snapshot.params['id'];
    this.assignmentService.getAssignment(id)
      .subscribe(assignment => this.assignementTransmis = assignment!);
  }
  isAdmin():boolean{
    return this.authService.loggedIn;
  }
}
