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
import {RouterModule, Routes} from '@angular/router';
import { ComplaintsComponent } from './complaints/complaints/complaints.component';
import { DrugAllergiesComponent } from './drug-allergies/drug-allergies/drug-allergies.component';
import { DrugAddComponent } from './drugs/drug-add/drug-add.component';
import { DrugEditComponent } from './drugs/drug-edit/drug-edit.component';
import { DrugListComponent } from './drugs/drug-list/drug-list.component';
import { KnownCaseComponent } from './known-case/known-case/known-case.component';
import { OtherAllergiesComponent } from './other-allergies/other-allergies/other-allergies.component';
import {PageNotFoundComponent} from './parts/page-not-found/page-not-found.component';
import {WelcomeComponent} from './parts/welcome/welcome.component';
import { PathologyComponent } from './pathology/pathology/pathology.component';
import { PatientAddComponent } from './patients/patient-add/patient-add.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { PatientEditComponent } from './patients/patient-edit/patient-edit.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { PreliminaryDiagnosisComponent } from './preliminary-diagnosis/preliminary-diagnosis/preliminary-diagnosis.component';
import { RadiologyComponent } from './radiology/radiology/radiology.component';
import { VisitAddComponent } from './visits/visit-add/visit-add.component';
import { VisitEditComponent } from './visits/visit-edit/visit-edit.component';
import { VisitListComponent } from './visits/visit-list/visit-list.component';

const appRoutes: Routes = [
  {path: 'welcome', component: WelcomeComponent},
  {path: '', component: WelcomeComponent},

  {path: 'patients', component: PatientListComponent},
  {path: 'patients/add', component: PatientAddComponent},
  {path: 'patients/:id', component: PatientDetailComponent},
  {path: 'patients/:id/edit', component: PatientEditComponent},

  {path: '**/visits/add', component: VisitAddComponent},
  {path: '**/visits/:id/edit', component: VisitEditComponent},
  {path: 'patients/:id/visits', component: VisitListComponent},

  {path: 'drugs', component: DrugListComponent},
  {path: 'drugs/add', component: DrugAddComponent},
  {path: 'drugs/:id/edit' , component: DrugEditComponent},

  {path: 'pathology', component: PathologyComponent},
  {path: 'radiology', component: RadiologyComponent},
  {path: 'drugAllergies', component: DrugAllergiesComponent},
  {path: 'otherAllergies', component: OtherAllergiesComponent},
  {path: 'complaints', component: ComplaintsComponent},
  {path: 'preliminaryDiagnosis', component: PreliminaryDiagnosisComponent},
  {path: 'knownCase', component: KnownCaseComponent},

  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
