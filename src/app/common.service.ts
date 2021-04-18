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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './error.service';
import { Allergy } from './allergies/allergy';


@Injectable()
export class CommonService {
 
  entityUrl = environment.REST_API_URL;

  private readonly handlerError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) {
    this.handlerError = httpErrorHandler.createHandleError('PatientService');
  }

  getDrugAllergies(): Observable<string[]> {
    return this.http.get<string[]>(this.entityUrl + 'drugAllergies')
      .pipe(
        catchError(this.handlerError('getDrugAllergies', []))
      );
  }

  getOtherAllergies(): Observable<string[]> {
    return this.http.get<string[]>(this.entityUrl + 'otherAllergies')
      .pipe(
        catchError(this.handlerError('getOtherAllergies', []))
      );
  }
  getDiagnosisDictionary(): Observable<any[]> {
    return this.http.get<any[]>(environment.REST_API_URL + 'diagnosisDictionary')
      .pipe(
        catchError(this.handlerError('getDiagnosisDictionary', []))
      );
  }

  getKnownCase(): Observable<string[]> {
    return this.http.get<string[]>(environment.REST_API_URL + 'knownCases')
      .pipe(
        catchError(this.handlerError('getKnownCase', []))
      );
  }
  getAllObservations(): Observable<string[]> {
    return this.http.get<string[]>(environment.REST_API_URL + 'observations')
      .pipe(
        catchError(this.handlerError('getAllObservations', []))
      );
  }
  addToDiagnosisDictionary(newDiagnosisList): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'diagnosisDictionary', newDiagnosisList)
      .pipe(
        catchError(this.handlerError('addToDiagnosisDictionary', newDiagnosisList)
        )
      );
  }
  addToObservations(observationsAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'observations', observationsAreNew)
    .pipe(
      catchError(this.handlerError('addToObservations', observationsAreNew)
      )
    );
  }
  addToComplaints(complaintsAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'knownCases', complaintsAreNew)
    .pipe(
      catchError(this.handlerError('addToComplaints', complaintsAreNew)
      )
    );
  }
  addToDrugAllergies(drugAllergiesAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'drugAllergies', drugAllergiesAreNew)
      .pipe(
        catchError(this.handlerError('addToDrugAllergies', drugAllergiesAreNew)
        )
      );
  }
  addToOtherAllergies(otherAllergiesAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'otherAllergies', otherAllergiesAreNew)
      .pipe(
        catchError(this.handlerError('addToOtherAllergies', otherAllergiesAreNew)
        )
      );
  }
  getAllDrugs(): Observable<any[]> {
    return this.http.get<any[]>(environment.REST_API_URL + 'drugs/list')
      .pipe(
        catchError(this.handlerError('getAllDrugs', []))
      );
  }

  getRadiology(): Observable<any[]> {
    return this.http.get<any[]>(environment.REST_API_URL + 'radiology')
      .pipe(
        catchError(this.handlerError('getRadiology', []))
      );
  }
  getPathology(): Observable<any[]> {
    return this.http.get<any[]>(environment.REST_API_URL + 'pathology')
      .pipe(
        catchError(this.handlerError('getPathology', []))
      );
  }
}