import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {

  loader: boolean;
  editable: boolean;
  complaints: string;

  textareaComplaints = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.complaints = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getAllComplaints().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a['complaints']; });
        this.complaints = data.toString();
        this.textareaComplaints.setValue(data.toString());
        this.textareaComplaints.disable();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }
  click() {
    if (this.textareaComplaints.disabled) {
      this.textareaComplaints.enable();
    } else {
      this.textareaComplaints.disable();
    }
  }
  save() {
    if (this.textareaComplaints && this.textareaComplaints.value && this.textareaComplaints.value !== null) {
      this.loader = true;
      this.textareaComplaints.disable();
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
    let removedComplaintsScan = this.complaints.split(',').filter(x => !this.textareaComplaints.value.split(',').includes(x));
    removedComplaintsScan = removedComplaintsScan.map(function (el) {
      return el.trim();
    });
    const complaintsAreRemoved = [];
    for (let key in removedComplaintsScan) {
      const tempScan = {};
      tempScan['complaints'] = removedComplaintsScan[key];
      complaintsAreRemoved.push(tempScan);
    }
    if (complaintsAreRemoved.length > 0) {
      return this.commonService.removeFromComplaints(complaintsAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(): Observable<any> {
    let newlyAddedComplaintsScan = this.textareaComplaints.value.split(',').filter(x => !this.complaints.includes(x));
    newlyAddedComplaintsScan = newlyAddedComplaintsScan.map(function (el) {
      return el.trim();
    });
    const complaintsAreNew = [];
    for (let key in newlyAddedComplaintsScan) {
      const tempScan = {};
      tempScan['complaints'] = newlyAddedComplaintsScan[key];
      complaintsAreNew.push(tempScan);
    }
    if (complaintsAreNew.length > 0) {
      return this.commonService.addToComplaints(complaintsAreNew);
    } else {
      return of({});
    }
  }
}
