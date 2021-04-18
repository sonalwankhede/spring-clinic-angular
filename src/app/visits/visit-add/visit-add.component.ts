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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../patients/patient.service';
import { Patient } from '../../patients/patient';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Diagnosis } from 'app/models/diagnosis';
import { DrugService } from 'app/drugs/drug.service';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormArray } from '@angular/forms';


export class PrescriptedDrugs {
  drug: string;
  dose: string;
  duration: string;
  instructions: string
}
@Component({
  selector: 'app-visit-add',
  templateUrl: './visit-add.component.html',
  styleUrls: ['./visit-add.component.css']
})
export class VisitAddComponent implements OnInit {
  prescriptionsArray = new Array<PrescriptedDrugs>();

  visitForm: FormGroup;
  public formBuilder: FormBuilder;

  visit: Visit;
  currentPatient: Patient;
  addedSuccess = false;
  errorMessage: string;

  description: string[];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  diagnosisCtrl = new FormControl();
  issueCtrl = new FormControl();
  diagnosisList: string[];
  tempIssueList: string[];
  diagnosisDictionary: any;
  issuesResponse: String[];
  showDiagnosis = false;
  showHealthIssues = false;
  showDrugs = false;

  diagnosisNew: Diagnosis[];
  tempDiagnosis: Diagnosis;

  drugsList = [];
  observationsList = [];
  pathologyList = [];
  radiologyList = [];

  finalDrugsList = [];
  finalObservationsList = [];
  finalComplaintsList = [];
  finalDiagnosisList: string[] = [];

  finalComplaints: string[] = [];
  finalRadiologyList = [];
  finalPathologyList = [];

  complaints = 'complaints';
  observations = 'observations';
  diagnosis = 'diagnosis';
  drugsConstant = 'drugs';
  pathology = 'pathology';
  radiology = 'radiology';

  complaintsPlaceholder = 'What complaints does the patient have?';
  observationsPlaceholder = 'What observations have you made?';
  diagnosisPlaceholder = 'Add your diagnosis here!';
  drugsPlaceholder = 'Prescribe drugs here!';

  showVisitForm: boolean = false;
  loader: boolean;

  dose = [
    '1-0-1',
    '0-1-1',
    '1-1-1',
    '0-0-1',
    '1-1-0',
    '1-0-0'
  ];

  duration = [
    'Before Meal',
    'After Meal',
    'Empty Stomach',
  ];

  prescriptions: FormArray;

  drugLabel = 'Select Drug';
  mealRequirement = 'Select Meal Requirement';
  timeRequirement = 'Select Dose Requirement';

  drugClassName = 'widest';
  mealClassName = 'wider';
  timeClassName = 'wide';

  drug = 'drug';

  selectedDrug: string;
  selectedMealRequirement: string;
  selectedTimeClassName: string;

  drugsInterface: PrescriptedDrugs;
  drugsInterfaceList: any = [];

  @ViewChild('diagnosisInput', { static: true }) diagnosisInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  issuesList: string[];
  celsiusValue: number;
  observationsResponse: string[];
  showRadioChips: boolean = false;
  showPathChips: boolean = false;

  constructor(private visitService: VisitService, private patientService: PatientService,
    private commonService: CommonService, private drugService: DrugService,
    private router: Router, private route: ActivatedRoute) {
    this.loader = false;
    this.prescriptionsArray = [
      {
        drug: '',
        duration: '',
        dose: '',
        instructions: ''
      }
    ];
    this.visit = {} as Visit;
    this.currentPatient = {} as Patient;
    this.description = [];
    this.diagnosisList = [];
    this.issuesList = [];
    this.formBuilder = new FormBuilder();

    this.visitForm = this.formBuilder.group({
      visitDate: new FormControl(new Date()),
      temperature: new FormControl('', [Validators.required]),
      pulse: new FormControl('', [Validators.required]),
      spo2: new FormControl('', [Validators.required]),
      respirationRate: new FormControl('', []),
      bloodPressure: new FormControl('', []),
      height: new FormControl('', []),
      weight: new FormControl('', []),
      bmi: new FormControl('', []),
      complaints: new FormControl('', []),
      observations: new FormControl('', []),
      diagnosis: new FormControl('', []),
      prescriptions: this.formBuilder.array([this.createDrugArray()]),
      pathology: new FormControl('No', []),
      radiology: new FormControl('No', [])
    });
  }
  isFormValid(): boolean {
    return !this.visitForm.valid || this.prescriptionsArray[0].drug === ''
      || this.finalDiagnosisList.length === 0 || this.finalComplaintsList.length === 0 ||
      this.finalObservationsList.length === 0
  }
  createDrugArray(): any {
    return this.formBuilder.group({
      drug: new FormControl('', []),
      duration: new FormControl('', []),
      dose: new FormControl('', []),
      instructions: new FormControl('', [])
    });
  }
  addDrug(): void {
    this.prescriptions = this.visitForm.get('prescriptions') as FormArray;
    this.prescriptions.push(this.createDrugArray());
  }
  // remove contact from group
  removeDrug(index) {
    this.prescriptions.removeAt(index);
  }
  setListValue(event, i, fieldName) {
    this.prescriptionsArray[i] ? this.prescriptionsArray[i][fieldName] = event
      : this.prescriptionsArray[i] = this.getPrescriptionObject(), this.prescriptionsArray[i][fieldName] = event;
  }

