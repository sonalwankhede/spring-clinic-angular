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

import {Injectable} from '@angular/core';
import {Patient} from './patient';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {HandleError, HttpErrorHandler} from '../error.service';


@Injectable()
export class PatientService {

  entityUrl = environment.REST_API_URL + 'patients';

  private readonly handlerError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) {
    this.handlerError = httpErrorHandler.createHandleError('PatientService');
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.entityUrl)
      .pipe(
        catchError(this.handlerError('getPatients', []))
      );
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(this.entityUrl + '/' + patientId)
      .pipe(
          catchError(this.handlerError('getPatientById', {} as Patient))
      );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.entityUrl, patient)
      .pipe(
        catchError(this.handlerError('addPatient', patient))
      );
  }

  updatePatient(patientId: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(this.entityUrl + '/' + patientId, patient)
      .pipe(
        catchError(this.handlerError('updatePatient', patient))
      );
  }

  deletePatient(patientId: number): Observable<{}> {
    return this.http.delete<Patient>(this.entityUrl + '/' + patientId)
      .pipe(
         catchError(this.handlerError('deletePatient', [patientId]))
      );
  }


}
