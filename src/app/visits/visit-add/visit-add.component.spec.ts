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

import {VisitAddComponent} from './visit-add.component';
import {FormsModule} from '@angular/forms';
import {VisitService} from '../visit.service';
import {PatientService} from '../../patients/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {Patient} from '../../patients/patient';
import {Observable, of} from 'rxjs';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Spy = jasmine.Spy;

class PatientServiceStub {
  addPatient(patient: Patient): Observable<Patient> {
    return of();
  }
  getPatientById(patientId: string): Observable<Patient> {
    return of();
  }
}

class VisitServiceStub {
}

describe('VisitAddComponent', () => {
  let component: VisitAddComponent;
  let fixture: ComponentFixture<VisitAddComponent>;
  let patientService: PatientService;
  let visitService: VisitService;
  let testPatient: Patient;
  let spy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: PatientService, useClass: PatientServiceStub},
        {provide: VisitService, useCLass: VisitServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitAddComponent);
    component = fixture.componentInstance;
    testPatient = {
      id: 1,
      firstName: 'Leo',
      lastName: 'Test',
      address: '',
      city: '',
      telephone: '090909090',
      birthDate: '2010-09-07',
      visits: null
    };
    patientService = fixture.debugElement.injector.get(PatientService);
    visitService = fixture.debugElement.injector.get(VisitService);
    spy = spyOn(patientService, 'addPatient')
      .and.returnValue(of(testPatient));

    fixture.detectChanges();
  });

  it('should create VisitAddComponent', () => {
    expect(component).toBeTruthy();
  });
});
