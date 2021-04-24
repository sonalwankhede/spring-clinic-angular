/*
 *
 *  * Copyright 2016-2018 the original author or authors.
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
import { Drug } from '../drug';
import { DrugService } from '../drug.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-drug-edit',
  templateUrl: './drug-edit.component.html',
  styleUrls: ['./drug-edit.component.css']
})
export class DrugEditComponent implements OnInit {
  drugEditForm: FormGroup;
  idCtrl: FormControl;
  drugNameCtrl: FormControl;
  brandNameCtrl: FormControl;
  strengthCtrl: FormControl;
  contentCtrl: FormControl;
  drug: Drug;
  errorMessage: string;
  formOfDrugsCntrl: FormControl;

  formOfDrugs = 'formOfDrugs';

  drugsForms = ['Syp', 'Tab', 'Cap', 'Pow', 'Inj', 'Crm', 'Gel', 'Lot', 'Liq', 'Inh', 'Ras'];

  formDropDown = "Form of Drug";
  loader: boolean;
  dialogRef: MatDialogRef<AlertDialogComponent>;

  constructor(private formBuilder: FormBuilder,
    private drugService: DrugService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    this.drug = {} as Drug;
    this.buildForm();
  }

  buildForm() {
    this.idCtrl = new FormControl(null);
    this.drugEditForm = this.formBuilder.group({
      content: new FormControl('', [Validators.maxLength(60)]),
      brandName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      strength: new FormControl(),
      formOfDrugs: new FormControl('', [Validators.maxLength(100)])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.drugEditForm.controls[controlName].hasError(errorName);
  }
  compareSpecFn(c1: string, c2: string): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  ngOnInit() {
    // we use SpecResolver and DrugResolver (get data before init component)
    this.drugService.getDrugById(this.route.snapshot.params.id).subscribe(res => {
      this.drug = res;
      this.drugEditForm.controls.content.setValue(this.drug.content);
      this.drugEditForm.controls.brandName.setValue(this.drug.brandName);
      this.drugEditForm.controls.strength.setValue(this.drug.strength);
      this.drugEditForm.controls.formOfDrugs.setValue(this.drug.formOfDrugs);
    });
  }

  onSubmit(drug: Drug) {
    this.loader = true;
    this.drugService.updateDrug(this.drug.id.toString(), drug).subscribe(
      res => {
        console.log('update success');
        this.gotoDrugList();
      }, (error) => {
        console.log(error);
        this.errorMessage = 'There was an issue while editing this drug. Please retry';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRef = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRef.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
            this.router.navigate(['/drugs', drug.id, 'edit']);
          }
        });
      });
  }

  gotoDrugList() {
    this.router.navigate(['/drugs']);
  }

}
