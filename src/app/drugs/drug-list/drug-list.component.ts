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
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { TableUtil } from '../../util/table-data-util';
import { SelectionModel } from '@angular/cdk/collections';
import { MultiPurposeDialogComponent, MultiPurposeConfirmDialogModel } from 'app/common-component/dialog/multi-purpose-dialog/multi-purpose-dialog.component';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css']
})
export class DrugListComponent implements OnInit {
  drugs: Drug[];
  errorMessage: string;
  responseStatus: number;
  dataSource = new MatTableDataSource<Drug>();
  showTable: boolean = false;

  public displayedColumns = ['content', 'brandName', 'strength', 'form', 'update', 'delete', 'select'];
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  exporting: boolean;
  brandNameFilter: string;
  contentFilter: string;
  dialogRefAlert: MatDialogRef<AlertDialogComponent>;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  sortedData: Drug[];
  @ViewChild(MatSort, { static: true }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'content': {
          let newDate = new Date(item.content);
          return newDate;
        }
        default: {
          return item[property];
        }
      }
    };
  }
  selection = new SelectionModel<Drug>(true, []);
  loader: boolean;

  constructor(private drugService: DrugService, private router: Router, public dialog: MatDialog) {
    this.drugs = [];
  }

  ngOnInit() {
    this.loader = true;
    this.drugService.getDrugs().subscribe(
      (drugs) => {
        this.drugs = drugs;
        this.drugs.sort((a, b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0))
        this.dataSource = new MatTableDataSource(this.drugs);
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.content.toLowerCase().includes(filter)
            || data.brandName.toLowerCase().includes(filter)
            || data.formOfDrugs.toString().includes(filter);
        };
        this.showTable = true;
        this.loader = false;
      },
      (error) => {
        this.drugs = [];
        this.dataSource = new MatTableDataSource<Drug>();
        this.loader = false;
        console.log(error);
        this.errorMessage = 'There was an issue while fetching drugs list or no drugs in the system. Please try adding a new drug.';
        console.log(this.errorMessage);
      });
  }
  clearFilters() {
    this.dataSource.filter = '';
    this.contentFilter = '';
    this.brandNameFilter = '';
    this.selection.clear();
  }
  exportTable() {
    this.exporting = true;
    if (this.selection.hasValue()) {
      let data: Drug[] = [];
      let dataSourceTemp = new MatTableDataSource<Drug>();
      this.selection.selected.forEach(item => {
        data.push(item);
        dataSourceTemp = new MatTableDataSource<Drug>(data);
      });
      this.exportData(dataSourceTemp, 'Partial_Drugs');
    } else {
      this.exportData(this.dataSource, 'All_Drugs')
    }
  }
  exportData(dataSource: MatTableDataSource<Drug>, arg1: string) {
    const drugsData: Partial<Drug>[] = dataSource.data.map(x => ({
      content: x.content,
      brandName: x.brandName,
      strength: x.strength,
      formOfDrugs: x.formOfDrugs
    }));
    TableUtil.exportArrayToExcel(drugsData, arg1);
    this.exporting = false;
  }
  removeSelectedRows() {
    const message = `Are you sure you want to permanently delete these drugs?`;
    const dialogData = new ConfirmDialogModel("Delete Drugs?", message);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    this.dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result) {
        this.loader = true;
        const data = Object.assign([]);
        this.selection.selected.forEach(item => {
          data.push(item.id);
        });
        this.drugService.deleteDrugs(data).subscribe(res => {
          this.selection.clear();
          this.ngOnInit();
        }, (error) => {
          console.log(error);
          this.errorMessage = 'There was an issue while deleting drug(s). Please retry';
          const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
            data: dialogData
          });
          this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
            const result = dialogResult;
            if (result) {
              this.clearFilters();
              this.router.navigate(['/drugs']);
            }
          });
        });
      }
    });
  }
  updateSelectedRows() {
    const message = `What field do you want to update?`;
    const dialogData = new MultiPurposeConfirmDialogModel("Update Drug?", message, ['Drug Content', 'Brand Name', 'Strength', 'Form']);
    this.dialogRef = this.dialog.open(MultiPurposeDialogComponent, {
      data: dialogData
    });
    this.dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result[0]) {
        this.loader = true;
        const selectedField = this.getFieldName(result[1]);
        const newValue = result[2];
        const data = Object.assign([]);
        this.selection.selected.forEach(item => {
          data.push(item.id);
        });
        this.drugService.updateDrugs(data, selectedField, newValue).subscribe(res => {
          this.selection.clear();
          this.ngOnInit();
        }, (error) => {
          console.log(error);
          this.errorMessage = 'There was an issue while updating drug(s). Please retry';
          const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
            data: dialogData
          });
          this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
            const result = dialogResult;
            if (result) {
              this.clearFilters();
              this.router.navigate(['/drugs']);
            }
          });
        });
      }
    });
  }
  getFieldName(fieldName: String): string {
    switch (fieldName) {
      case 'Drug Content':
        return 'content';
      case 'Brand Name':
        return 'brand_name';
      case 'Strength':
        return 'strength';
      case 'Form':
        return 'form_of_drugs';
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows: number;
    if (this.dataSource.filter) {
      numRows = this.dataSource.filteredData.length;
    } else {
      numRows = this.dataSource.data.length;
    }
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }
  deleteDrug(drugId: string) {
    const message = `Are you sure you want to permanently delete this drug?`;
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
        }, (error) => {
          this.drugs = [];
          this.dataSource = new MatTableDataSource<Drug>();
          console.log(error);
          this.errorMessage = 'There was an issue while deleting drug(s). Please retry';
          const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, {
            data: dialogData
          });
          this.dialogRefAlert.afterClosed().subscribe(dialogResult => {
            const result = dialogResult;
            if (result) {
              this.clearFilters();
              this.router.navigate(['/drugs']);
            }
          });
        });
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

  applyFilter(filterValue: string, filterName: string) {
    if (filterName === 'content') {
      this.contentFilter = filterValue;
    } else if (filterName === 'brandName') {
      this.brandNameFilter = filterValue;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Drug, filter: string) =>
      data[filterName].toLowerCase().indexOf(filter) != -1;
    this.dataSource.filter = filterValue;
  }

}
