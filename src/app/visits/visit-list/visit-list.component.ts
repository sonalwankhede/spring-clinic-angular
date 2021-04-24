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

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Patient } from 'app/patients/patient';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { TableUtil } from 'app/util/table-data-util';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css']
})
export class VisitListComponent implements AfterViewInit {

  visits: Visit[];
  responseStatus: number;
  noVisits = false;
  errorMessage: string;
  dataSource = new MatTableDataSource<Visit>();
  showTable: boolean = false;
  pageNumber: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public displayedColumns = ['visitDate', 'complaints', 'observations', 'diagnosis', 'temperature', 'pulse', 'spo2', 'respirationRate', 'bloodPressure', 'height', 'weight', 'bmi', 'viewVisitDetails', 'delete'];
  patientId: any;
  patient: Patient;
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRefAlert: MatDialogRef<AlertDialogComponent>;
  sortedData: Visit[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loader: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private visitService: VisitService,
    public dialog: MatDialog) {
    this.visits = [];
    this.patientId = this.route.snapshot.params.id;
    this.visitService.getVisitsByPatientId(this.patientId).subscribe(
      visits => {
        this.visits = visits,
          this.sortedData = this.visits.slice();
        this.patient = this.visits[0].patient;
        this.dataSource.data = this.sortedData as Visit[];
        this.showTable = true;
      }, (error) => {
        this.visits = [];
        this.dataSource = new MatTableDataSource<Visit>();
        this.loader = false;
        console.log(error);
        this.errorMessage = 'There are either no previous visits for this patient or an issue occurred while fetching them. Please try adding new visit.';
        console.log(this.errorMessage);
        // const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        // this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
        //   data: dialogData
        // });
        // this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
        //   const result = dialogResult;
        //   if (result) {
        //     this.loader = false;
        //   }
        // });
      });
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'visitDate': {
          let newDate = new Date(item.visitDate);
          return newDate;
        }
        default: {
          return item[property];
        }
      }
    };
  }
  exportTable() {
    const drugsData: Partial<Visit>[] = this.dataSource.data.map(x => ({
      visitDate: x.visitDate,
      complaints: x.complaints,
      temperature: x.temperature,
      pulse: x.pulse,
      spo2: x.spo2,
      respirationRate: x.respirationRate,
      bloodPressure: x.bloodPressure,
      height: x.height,
      weight: x.weight,
      observations: x.observations,
      diagnosis: x.diagnosis
    }));
    TableUtil.exportArrayToExcel(drugsData, 'All_Visits');
  }
  loadPage() {
    this.patientId = this.route.snapshot.params.id;
    this.visits = [];
    this.visitService.getVisitsByPatientId(this.patientId).subscribe(
      visits => {
        this.visits = visits,
          this.sortedData = this.visits.slice();
        this.patient = this.visits[0].patient;
        this.dataSource.data = this.sortedData as Visit[];
        this.dataSource.sort = this.sort;
        this.showTable = true;
        this.loader = false;
      }, (error) => {
        this.visits = [];
        this.dataSource = new MatTableDataSource<Visit>();
        this.loader = false;
        console.log(error);
        this.errorMessage = 'There are either no previous visits for this patient or an issue occurred while fetching them. Please try adding new visit.';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
          }
        });
      });
    this.dataSource.paginator = this.paginator;
  }
  public compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  custom() {
    const ELEMENT_DATA = [];
    this.visits.forEach(value => {
      ELEMENT_DATA.push(value);
    })
    // this.paginator.pageIndex = this.pageNumber, // number of the page you 
    this.dataSource.data = ELEMENT_DATA;

  }
  editVisit(visit: Visit) {
    this.router.navigate(['/visits', visit.id, 'edit']);
  }
  addVisit() {
    this.router.navigate(['/patients', this.patientId, 'visits', 'add']);
  }
  deleteVisit(visit: Visit) {
    this.visitService.deleteVisit(visit.id.toString()).subscribe(
      response => {
        this.responseStatus = response;
        console.log('delete success');
        this.visits.splice(this.visits.indexOf(visit), 1);
        if (this.visits.length === 0) {
          this.noVisits = true;
        }
      }, (error) => {
        console.log(error);
        this.errorMessage = 'There was an issue deleting this visit. Please retry';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
            this.loadPage();
          }
        });
      });
  }
  redirectVisitDetail(visit: Visit) {
    this.router.navigate(['/patients', this.patient.id, 'visits', visit.id, 'detail']);
  }
  redirectToDelete(visit: Visit) {
    const message = `Are you sure you want to permanently delete this visit?`;
    const dialogData = new ConfirmDialogModel("Delete Visit?", message);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    this.dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result) {
        this.loader = true;
        this.visitService.deleteVisit(visit.id.toString()).subscribe(res => {
          this.loader = false;
          this.loadPage();
        }, (error) => {
          console.log(error);
          this.errorMessage = 'There was an issue deleting this visit. Please retry';
          const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
            data: dialogData
          });
          this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
            const result = dialogResult;
            if (result) {
              this.loadPage();
            }
          });
        });
      }
    });
  }
}

