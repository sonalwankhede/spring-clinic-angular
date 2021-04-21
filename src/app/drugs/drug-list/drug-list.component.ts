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

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Drug } from '../drug';
import { DrugService } from '../drug.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css']
})
export class DrugListComponent implements OnInit, AfterViewInit {
  drugs: Drug[];
  errorMessage: string;
  responseStatus: number;
  dataSource = new MatTableDataSource<Drug>();
  showTable: boolean = false;

  public displayedColumns = ['content', 'brandName', 'strength', 'form', 'update', 'delete'];
  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  loader: boolean;

  constructor(private drugService: DrugService, private router: Router, public dialog: MatDialog) {
    this.drugs = [];
  }

  ngOnInit() {
    this.drugs = [];
    this.drugService.getDrugs().subscribe(
      drugs => {
        this.drugs = drugs,
        this.dataSource.data = drugs as Drug[];
        error => this.errorMessage = error as any;
        this.showTable = true;
      });
      this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteDrug(drugId: string) {
    const message = `Are you sure you want to delete this drug?`;
    const dialogData = new ConfirmDialogModel("Delete Drug?", message);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    this.dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result) {
        this.loader = true;
        this.drugService.deleteDrug(drugId).subscribe(response => {
          this.loader = false;
          this.ngOnInit();
        },
          error => this.errorMessage = error as any);
      }
    });
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }

  addDrug() {
    this.router.navigate(['/drugs/add']);
  }

  custom() {
    const ELEMENT_DATA = [];
    this.drugs.forEach(value => {
      ELEMENT_DATA.push(value);
    })
    this.dataSource.data = ELEMENT_DATA;
  }

  editDrug(drug: number) {
    this.router.navigate(['/drugs', drug, 'edit']);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
