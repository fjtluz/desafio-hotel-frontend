import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckInRoutingModule } from './check-in-routing.module';
import { CheckInComponent } from './check-in.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CheckInComponent
  ],
    imports: [
        CommonModule,
        CheckInRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class CheckInModule { }
