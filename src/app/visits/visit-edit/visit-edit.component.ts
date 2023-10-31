
/**
 * @author Sonal Wankhede
 */

import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../patients/patient';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Diagnosis } from 'app/models/diagnosis';
import { DrugService } from 'app/drugs/drug.service';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import * as moment from 'moment';


export class PrescriptedDrugs {
  serialNumber: number;
  drug: string;
  dose: string;
  duration: string;
  instructions: string
}
@Component({
  selector: 'app-visit-edit',
  templateUrl: './visit-edit.component.html',
  styleUrls: ['./visit-edit.component.css']
})
export class VisitEditComponent implements OnInit, OnChanges {
  prescriptionsArray = new Array<PrescriptedDrugs>();

  visitForm: FormGroup;
  public formBuilder: FormBuilder;

  visit: Visit;
  currentPatient: Patient;
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
  complaintsResponse: String[];
  showDiagnosis = false;
  showHealthComplaints = false;
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

  loader: boolean = false;

  dose = [
    '1-0-1',
    '0-1-1',
    '1-1-1',
    '0-0-1',
    '1-1-0',
    '1-0-0',
    '1/2-1/2-1/2',
    '1/2-1/2-0',
    '1/2-0-0',
    '1/2-0-1/2',
    '0-1/2-1/2',
    '0-0-1/2',
    '1/4-1/4-1/4',
    '1/4-1/4-0',
    '1/4-0-0',
    '1/4-0-1/4',
    '0-1/4-1/4',
    '0-0-1/4'
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
  complaintsList: string[];
  observationsResponse: string[];
  showRadioChips: boolean = false;
  showPathChips: boolean = false;
  height: number = 0;
  weight: number = 0;
  bmi: any = 0;
  bmiColor: string;
  bmiHint: string;
  dialogRef: MatDialogRef<AlertDialogComponent>;
  minDate: Date;

  constructor(private visitService: VisitService,
    private commonService: CommonService, private drugService: DrugService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, public datepipe: DatePipe) {
    this.prescriptionsArray = [
      {
        serialNumber: 0,
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
    this.complaintsList = [];
    this.observationsList = [];
    this.pathologyList = [];
    this.radiologyList = [];
    this.formBuilder = new FormBuilder();

    this.visitForm = this.formBuilder.group({
      visitDate: new FormControl({ value: '', disabled: true }, []),
      temperature: new FormControl('', [Validators.required]),
      pulse: new FormControl('', [Validators.required]),
      spo2: new FormControl('', [Validators.required]),
      respirationRate: new FormControl('', []),
      bloodPressure: new FormControl('', []),
      height: new FormControl('', []),
      weight: new FormControl('', []),
      bmi: new FormControl({ value: '', disabled: true }, []),
      complaints: new FormControl('', []),
      observations: new FormControl('', []),
      diagnosis: new FormControl('', []),
      prescriptions: this.formBuilder.array([this.createDrugArray()]),
      pathology: new FormControl('No', []),
      radiology: new FormControl('No', []),
      nextFollowUp: new FormControl('', [])
    });
  }
  isFormInvalid(): boolean {
    return !this.visitForm.valid || this.isPrescriptionValid()
      || this.finalDiagnosisList.length === 0 || this.finalComplaintsList.length === 0 ||
      this.finalObservationsList.length === 0;
  }
  isPrescriptionValid(): boolean {
    if (this.prescriptionsArray !== undefined) {
      for (const prescription of this.prescriptionsArray) {
        if (prescription === undefined || prescription.drug === undefined || prescription.drug === '' || prescription.drug === null) {
          return true;
        }
      }
    }
    return false;
  }
  createDrugArray(): any {
    return this.formBuilder.group({
      serialNumber: ['', []],
      drug: ['', []],
      duration: ['', []],
      dose: ['', []],
      instructions: ['', []]
    });
  }
  addDrug(): void {
    this.prescriptions = this.visitForm.get('prescriptions') as FormArray;
    const serialNumber = Math.max.apply(Math, this.prescriptions.value.map(function (o) { return o.serialNumber + 1; }));
    this.prescriptionsArray.push({
      serialNumber: serialNumber,
      drug: '',
      duration: '',
      dose: '',
      instructions: ''
    });
    this.prescriptions.push(this.createDrugArray());
    this.prescriptions.value[this.prescriptions.value.length - 1]['serialNumber'] = serialNumber;
  }
  // remove contact from group
  removeDrug(index) {
    const drugToDelete = this.prescriptions.value[index].drug;
    this.prescriptionsArray = this.prescriptions.value.filter(function (obj) {
      return obj.drug !== drugToDelete;
    });
    this.prescriptions.removeAt(index);
  }
  setListValue(event, i, fieldName) {
    if (fieldName === 'serialNumber') {
      this.prescriptionsArray[i] ? this.prescriptionsArray[i][fieldName] = Number(event)
        : this.prescriptionsArray[i] = this.getPrescriptionObject(), this.prescriptionsArray[i][fieldName] = Number(event);
    } else {
      this.prescriptionsArray[i] ? this.prescriptionsArray[i][fieldName] = event
        : this.prescriptionsArray[i] = this.getPrescriptionObject(), this.prescriptionsArray[i][fieldName] = event;
      this.prescriptionsArray[i].serialNumber === 0 && this.prescriptionsArray.length === 1 ? this.prescriptionsArray[i].serialNumber = 1 : '';
    }
    this.visitForm.get('prescriptions').setValue(this.prescriptionsArray);
  }

  private getPrescriptionObject(): PrescriptedDrugs {
    return {
      serialNumber: 0,
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
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }
  ngOnInit() {
    const visitId = this.route.snapshot.params.id;
    this.loader = true;
    this.visitService.getVisitById(visitId).subscribe(
      response => {
        this.visit = response;
        this.currentPatient = this.visit.patient;
        forkJoin([
        this.commonService.getDiagnosisDictionary(),
        this.commonService.getAllComplaints(),
        this.commonService.getAllObservations(),
        this.commonService.getPathology(),
        this.commonService.getRadiology()]).subscribe(
          results => {
            this.separteOutStringFromObject(results[0], 'diagnosis', this.diagnosisList);
            this.separteOutStringFromObject(results[1], 'complaints', this.complaintsList);
            this.separteOutStringFromObject(results[2], 'observations', this.observationsList);
            this.separteOutStringFromObject(results[3], 'pathology', this.pathologyList);
            this.separteOutStringFromObject(results[4], 'radiology', this.radiologyList);
            this.setFormValues();
          });
      }, (error) => {
        console.log(error);
        this.loader = false;
        this.errorMessage = 'There was an issue.';
      });
    this.drugService.getDrugs().subscribe(result => {
      for (let obj of result) {
        delete obj.id;
        this.drugsList.push((obj.formOfDrugs ? obj.formOfDrugs.substring(0, 3) + '. ' : '') +
          (obj.brandName ? obj.brandName : '') + (obj.content ? ' (' + obj.content + ') ' : '') + (obj.strength ? obj.strength : ''));
      }
    });
  }
  getMinFollowUpdate() {
    var newdate = new Date(new Date(this.visitForm.get('visitDate').value));
    newdate.setDate(newdate.getDate() + 1);
    this.minDate = newdate;
  }
  setFormValues() {
    this.visitForm.controls.visitDate.setValue(new Date(this.visit.visitDate));
    this.visitForm.controls.nextFollowUp.setValue(this.visit.nextFollowUp ? new Date(this.visit.nextFollowUp) : '');
    this.getMinFollowUpdate();
    this.visitForm.controls.temperature.setValue(this.visit.temperature);
    this.visitForm.controls.pulse.setValue(this.visit.pulse);
    this.visitForm.controls.spo2.setValue(this.visit.spo2);
    this.visitForm.controls.respirationRate.setValue(this.visit.respirationRate);
    this.visitForm.controls.bloodPressure.setValue(this.visit.bloodPressure);
    this.height = this.visit.height;
    this.weight = this.visit.weight;
    this.bmi = this.visit.bmi;
    this.getBmiValue();
    this.visitForm.controls.height.setValue(this.visit.height);
    this.visitForm.controls.weight.setValue(this.visit.weight);
    this.visitForm.controls.bmi.setValue(this.visit.bmi);
    this.finalComplaintsList = this.visit.complaints.split(',');
    this.finalObservationsList = this.visit.observations.split(',');
    this.finalDiagnosisList = this.visit.diagnosis.split(',');
    this.prescriptionsArray = this.visit.prescription;
    this.prescriptionsArray.sort(function (a, b) {
      return a.serialNumber - b.serialNumber;
    });
    this.prescriptions = new FormArray([]);
    for (let x of this.prescriptionsArray) {
      this.prescriptions.push(this.formBuilder.group({
        serialNumber: x.serialNumber,
        drug: x.drug,
        dose: x.dose,
        duration: x.duration,
        instructions: x.instructions
      }));
      if (!this.drugsList.includes(x.drug)) {
        this.drugsList.push(x.drug);
      }
    }
    this.visitForm.setControl('prescriptions', this.prescriptions);
    if (this.visit.radiology) {
      this.visitForm.controls.radiology.setValue('Yes');
      this.showRadioChips = true;
      this.finalRadiologyList = this.visit.radiology.split(',');
    }
    if (this.visit.pathology) {
      this.visitForm.controls.pathology.setValue('Yes');
      this.showPathChips = true;
      this.finalPathologyList = this.visit.pathology.split(',');
    }
    this.showDrugs = true;
    this.loader = false;
  }
  getSelectedValue(i: number, fieldName: string) {
    return this.prescriptionsArray && this.prescriptionsArray[i] && this.prescriptionsArray[i][fieldName]
      ? this.prescriptionsArray[i][fieldName] : ''
  }
  createDrugArrayParams(prescription: PrescriptedDrugs): AbstractControl {
    return this.formBuilder.group({
      drug: new FormControl(prescription.drug, []),
      duration: new FormControl(prescription.duration, []),
      dose: new FormControl(prescription.dose, []),
      instructions: new FormControl(prescription.instructions, [])
    });
  }
  calculateBmi(value, field) {
    if (field === 'height') {
      this.height = value;
    }
    if (field === 'weight') {
      this.weight = value;
    }
    if (this.weight !== 0 && this.height !== 0) {
      var multiplier = Math.pow(10, 1 || 0);
      this.bmi = Math.round((this.weight / ((this.height * 0.01) * (this.height * 0.01))) * multiplier) / multiplier;
      this.visitForm.controls.bmi.setValue(this.bmi);
      this.getBmiValue();
    }
  }
  getBmiValue() {
    if (this.bmi < 18.5) {
      this.bmiColor = "#ffe400";
      this.bmiHint = 'Under Weight';
    } else if (this.bmi >= 18.5 && this.bmi <= 24) {
      this.bmiColor = "green";
      this.bmiHint = 'Healthy Weight';
    } else if (this.bmi > 24 && this.bmi <= 29.9) {
      this.bmiColor = "#ffe400";
      this.bmiHint = 'Over Weight';
    } else if (this.bmi > 30) {
      if (this.bmi > 30 && this.bmi <= 34.99) {
        this.bmiColor = "#ca5353";
        this.bmiHint = 'Obese Class I';
      } else if (this.bmi >= 35 && this.bmi <= 39.99) {
        this.bmiColor = "#b90606";
        this.bmiHint = 'Obese Class II';
      } else if (this.bmi >= 40) {
        this.bmiColor = "#8a0101";
        this.bmiHint = 'Obese Class III';
      }
    }
  }
  separteOutStringFromObject(resultList, field, arrayToBePushedTo) {
    for (let key in resultList) {
      arrayToBePushedTo.push(resultList[key][field]);
    }
  }

  onSubmit(visit: Visit) {
    visit.visitDate = new Date().toISOString();
    if (visit.nextFollowUp) {
      visit.nextFollowUp = new Date(visit.nextFollowUp).toISOString();
    } else {
      visit.nextFollowUp = '';
    }
    visit.id = null;
    visit.patient = this.currentPatient;
    if (this.bmi !== 0) {
      visit.bmi = this.bmi;
    } else {
      visit.bmi = null;
    }
    visit.diagnosis = this.finalDiagnosisList.join(', ');
    visit.complaints = this.finalComplaintsList.join(', ');
    visit.observations = this.finalObservationsList.join(', ');
    if (visit['pathology'] === 'No') {
      visit.pathology = '';
    } else {
      visit.pathology = this.finalPathologyList.join(', ');
    }
    if (visit['radiology'] === 'No') {
      visit.radiology = '';
    } else {
      visit.radiology = this.finalRadiologyList.join(', ');
    }
    visit['prescriptions'] = this.prescriptionsArray;
    this.loader = true;
    this.visitService.updateVisit(this.visit.id.toString(), visit).subscribe(
      newVisit => {
        this.loader = false;
        this.goToVisitDetails();
      }, (error) => {
        console.log(error);
        this.errorMessage = 'There was an issue while editing this visit. Please retry';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRef = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRef.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
            this.router.navigate(['/patients', this.visit.patient.id, 'visits', this.visit.id, 'edit']);
          }
        });
      });
    // this.addNewlyAddedDiagnosis();
    // this.addNewlyAddedObservations();
    // this.addNewlyAddedComplaints();
    // this.addNewlyAddedPathology();
    // this.addNewlyAddedRadiology();
  }
  addNewlyAddedPathology() {
    const newlyAddedPathologyScan = this.finalPathologyList.filter(x => !this.pathologyList.includes(x));
    const scansAreNew = [];
    for (let key in newlyAddedPathologyScan) {
      const tempScan = {};
      tempScan['pathology'] = newlyAddedPathologyScan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew != null) {
      this.commonService.addToPathology(scansAreNew).subscribe(
        newlyAdded => {
        }, (error) => {
          console.log(error);
          this.errorMessage = error as any
        });
    }
  }
  addNewlyAddedRadiology() {
    const newlyAddedRadioscan = this.finalRadiologyList.filter(x => !this.radiologyList.includes(x));
    const scansAreNew = [];
    for (let key in newlyAddedRadioscan) {
      const tempScan = {};
      tempScan['radiology'] = newlyAddedRadioscan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew != null) {
      this.commonService.addToRadiology(scansAreNew).subscribe(
        newlyAdded => {
        }, (error) => {
          console.log(error);
          this.errorMessage = error as any
        });
    }
  }
  addNewlyAddedComplaints() {
    const newlyAddedComplaints = this.finalComplaintsList.filter(x => !this.complaintsList.includes(x));
    const complaintsAreNew = [];
    for (let key in newlyAddedComplaints) {
      const tempObservation = {};
      tempObservation['complaints'] = newlyAddedComplaints[key];
      complaintsAreNew.push(tempObservation);
    }
    if (complaintsAreNew != null) {
      this.commonService.addToComplaints(complaintsAreNew).subscribe(
        newlyAdded => {
        }, (error) => {
          console.log(error);
          this.errorMessage = error as any
        });
    }
  }
  addNewlyAddedObservations() {
    const newlyAddedObservations = this.finalObservationsList.filter(x => !this.observationsList.includes(x));
    const observationsAreNew = [];
    for (let key in newlyAddedObservations) {
      const tempObservation = {};
      tempObservation['observations'] = newlyAddedObservations[key];
      observationsAreNew.push(tempObservation);
    }
    if (observationsAreNew != null) {
      this.commonService.addToObservations(observationsAreNew).subscribe(
        newlyAdded => {
        }, (error) => {
          console.log(error);
          this.errorMessage = error as any
        });
    }
  }
  addNewlyAddedDiagnosis() {
    const newlyAddedDiagnosis = this.finalDiagnosisList.filter(x => !this.diagnosisList.includes(x));
    const diagnosisNew = [];
    for (let key in newlyAddedDiagnosis) {
      const tempDiagnosis = {} as Diagnosis;
      tempDiagnosis.diagnosis = newlyAddedDiagnosis[key];
      diagnosisNew.push(tempDiagnosis);
    }
    if (diagnosisNew != null) {
      this.commonService.addToDiagnosisDictionary(diagnosisNew).subscribe(
        newlyAdded => {
        }, (error) => {
          console.log(error);
          this.errorMessage = error as any
        });
    }
  }
  goToVisitDetails() {
    this.router.navigate(['/patients', this.visit.patient.id, 'visits', this.visit.id, 'detail']);
  }
}
