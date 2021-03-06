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

/* tslint:disable:no-unused-variable */

/**
 * @author Sonal Wankhede
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {DrugAddComponent} from './drug-add.component';
import {FormsModule} from '@angular/forms';

describe('DrugAddComponent', () => {
  let component: DrugAddComponent;
  let fixture: ComponentFixture<DrugAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
// TODO complete test
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
});
