import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Observable, of, forkJoin } from 'rxjs';


@Component({
  selector: 'app-pathology',
  templateUrl: './pathology.component.html',
  styleUrls: ['./pathology.component.css']
})
export class PathologyComponent implements OnInit {

  title = 'Pathology Details';
  indicativeMessage = '(Please add new tests with comma separation.)';
  errorMessage = 'Pathological tests list can not be empty';

  loader: boolean;
  editable: boolean;
  pathology: string;

  // textareaPathology = new FormControl({ value: null, disabled: true });
  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.pathology = '';
  }

  ngOnInit() {
    this.loader = true;
    this.commonService.getPathology().subscribe(res => {
      if (res) {
        const data = res.map(function (a) { return a.pathology; });
        this.pathology = data.toString();
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    });
  }

  save(changes: any) {
    forkJoin(
      [this.addToList(changes),
      this.deleteToList(changes)])
      .subscribe(res => {
        this.ngOnInit();
      });
  }

  deleteToList(changes): Observable<any> {
    let removedPathologyScan = this.pathology.split(',').filter(x => !changes.split(',').includes(x));
    removedPathologyScan = removedPathologyScan.map(function (el) {
      return el.trim();
    });
    const scansAreRemoved = [];
    for (let key in removedPathologyScan) {
      const tempScan = {};
      tempScan['pathology'] = removedPathologyScan[key];
      scansAreRemoved.push(tempScan);
    }
    if (scansAreRemoved.length > 0) {
      return this.commonService.removeFromPathology(scansAreRemoved);
    } else {
      return of({});
    }
  }
  addToList(changes): Observable<any> {
    let newlyAddedPathologyScan = changes.split(',').filter(x => !this.pathology.includes(x));
    newlyAddedPathologyScan = newlyAddedPathologyScan.map(function (el) {
      return el.trim();
    });
    const scansAreNew = [];
    for (let key in newlyAddedPathologyScan) {
      const tempScan = {};
      tempScan['pathology'] = newlyAddedPathologyScan[key];
      scansAreNew.push(tempScan);
    }
    if (scansAreNew.length > 0) {
      return this.commonService.addToPathology(scansAreNew);
    } else {
      return of({});
    }
  }
}
