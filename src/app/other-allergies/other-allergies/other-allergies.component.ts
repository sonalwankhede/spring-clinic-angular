import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-other-allergies',
  templateUrl: './other-allergies.component.html',
  styleUrls: ['./other-allergies.component.css']
})
export class OtherAllergiesComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  otherAllergies: string;

  textareaOtherAllergies = new FormControl({ value: null, disabled: true });

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getOtherAllergies().subscribe (res=> {
      if(res) {
        const data = res.map(function(a) {return a['allergy'];});
        this.otherAllergies = data.toString();
        this.textareaOtherAllergies.setValue(data.toString());
        this.textareaOtherAllergies.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaOtherAllergies.disabled) {
      this.textareaOtherAllergies.enable();
    } else {
      this.textareaOtherAllergies.disable();
    }
  }
  save() {
    this.loader = true;
    this.textareaOtherAllergies.disable();
    forkJoin([this.addToList(),
    this.deleteToList()]).subscribe(res => {
      this.ngOnInit();
    });
  }
  deleteToList(): Observable<any> {
    let removedOtherAllergiesScan = this.otherAllergies.split(',').filter(x => !this.textareaOtherAllergies.value.split(',').includes(x));
    removedOtherAllergiesScan = removedOtherAllergiesScan.map(function (el) {
      return el.trim();
    });
    const scansAreRemoved = [];
    for (let key in removedOtherAllergiesScan) {
      const tempScan = {};
      tempScan['allergy'] = removedOtherAllergiesScan[key];
      scansAreRemoved.push(tempScan);
    }
    if (scansAreRemoved.length > 0) {
      return this.commonService.removeFromOtherAllergies(scansAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedOtherAllergiesScan = this.textareaOtherAllergies.value.split(',').filter(x => !this.otherAllergies.includes(x));
    newlyAddedOtherAllergiesScan = newlyAddedOtherAllergiesScan.map(function (el) {
      return el.trim();
    });
    const scansAreNew = [];
    for (let key in newlyAddedOtherAllergiesScan) {
      const tempScan = {};
      tempScan['allergy'] = newlyAddedOtherAllergiesScan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew.length > 0) {
      return this.commonService.addToOtherAllergies(scansAreNew);
    } else {
      return of({});
    }
  }
}

