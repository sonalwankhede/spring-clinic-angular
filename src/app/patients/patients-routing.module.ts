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
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {PatientListComponent} from './patient-list/patient-list.component';
import {PatientEditComponent} from './patient-edit/patient-edit.component';
import {PatientAddComponent} from './patient-add/patient-add.component';
import {VisitAddComponent} from '../visits/visit-add/visit-add.component';

const patientRoutes: Routes = [
  {path: 'patients', component: PatientListComponent},
  {path: 'patients/add', component: PatientAddComponent},
  {path: 'patients/:id', component: PatientDetailComponent},
  {path: 'patients/:id/edit', component: PatientEditComponent},
  {path: 'patients/:id/visits/add', component: VisitAddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(patientRoutes)],
  exports: [RouterModule]
})

export class PatientsRoutingModule {
}
