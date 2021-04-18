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
import { Router } from '@angular/router';
import { CommonService } from 'app/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})
export class PatientAddComponent implements OnInit {

  patient: Patient;
  errorMessage: string;
  drugAllergiesList: string[] = [];
  allergyCtrl = new FormControl();
  public patientForm: FormGroup;

  otherAllergiesList: string[];
  showLists: boolean;
  finalOtherAllergiesList = [];
  finalDrugAllergiesList = [];
  caseList = [];
  finalCaseList = [];

  drugAllergies ='drugAllergies';
  otherAllergies ='otherAllergies';
  history = 'history';
  allvalid: boolean = false;
  public formBuilder: FormBuilder;
  loader: boolean;

  constructor(private patientService: PatientService, private router: Router, private commonService: CommonService) {
    this.patient = {} as Patient;
    this.loader = false;
    this.otherAllergiesList = [];
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
      drugAllergies: new FormControl('', [Validators.required]),
      otherAllergies: new FormControl('', [Validators.required]),
      history: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
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
    forkJoin([this.commonService.getOtherAllergies(), this.commonService.getDrugAllergies(),
      this.commonService.getKnownCase() ]).subscribe(
      results => {
        this.separteOutStringFromObject(results[0], 'allergy', this.otherAllergiesList);
        this.separteOutStringFromObject(results[1], 'allergy', this.drugAllergiesList);
        this.separteOutStringFromObject(results[2], 'issues', this.caseList);
        this.showLists = true;
      }
    )
  }
  checkIfFormIsValid(): boolean{
    return this.patientForm.valid && this.finalDrugAllergiesList.length != 0 &&
      this.finalCaseList.length != 0 && this.finalOtherAllergiesList.length != 0;
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
    this.router.navigate(['/welcome']);
  }
  public createPatient = (patientFormValue) => {
    if (this.patientForm.valid) {
      this.loader = true;
      this.executePatientCreation(patientFormValue);
    }
  }
  private executePatientCreation = (patientFormValue) => {
    let patient: Patient = {
      firstName: patientFormValue.firstName,
      lastName: patientFormValue.lastName,
      middleName: patientFormValue.middleName,
      address: patientFormValue.address,
      city: patientFormValue.city,
      gender: patientFormValue.gender,
      id: null,
      telephone: patientFormValue.telephone,
      visits: [],
      age: patientFormValue.age,
      drugAllergies: this.finalDrugAllergiesList.toString(),
      otherAllergies: this.finalOtherAllergiesList.toString(),
      history: this.finalCaseList.toString()
    }
    this.loader = true;
    this.patientService.addPatient(patient)
      .subscribe(res => {
        this.router.navigate(['/patients/'+ res.id +'/visits/add']);
      },
        (error => {
          //temporary as well
          // this.location.back();
        })
      )
  }

  onSubmit(patient: Patient) {
    patient.id = null;
    this.patientService.addPatient(patient).subscribe(
      newPatient => {
        this.patient = newPatient;
        this.gotoPatientsList();
      },
      error => this.errorMessage = error as any
    );
  }

  gotoPatientsList() {
    this.router.navigate(['/patients']);
  }
}