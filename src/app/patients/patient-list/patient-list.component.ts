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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material'
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from '../../common-component/dialog/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from '../../common-component/dialog/confirm-dialog/confirm-dialog.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, AfterViewInit {
  errorMessage: string;
  patients: Patient[];
  dataSource = new MatTableDataSource<Patient>();
  showTable: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public displayedColumns = ['name', 'gender', 'age', 'address', 'telephone', 'update', 'delete'];

  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  loader: boolean;

  constructor(private router: Router, private patientService: PatientService,
    public dialog: MatDialog) {
    this.patients = [];
  }

  ngOnInit() {
    this.patients = [];
    this.patientService.getPatients().subscribe(
      patients => {
        this.patients = patients,
          this.dataSource.data = patients as Patient[];
        error => this.errorMessage = error as any;
        this.showTable = true;
      });
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  custom() {
    const ELEMENT_DATA = [];
    this.patients.forEach(value => {
      ELEMENT_DATA.push(value);
    })
    this.dataSource.data = ELEMENT_DATA;
  }

  onSelect(patient: Patient) {
    this.router.navigate(['/patients', patient.id]);
  }

  addPatient() {
    this.router.navigate(['/patients/add']);
  }

  redirectToPatientDetail(patientId: number) {
    this.patientService.getPatientById(patientId).subscribe(res => {
      this.router.navigate(['/patients', patientId]);
    });
  }
  redirectToAddVisit(patientId: number) {
    this.router.navigate(['/patients', patientId, 'visits', 'add']);
  }
  redirectToDelete(patientId: number) {
    const message = `Are you sure you want to delete this patient?`;
    const dialogData = new ConfirmDialogModel("Delete Patient?", message);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    this.dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result) {
        this.loader = true;
        this.patientService.deletePatient(patientId).subscribe(res => {
          this.loader = false;
          this.ngOnInit();
        });
      }
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
