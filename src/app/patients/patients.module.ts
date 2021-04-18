/*
 *
 *  * Copyright 2016-2017 the original author or authors.
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
import {PatientService} from './patient.service';
import {PatientListComponent} from './patient-list/patient-list.component';
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PatientAddComponent} from './patient-add/patient-add.component';
import {PatientEditComponent} from './patient-edit/patient-edit.component';
import {PatientsRoutingModule} from './patients-routing.module';
import {VisitsModule} from '../visits/visits.module';
import { ChipsModule } from '../common-component/chips/chips.module';
import {
  MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule,
  MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatPaginatorModule
} from '@angular/material';
import { MatTableModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PatientsRoutingModule,
    VisitsModule,
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
    PatientListComponent,
    PatientDetailComponent,
    PatientEditComponent,
    PatientAddComponent
  ],
  providers: [PatientService]

})

export class PatientsModule {
}
