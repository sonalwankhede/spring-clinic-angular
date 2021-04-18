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
import { Patient } from '../patient';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommonService } from 'app/common.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit {
  patient: Patient;
  errorMessage: string; // server error message
  public patientForm: FormGroup;
  public formBuilder: FormBuilder;

  finalDrugAllergiesList: string[] = [];
  finalOtherAllergiesList: string[] = [];
  finalCaseList: string[] = [];
  showLists: boolean = false;
  drugAllergiesList: string[] = [];
  otherAllergiesList: string[] = [];
  caseList: string[] = [];

  drugAllergies ='drugAllergies';
  otherAllergies ='otherAllergies';
  history = 'history';

  constructor(private patientService: PatientService, private route: ActivatedRoute, private router: Router,
    private commonService: CommonService) {
    this.patient = {} as Patient;
    this.formBuilder = new FormBuilder();
    this.patientForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      middleName: new FormControl(),
      address: new FormControl('', [Validators.maxLength(100)]),
      city: new FormControl('', [Validators.maxLength(100)]),
      gender: new FormControl('', [Validators.required]),
      telephone: new FormControl('', []),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      drugAllergies: new FormControl('', []),
      otherAllergies: new FormControl('', []),
      history: new FormControl('', [])
    });
  }

  ngOnInit() {
    const patientId = this.route.snapshot.params.id;
    forkJoin([this.commonService.getOtherAllergies(), this.commonService.getDrugAllergies(),
      this.commonService.getKnownCase() ]).subscribe(
      results => {
        this.separteOutStringFromObject(results[0], 'allergy', this.otherAllergiesList);
        this.separteOutStringFromObject(results[1], 'allergy', this.drugAllergiesList);
        this.separteOutStringFromObject(results[2], 'issues', this.caseList);
      }
    )
    this.patientService.getPatientById(patientId).subscribe(
      patient => {
        this.patient = patient;
        this.patientForm.controls.firstName.setValue(this.patient.firstName);
        this.patientForm.controls.lastName.setValue(this.patient.lastName);
        this.patientForm.controls.age.setValue(this.patient.age);
        this.patientForm.controls.city.setValue(this.patient.city);
        this.patientForm.controls.address.setValue(this.patient.address);
        this.patientForm.controls.middleName.setValue(this.patient.middleName);
        this.patientForm.controls.telephone.setValue(this.patient.telephone);
        this.patientForm.controls.gender.setValue(this.patient.gender);
        this.finalDrugAllergiesList = this.patient.drugAllergies.split(',');
        this.finalOtherAllergiesList = this.patient.otherAllergies.split(',');
        this.finalCaseList = this.patient.history.split(',');
        this.showLists = true;
      });
  }
  separteOutStringFromObject(resultList, field, arrayToBePushedTo) {
    for (let key in resultList) {
      arrayToBePushedTo.push(resultList[key][field]);
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.patientForm.controls[controlName].hasError(errorName);
  }
  public onCancel = () => {
    this.router.navigate(['/patients']);
  }
  updatePatient(patient: Patient) {
    patient.drugAllergies = this.finalDrugAllergiesList.toString();
    patient.otherAllergies = this.finalOtherAllergiesList.toString();
    patient.history = this.finalCaseList.toString();
    this.patientService.updatePatient(this.patient.id, patient).subscribe(
      res => {
        // this.patient = res;
        this.gotoPatientDetail(this.patient);
      },
      error => this.errorMessage = error as any
    );
  }

  gotoPatientDetail(patient: Patient) {
    this.router.navigate(['/patients', patient.id]);
  }
  public redirectToAddVisit () {
    this.router.navigate(['/patients', this.patient.id, 'visits', 'add']);
  }
  public redirectToViewAllVisits () {
    this.router.navigate(['/patients', this.patient.id, 'visits']);
  }
}
