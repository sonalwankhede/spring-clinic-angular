import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-drug-allergies',
  templateUrl: './drug-allergies.component.html',
  styleUrls: ['./drug-allergies.component.css']
})
export class DrugAllergiesComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  drugAllergies: string;

  textareaDrugAllergies = new FormControl({ value: null, disabled: true });

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getDrugAllergies().subscribe (res=> {
      if(res) {
        const data = res.map(function(a) {return a['allergy'];});
        this.drugAllergies = data.toString();
        this.textareaDrugAllergies.setValue(data.toString());
        this.textareaDrugAllergies.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaDrugAllergies.disabled) {
      this.textareaDrugAllergies.enable();
    } else {
      this.textareaDrugAllergies.disable();
    }
  }
  save() {
    this.loader = true;
    this.textareaDrugAllergies.disable();
    forkJoin([this.addToList(),
    this.deleteToList()]).subscribe(res => {
      this.ngOnInit();
    });
  }
  deleteToList(): Observable<any> {
    let removedDrugAllergiesScan = this.drugAllergies.split(',').filter(x => !this.textareaDrugAllergies.value.split(',').includes(x));
    removedDrugAllergiesScan = removedDrugAllergiesScan.map(function (el) {
      return el.trim();
    });
    const scansAreRemoved = [];
    for (let key in removedDrugAllergiesScan) {
      const tempScan = {};
      tempScan['allergy'] = removedDrugAllergiesScan[key];
      scansAreRemoved.push(tempScan);
    }
    if (scansAreRemoved.length > 0) {
      return this.commonService.removeFromDrugAllergies(scansAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedDrugAllergiesScan = this.textareaDrugAllergies.value.split(',').filter(x => !this.drugAllergies.includes(x));
    newlyAddedDrugAllergiesScan = newlyAddedDrugAllergiesScan.map(function (el) {
      return el.trim();
    });
    const scansAreNew = [];
    for (let key in newlyAddedDrugAllergiesScan) {
      const tempScan = {};
      tempScan['allergy'] = newlyAddedDrugAllergiesScan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew.length > 0) {
      return this.commonService.addToDrugAllergies(scansAreNew);
    } else {
      return of({});
    }
  }
}
