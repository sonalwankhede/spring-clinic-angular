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

 import {CommonModule} from '@angular/common';
 import {NgModule} from '@angular/core';
 import {FormsModule} from '@angular/forms';
 import {MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
 import { MatDatepickerModule } from '@angular/material/datepicker';
 import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
 import { MatFormFieldModule } from '@angular/material/form-field';
 import { MatInputModule } from '@angular/material/input';
 import { MatSliderModule } from '@angular/material/slider';
 import {MatChipsModule} from '@angular/material/chips';
 import { MatIconModule } from '@angular/material/icon';
 import { ReactiveFormsModule} from '@angular/forms';
 import { MatAutocompleteModule } from '@angular/material/autocomplete';
 import { MatSelectModule, MatCardModule, MatProgressSpinnerModule} from '@angular/material';
 import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { CommonTextAreaComponent } from './text-area/common-text-area.component';
 
 export const MY_DATE_FORMATS = {
   parse: {
     dateInput: 'YYYY/MM/DD',
   },
   display: {
     dateInput: 'YYYY/MM/DD',
     monthYearLabel: 'MM YYYY',
     dateA11yLabel: 'YYYY/MM/DD',
     monthYearA11yLabel: 'MM YYYY',
   },
 };
 
 @NgModule({
   imports: [
     CommonModule,
     FormsModule,
     MatDatepickerModule,
     MatMomentDateModule,
     MatSliderModule,
     MatFormFieldModule,
     MatInputModule,
     MatChipsModule,
     MatIconModule,
     ReactiveFormsModule,
     MatAutocompleteModule,
     MatSelectModule,
     MatCardModule,
     MatProgressSpinnerModule
   ],
   declarations: [
    CommonTextAreaComponent
   ],
   exports: [
    CommonTextAreaComponent,
     MatSliderModule,
     MatFormFieldModule,
     MatInputModule,
     MatChipsModule,
     MatIconModule,
     ReactiveFormsModule,
     MatAutocompleteModule,
     MatSelectModule
   ],
   providers: [
     {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
     {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
     { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
   ]
 })
 export class CommonTextAreaModule {
 }
 