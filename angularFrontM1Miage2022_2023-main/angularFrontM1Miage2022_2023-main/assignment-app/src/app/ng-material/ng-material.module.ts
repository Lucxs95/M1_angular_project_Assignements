import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBasicComponent } from './mat-basic/mat-basic.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    MatBasicComponent
  ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatIconModule,

    ], exports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class NgMaterialModule { }
