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
import * as XLSX from 'xlsx';
import { Drug } from '../drug';
import { Router } from '@angular/router';
import { DrugService } from '../drug.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-drug-add',
  templateUrl: './drug-add.component.html',
  styleUrls: ['./drug-add.component.css']
})
export class DrugAddComponent implements OnInit {
  drug: Drug;
  drugsList: Drug[];
  selectedForm: string;
  errorMessage: string;
  drugsForms: String[];

  drugForm: FormGroup;
  public formBuilder: FormBuilder;
  formOfDrugs = 'formOfDrugs';
  formDropDown = "Form of Drug";
  fileUploaded: File;
  storeData: string | ArrayBuffer;
  worksheet: any;
  loader: boolean;

  constructor(private drugService: DrugService, private router: Router) {
    this.loader = false;
    this.drug = {} as Drug;
    this.selectedForm = {} as string;
    this.drugsList = [];
    this.formBuilder = new FormBuilder();
    this.drugsForms = ['Syrup',
      'Tablet',
      'Capsule',
      'Powder',
      'Injectable',
      'Cream',
      'Gel',
      'Lotion',
      'Liquid',
      'Inhaler',
      'Raspules'];
    this.drugForm = this.formBuilder.group({
      content: new FormControl('', [Validators.maxLength(60)]),
      brandName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      strength: new FormControl(),
      formOfDrugs: new FormControl('', [Validators.maxLength(100)])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.drugForm.controls[controlName].hasError(errorName);
  }
  ngOnInit() {
    // this.specialtyService.getradiology().subscribe(
    //   radiology => this.drugsList = radiology,
    //   error => this.errorMessage = error as any
    // );
  }

  onSubmit(drug: Drug) {
    this.loader = true;
    drug.id = null;
    this.drugService.addDrug(drug).subscribe(
      newDrug => {
        this.drug = newDrug;
        this.gotoDrugList();
      },
      error => this.errorMessage = error as any
    );
  }
  compareFormFn(c1: String, c2: String): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }
  gotoDrugList() {
    this.loader = false;
    this.router.navigate(['/drugs']);
  }
  uploadedFile(e) {
    const fileName = e.target.files[0].name;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    this.loader = true;
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      let drugs: Drug[];
      drugs = jsonData[Object.keys(jsonData)[0]];
      console.log(drugs);
      this.drugService.uploadDrugs(drugs).subscribe(
        res => {
          this.gotoDrugList();
        },
        error => this.errorMessage = error as any
      );
    };
    reader.readAsBinaryString(e.target.files[0]);
  }

  onCancel() {
    this.router.navigate(['/drugs']);
  }
}
