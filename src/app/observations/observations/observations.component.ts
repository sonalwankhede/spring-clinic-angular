import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';
@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  observations: string;

  textareaObservations = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.observations = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getAllObservations().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a['observations']; });
        this.observations = data.toString();
        this.textareaObservations.setValue(data.toString());
        this.textareaObservations.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaObservations.disabled) {
      this.textareaObservations.enable();
    } else {
      this.textareaObservations.disable();
    }
  }
  save() {
    if (this.textareaObservations && this.textareaObservations.value && this.textareaObservations.value !== null) {
      this.loader = true;
      this.textareaObservations.disable();
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
    let removedObservations = this.observations.split(',').filter(x => !this.textareaObservations.value.split(',').includes(x));
    removedObservations = removedObservations.map(function (el) {
      return el.trim();
    });
    const observationsAreRemoved = [];
    for (let key in removedObservations) {
      const temp = {};
      temp['observations'] = removedObservations[key];
      observationsAreRemoved.push(temp);
    }
    if (observationsAreRemoved.length > 0) {
      return this.commonService.removeFromObservations(observationsAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedObservations = this.textareaObservations.value.split(',').filter(x => !this.observations.includes(x));
    newlyAddedObservations = newlyAddedObservations.map(function (el) {
      return el.trim();
    });
    const observationsAreNew = [];
    for (let key in newlyAddedObservations) {
      const temp = {};
      temp['observations'] = newlyAddedObservations[key];
      observationsAreNew.push(temp);
    }
    if (observationsAreNew.length > 0) {
      return this.commonService.addToObservations(observationsAreNew);
    } else {
      return of({});
    }
  }
}
