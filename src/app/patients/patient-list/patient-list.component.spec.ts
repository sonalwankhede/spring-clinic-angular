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
import {By} from '@angular/platform-browser';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';

import {PatientListComponent} from './patient-list.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PatientService} from '../patient.service';
import {Patient} from '../patient';
import {Observable, of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {PartsModule} from '../../parts/parts.module';
import {ActivatedRouteStub} from '../../testing/router-stubs';
import {PatientDetailComponent} from '../patient-detail/patient-detail.component';
import {PatientsModule} from '../patients.module';
import {DummyComponent} from '../../testing/dummy.component';
import {PatientAddComponent} from '../patient-add/patient-add.component';
import {PatientEditComponent} from '../patient-edit/patient-edit.component';
import Spy = jasmine.Spy;


class PatientServiceStub {
  getPatients(): Observable<Patient[]> {
    return of();
  }
}

describe('PatientListComponent', () => {

  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let patientService = new PatientServiceStub();
  let spy: Spy;
  let de: DebugElement;
  let el: HTMLElement;


  const testPatient: Patient = {
    id: 1,
    firstName: 'George',
    lastName: 'Franklin',
    address: '110 W. Liberty St.',
    city: 'Madison',
    telephone: '6085551023',
    visits: null,
    birthDate: '2010-09-07',
  };
  let testPatients: Patient[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonModule, FormsModule, PartsModule, PatientsModule,
        RouterTestingModule.withRoutes(
          [{path: 'patients', component: PatientListComponent},
            {path: 'patients/add', component: PatientAddComponent},
            {path: 'patients/:id', component: PatientDetailComponent},
            {path: 'patients/:id/edit', component: PatientEditComponent}
          ])],
      providers: [
        {provide: PatientService, useValue: patientService},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testPatients = [{
      id: 1,
      firstName: 'George',
      lastName: 'Franklin',
      address: '110 W. Liberty St.',
      city: 'Madison',
      telephone: '6085551023',
      birthDate: '2010-09-07',
      visits: []
    }];

    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    patientService = fixture.debugElement.injector.get(PatientService);
    spy = spyOn(patientService, 'getPatients')
      .and.returnValue(of(testPatients));

  });

  it('should create PatientListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit() method', () => {
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(true, 'getPatients called');
  });


  it(' should show full name after getPatients observable (async) ', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => { // wait for async getPatients
      fixture.detectChanges();        // update view with name
      de = fixture.debugElement.query(By.css('.patientFullName'));
      el = de.nativeElement;
      expect(el.innerText).toBe((testPatient.firstName.toString() + ' ' + testPatient.lastName.toString()));
    });
  }));

});
