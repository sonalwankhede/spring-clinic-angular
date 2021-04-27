import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-known-case',
  templateUrl: './known-case.component.html',
  styleUrls: ['./known-case.component.css']
})
export class KnownCaseComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  knownCases: string;

  textareaKnownCases = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.knownCases = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getKnownCase().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a['issues'] });
        this.knownCases = data.toString();
        this.textareaKnownCases.setValue(data.toString());
        this.textareaKnownCases.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaKnownCases.disabled) {
      this.textareaKnownCases.enable();
    } else {
      this.textareaKnownCases.disable();
    }
  }
  save() {
    if (this.textareaKnownCases && this.textareaKnownCases.value && this.textareaKnownCases.value !== null) {
      this.loader = true;
      this.textareaKnownCases.disable();
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
    let removedKnownCases = this.knownCases.split(',').filter(x => !this.textareaKnownCases.value.split(',').includes(x));
    removedKnownCases = removedKnownCases.map(function (el) {
      return el.trim();
    });
    const knownCasesAreRemoved = [];
    for (let key in removedKnownCases) {
      const temp = {};
      temp['issues'] = removedKnownCases[key];
      knownCasesAreRemoved.push(temp);
    }
    if (knownCasesAreRemoved.length > 0) {
      return this.commonService.removeFromKnownCases(knownCasesAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedKnownCases = this.textareaKnownCases.value.split(',').filter(x => !this.knownCases.includes(x));
    newlyAddedKnownCases = newlyAddedKnownCases.map(function (el) {
      return el.trim();
    });
    const knownCasesAreNew = [];
    for (let key in newlyAddedKnownCases) {
      const temp = {};
      temp['issues'] = newlyAddedKnownCases[key];
      knownCasesAreNew.push(temp);
    }
    if (knownCasesAreNew.length > 0) {
      return this.commonService.addToKnownCase(knownCasesAreNew);
    } else {
      return of({});
    }
  }
}
