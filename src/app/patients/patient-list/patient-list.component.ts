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

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material'
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from '../../common-component/dialog/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../common-component/dialog/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from '../../common-component/dialog/confirm-dialog/confirm-dialog.component';
import { ViewChild } from '@angular/core';
import { TableUtil } from '../../util/table-data-util';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  errorMessage: string;
  patients: Patient[];
  dataSource = new MatTableDataSource<Patient>();
  showTable: boolean = false;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  public displayedColumns = ['name', 'gender', 'age', 'address', 'telephone', 'update', 'delete'];

  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRefAlert: MatDialogRef<AlertDialogComponent>;
  loader: boolean;

  constructor(private router: Router, private patientService: PatientService,
    public dialog: MatDialog) {
    this.patients = [];
  }

  ngOnInit() {
    this.loader = true;
    this.patientService.getPatients().subscribe(
      patients => {
        this.patients = patients;
        this.dataSource.data = patients as Patient[];
        this.showTable = true;
        this.loader = false;
    }, (error) => {
      this.patients = [];
      this.dataSource = new MatTableDataSource<Patient>();
      this.loader = false;
      this.errorMessage = 'There was an issue while this patient list or no patients in the system. Please try adding a new patient';
      console.log(this.errorMessage);
      console.log(error);
    });
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
  exportTable() {
    const drugsData: Partial<Patient>[] = this.dataSource.data.map(x => ({
      firstName: x.firstName,
      middleName: x.middleName,
      lastName: x.lastName,
      gender: x.gender,
      age: x.age,
      address: x.address,
      city: x.city,
      drugAllergies: x.drugAllergies,
      otherAllergies: x.otherAllergies,
      history: x.history
    }));
    TableUtil.exportArrayToExcel(drugsData, "All_Patients");
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
    const message = `Are you sure you want to permanently delete this patient?`;
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
        }, (error) => {
          this.patients = [];
          this.dataSource = new MatTableDataSource<Patient>();
          console.log(error);
          this.errorMessage = 'There was an issue while this deleting patient. Please retry';
          const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
            data: dialogData
          });
          this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
            const result = dialogResult;
            if (result) {
              this.router.navigate(['/patients']);
            }
          });
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


