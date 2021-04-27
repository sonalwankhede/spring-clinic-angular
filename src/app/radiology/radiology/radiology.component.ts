import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.css']
})
export class RadiologyComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  radiology: string;

  textareaRadiology = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.radiology = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getRadiology().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a.radiology; });
        this.radiology = data.toString();
        this.textareaRadiology.setValue(data.toString());
        this.textareaRadiology.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaRadiology.disabled) {
      this.textareaRadiology.enable();
    } else {
      this.textareaRadiology.disable();
    }
  }
  save() {
    if (this.textareaRadiology && this.textareaRadiology.value && this.textareaRadiology.value !== null) {
      this.loader = true;
      this.textareaRadiology.disable();  
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
    let removedRadiologyScan = this.radiology.split(',').filter(x => !this.textareaRadiology.value.split(',').includes(x));
    removedRadiologyScan = removedRadiologyScan.map(function (el) {
      return el.trim();
    });
    const scansAreRemoved = [];
    for (let key in removedRadiologyScan) {
      const tempScan = {};
      tempScan['radiology'] = removedRadiologyScan[key];
      scansAreRemoved.push(tempScan);
    }
    if (scansAreRemoved.length > 0) {
      return this.commonService.removeFromRadiology(scansAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedRadiologyScan = this.textareaRadiology.value.split(',').filter(x => !this.radiology.includes(x));
    newlyAddedRadiologyScan = newlyAddedRadiologyScan.map(function (el) {
      return el.trim();
    });
    const scansAreNew = [];
    for (let key in newlyAddedRadiologyScan) {
      const tempScan = {};
      tempScan['radiology'] = newlyAddedRadiologyScan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew.length > 0) {
      return this.commonService.addToRadiology(scansAreNew);
    } else {
      return of({});
    }
  }
}
