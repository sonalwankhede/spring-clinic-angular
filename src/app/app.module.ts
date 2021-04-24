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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PatientsModule } from './patients/patients.module';
import { VisitsModule } from './visits/visits.module';
import { FooterModule } from './common-component/footer/footer.module';
import { ChipsModule } from './common-component/chips/chips.module';
import { ConfirmDialogModule } from './common-component/dialog/confirm-dialog.module';
import { DrugsModule } from './drugs/drugs.module';
import { PartsModule } from './parts/parts.module';
import { HttpErrorHandler } from './error.service';
import { CommonService } from './common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllergyAddComponent } from './allergies/allergy-add/allergy-add.component';
import {DatePipe} from '@angular/common';
import { PrescriptionsAddComponent } from './prescriptions/prescriptions-add/prescriptions-add.component';
import {
  MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule, MatSortModule, MatCheckboxModule,
  MatSelectModule, MatIconModule, MatCardModule, MatRadioModule, MatPaginatorModule, MatDividerModule
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { LoginModule } from './login/login.module';
import { HeaderModule } from './common-component/header/header.module';
import { TemperatureModule } from './common-component/temperature/temperature.module';
import { SelectModule } from './common-component/select/select.module';
import { PathologyComponent } from './pathology/pathology/pathology.component';
import { RadiologyComponent } from './radiology/radiology/radiology.component';
import { DrugAllergiesComponent } from './drug-allergies/drug-allergies/drug-allergies.component';
import { OtherAllergiesComponent } from './other-allergies/other-allergies/other-allergies.component';
import { ComplaintsComponent } from './complaints/complaints/complaints.component';
import { PreliminaryDiagnosisComponent } from './preliminary-diagnosis/preliminary-diagnosis/preliminary-diagnosis.component';
import { KnownCaseComponent } from './known-case/known-case/known-case.component';

@NgModule({
  declarations: [
    AppComponent,
    AllergyAddComponent,
    PrescriptionsAddComponent,
    PathologyComponent,
    RadiologyComponent,
    DrugAllergiesComponent,
    OtherAllergiesComponent,
    ComplaintsComponent,
    PreliminaryDiagnosisComponent,
    KnownCaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TemperatureModule,
    PatientsModule,
    VisitsModule,
    FooterModule,
    HeaderModule,
    SelectModule,
    ChipsModule,
    LoginModule,
    DrugsModule,
    PartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ConfirmDialogModule
  ],
  providers: [
    HttpErrorHandler,
    CommonService,
    DatePipe
  ],
  exports: [
    MatFormFieldModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatDividerModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ConfirmDialogModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