  private getPrescriptionObject(): PrescriptedDrugs {
    return {
      drug: '',
      duration: '',
      dose: '',
      instructions: ''
    };
  }

  radioChange(event, type: string) {
    if (event.value == 'Yes') {
      this.openThisTypeOfChip(type);
    } else if (event.value == 'No') {
      this.closeThisTypeOfChip(type);
    }
  }
  openThisTypeOfChip(type: string) {
    if (type == 'pathChips') {
      this.showPathChips = true;
    } else if (type == 'radioChips') {
      this.showRadioChips = true;
    }
  }
  closeThisTypeOfChip(type: string) {
    if (type == 'pathChips') {
      this.showPathChips = false;
      this.finalPathologyList = [];
    } else if (type == 'radioChips') {
      this.showRadioChips = false;
      this.finalRadiologyList = [];
    }
  }
  ngOnInit() {
    console.log(this.route.parent);
    const patientId = this.route.snapshot.params.id;

    this.patientService.getPatientById(patientId).subscribe(
      response => {
        this.currentPatient = response;
        this.visit.patient = this.currentPatient;
        this.showVisitForm = true;
      },
      error => this.errorMessage = error as any);
    forkJoin([this.commonService.getDiagnosisDictionary(),
    this.commonService.getKnownCase(),
    this.commonService.getAllObservations(),
    this.drugService.getDrugs(),
    this.commonService.getPathology(),
    this.commonService.getRadiology()]).subscribe(
      results => {
        this.separteOutStringFromObject(results[0], 'diagnosis', this.diagnosisList);
        this.separteOutStringFromObject(results[1], 'issues', this.issuesList);
        this.separteOutStringFromObject(results[2], 'observations', this.observationsList);
        let result = results[3];
        for (let key in result) {
          delete result[key].id;
          this.drugsList.push(Object.values(result[key]).join(' '));
        }
        this.separteOutStringFromObject(results[4], 'pathology', this.pathologyList);
        this.separteOutStringFromObject(results[5], 'radiology', this.radiologyList);
        this.showDrugs = true;
      });
  }

  separteOutStringFromObject(resultList, field, arrayToBePushedTo) {
    for (let key in resultList) {
      arrayToBePushedTo.push(resultList[key][field]);
    }
  }
  addObservations() {
    for (let key in this.observationsResponse) {
      const value = this.observationsResponse[key];
      this.observationsList.push(value['observations']);
    }
  }
  addDiagnosis(): void {
    for (let key in this.diagnosisDictionary) {
      const value = this.diagnosisDictionary[key];
      this.diagnosisList.push(value.diagnosis);
    }
    this.showDiagnosis = true;
  }

  addIssues(): void {
    for (let key in this.issuesResponse) {
      const value = this.issuesResponse[key];
      this.issuesList.push(value['issues']);
    }
    this.showHealthIssues = true;
  }

  onSubmit(visit: Visit) {
    visit.id = null;
    const that = this;
    visit.patient = this.currentPatient;
    visit.visitDate = moment(visit.visitDate).format('YYYY/MM/DD');
    visit.diagnosis = this.finalDiagnosisList.toString();
    visit.complaints = this.finalComplaintsList.toString();
    visit.observations = this.finalObservationsList.toString();
    if (visit['pathology'] === 'No') {
      visit.pathology = '';
    } else {
      visit.pathology = this.finalPathologyList.toString();
    }
    if (visit['radiology'] === 'No') {
      visit.radiology = '';
    } else {
      visit.radiology = this.finalRadiologyList.toString();
    }
    visit['prescriptions'] = [];
    visit['prescriptions'] = this.prescriptionsArray;
    this.loader = true;
    this.visitService.addVisit(visit).subscribe(
      newVisit => {
        this.visit = newVisit;
        this.addedSuccess = true;
        this.goToVisitDetails();
      },
      error => this.errorMessage = error as any
    );
    const newlyAddedDiagnosis = this.finalDiagnosisList.filter(x => !this.diagnosisList.includes(x));
    this.diagnosisNew = [];
    for (let key in newlyAddedDiagnosis) {
      this.tempDiagnosis = {} as Diagnosis;
      this.tempDiagnosis.diagnosis = newlyAddedDiagnosis[key];
      this.diagnosisNew.push(this.tempDiagnosis);
    }
    if (this.diagnosisNew != null) {
      this.commonService.addToDiagnosisDictionary(this.diagnosisNew).subscribe(
        newlyAdded => {
        },
        error => this.errorMessage = error as any
      );
    }
  }
  goToVisitDetails() {
    this.router.navigate(['/patients', this.visit.patient.id, 'visits', this.visit.id, 'detail']);
  }

  gotoPatientList() {
    this.router.navigate(['/patients']);
  }
}
