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

import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../patient';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';


@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  errorMessage: string;
  patient: Patient;
  viewAllVisits: boolean;

  public patientForm: FormGroup;
  public formBuilder: FormBuilder;
  loader: boolean;
  dialogRef: MatDialogRef<AlertDialogComponent>;

  constructor(private route: ActivatedRoute, private router: Router, private patientService: PatientService
    , public dialog: MatDialog) {
    this.viewAllVisits = false;
    this.patient = {} as Patient;
    this.formBuilder = new FormBuilder();

  }

  ngOnInit() {
    const patientId = this.route.snapshot.params.id;
    this.patientService.getPatientById(patientId).subscribe(
      patient => {
        this.patient = patient,
          this.patientForm = this.formBuilder.group({
            firstName: new FormControl({ value: this.patient.firstName, disabled: true }),
            lastName: new FormControl({ value: this.patient.lastName, disabled: true }),
            middleName: new FormControl({ value: this.patient.middleName, disabled: true }),
            address: new FormControl({ value: this.patient.address, disabled: true }),
            city: new FormControl({ value: this.patient.city, disabled: true }),
            gender: new FormControl({ value: this.patient.gender, disabled: true }),
            telephone: new FormControl({ value: this.patient.telephone, disabled: true }),
            age: new FormControl({ value: this.patient.age, disabled: true }),
            drugAllergies: new FormControl({ value: this.patient.drugAllergies, disabled: true }),
            otherAllergies: new FormControl({ value: this.patient.otherAllergies, disabled: true }),
            history: new FormControl({ value: this.patient.history, disabled: true })
          });
      }, (error) => {
        console.log(error);
        this.errorMessage = 'There was an issue while fetching patient details. Please retry';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRef = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRef.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
            this.router.navigate(['/patients']);
          }
        });
      });
  }

  gotoPatientsList() {
    this.router.navigate(['/patients']);
  }

  editPatient() {
    this.router.navigate(['/patients', this.patient.id, 'edit']);
  }

  addVisit(patient: Patient) {
    this.router.navigate(['/patients', patient.id, 'visits', 'add']);
  }

  goToViewAllVisits(flag: boolean) {
    this.viewAllVisits = flag;
  }
  public onCancel() {
    this.router.navigate(['/patients']);
  }
  public redirectToAddVisit() {
    this.router.navigate(['/patients', this.patient.id, 'visits', 'add']);
  }
  public redirectToViewAllVisits() {
    this.router.navigate(['/patients', this.patient.id, 'visits']);
  }
}
