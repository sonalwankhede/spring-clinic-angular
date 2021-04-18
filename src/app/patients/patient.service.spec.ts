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

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
// Other imports
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {HttpErrorHandler} from '../error.service';

import {PatientService} from './patient.service';
import {Patient} from './patient';
import {Type} from '@angular/core';

describe('OnwerService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let patientService: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and its dependencies
      providers: [
        PatientService,
        HttpErrorHandler
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
    patientService = TestBed.get(PatientService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// PatientService method tests begin ///

  describe('#getPatients', () => {
    let expectedPatients: Patient[];

    beforeEach(() => {
      patientService = TestBed.get(PatientService);
      expectedPatients = [
        { id: 1, firstName: 'A' },
        { id: 2, firstName: 'B' },
      ] as Patient[];
    });

    it('should return expected patients (called once)', () => {

      patientService.getPatients().subscribe(
        patients => expect(patients).toEqual(expectedPatients, 'should return expected patients'),
        fail
      );

      // PatientService should have made one request to GET patients from expected URL
      const req = httpTestingController.expectOne(patientService.entityUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock patients
      req.flush(expectedPatients);
    });
  });

});
