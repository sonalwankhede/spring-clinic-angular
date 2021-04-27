import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-preliminary-diagnosis',
  templateUrl: './preliminary-diagnosis.component.html',
  styleUrls: ['./preliminary-diagnosis.component.css']
})
export class PreliminaryDiagnosisComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  diagnosis: string;

  textareaDiagnosis = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.diagnosis = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getDiagnosisDictionary().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a.diagnosis; });
        this.diagnosis = data.toString();
        this.textareaDiagnosis.setValue(data.toString());
        this.textareaDiagnosis.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaDiagnosis.disabled) {
      this.textareaDiagnosis.enable();
    } else {
      this.textareaDiagnosis.disable();
    }
  }
  save() {
    if (this.textareaDiagnosis && this.textareaDiagnosis.value && this.textareaDiagnosis.value !== null) {
      this.loader = true;
      this.textareaDiagnosis.disable();
      this.showError = false;
      forkJoin([this.addToList(),
      this.deleteToList()]).subscribe(res => {
        this.ngOnInit();
      });
    } else {
      this.showError = true;
    }
  }
  deleteToList(): Observable<any> {
    let removedDiagnosisScan = this.diagnosis.split(',').filter(x => !this.textareaDiagnosis.value.split(',').includes(x));
    removedDiagnosisScan = removedDiagnosisScan.map(function (el) {
      return el.trim();
    });
    const diagnosisAreRemoved = [];
    for (let key in removedDiagnosisScan) {
      const tempScan = {};
      tempScan['diagnosis'] = removedDiagnosisScan[key];
      diagnosisAreRemoved.push(tempScan);
    }
    if (diagnosisAreRemoved.length > 0) {
      return this.commonService.removeFromDiagnosis(diagnosisAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedDiagnosisScan = this.textareaDiagnosis.value.split(',').filter(x => !this.diagnosis.includes(x));
    newlyAddedDiagnosisScan = newlyAddedDiagnosisScan.map(function (el) {
      return el.trim();
    });
    const diagnosisAreNew = [];
    for (let key in newlyAddedDiagnosisScan) {
      const tempScan = {};
      tempScan['diagnosis'] = newlyAddedDiagnosisScan[key];
      diagnosisAreNew.push(tempScan);
    }
    if (diagnosisAreNew.length > 0) {
      return this.commonService.addToDiagnosisDictionary(diagnosisAreNew);
    } else {
      return of({});
    }
  }
}
