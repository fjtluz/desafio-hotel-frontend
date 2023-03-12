import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {DataViewModule} from 'primeng/dataview';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from "primeng/table";
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

const PRIME_NG_MODULES = [
  CardModule,
  InputTextModule,
  DataViewModule,
  CalendarModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  DialogModule,
  ConfirmDialogModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...PRIME_NG_MODULES
  ],
  exports: [
    ...PRIME_NG_MODULES
  ]
})
export class SharedModule { }
