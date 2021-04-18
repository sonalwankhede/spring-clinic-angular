/*
 *
 *  * Copyright 2016-2018 the original author or authors.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

/**
 * @author Sonal Wankhede
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DrugListComponent} from './drug-list/drug-list.component';
import {DrugService} from './drug.service';
import {DrugsRoutingModule} from './drugs-routing.module';
import {DrugEditComponent} from './drug-edit/drug-edit.component';
import {DrugAddComponent} from './drug-add/drug-add.component';
import {DrugResolver} from './drug-resolver';
import { ChipsModule} from '../common-component/chips/chips.module';
import {
  MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule,
  MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatPaginatorModule
} from '@angular/material';
import { MatTableModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    DrugsRoutingModule,
    ChipsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    DrugListComponent,
    DrugEditComponent,
    DrugAddComponent
  ],
  exports: [
    DrugListComponent,
    DrugEditComponent,
    DrugAddComponent
  ],
  providers: [DrugService, DrugResolver]
})
export class DrugsModule {
}
