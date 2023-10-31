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

@Injectable()
export class CommonService {

  entityUrl = environment.REST_API_URL;

  private readonly handlerError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) {
    this.handlerError = httpErrorHandler.createHandleError('CommonService');
  }
  addUser(username: any, password: any, enable: number, roles: any) {
    const requestPayload = {
      username: username,
      password: password,
      enabled: true,
      roles: [
        {
          id: null,
          name: roles[0]
        }
      ]
    }
    return this.http
      .post<any>("http://doctorsnehalayucare-env.eba-pfv3bz7q.ap-south-1.elasticbeanstalk.com/clinic/users", requestPayload)
      .pipe(
        catchError(this.handlerError('addUser', []))
      );
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
  getAllComplaints(): Observable<string[]> {
    return this.http.get<string[]>(environment.REST_API_URL + 'complaints')
      .pipe(
        catchError(this.handlerError('getAllComplaints', []))
      );
  }
  addToDiagnosisDictionary(newDiagnosisList): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'diagnosisDictionary', newDiagnosisList)
      .pipe(
        catchError(this.handlerError('addToDiagnosisDictionary', newDiagnosisList)
        )
      );
  }
  addToPathology(newScans): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'pathology', newScans)
      .pipe(
        catchError(this.handlerError('addToPathology', newScans)
        )
      );
  }
  addToRadiology(newScans): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'radiology', newScans)
      .pipe(
        catchError(this.handlerError('addToRadiology', newScans)
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
  addToKnownCase(knownCasesAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'knownCases', knownCasesAreNew)
      .pipe(
        catchError(this.handlerError('addToKnownCase', knownCasesAreNew)
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
  removeFromRadiology(scansAreRemoved: any[]): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'radiology/delete', scansAreRemoved)
      .pipe(
        catchError(this.handlerError('removeFromRadiology', scansAreRemoved)
        )
      );
  }
  getPathology(): Observable<any[]> {
    return this.http.get<any[]>(environment.REST_API_URL + 'pathology')
      .pipe(
        catchError(this.handlerError('getPathology', []))
      );
  }
  removeFromPathology(scansAreRemoved: any[]): Observable<any[]> {
    return this.http.post<any[]>(environment.REST_API_URL + 'pathology/delete', scansAreRemoved)
      .pipe(
        catchError(this.handlerError('removeFromPathology', scansAreRemoved)
        )
      );
  }
  removeFromDrugAllergies(drugAllergiesRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'drugAllergies/delete', drugAllergiesRemoved)
      .pipe(
        catchError(this.handlerError('removeFromDrugAllergies', drugAllergiesRemoved)
        )
      );
  }
  removeFromOtherAllergies(otherAllergiesRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'otherAllergies/delete', otherAllergiesRemoved)
      .pipe(
        catchError(this.handlerError('removeFromDrugAllergies', otherAllergiesRemoved)
        )
      );
  }
  removeFromObservations(observationsAreRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'observations/delete', observationsAreRemoved)
      .pipe(
        catchError(this.handlerError('removeFromObservations', observationsAreRemoved)
        )
      );
  }
  addToComplaints(complaintsAreNew: any[]) {
    return this.http.post<any[]>(environment.REST_API_URL + 'complaints', complaintsAreNew)
      .pipe(
        catchError(this.handlerError('addToComplaints', complaintsAreNew)
        )
      );
  }
  removeFromComplaints(complaintsAreRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'complaints/delete', complaintsAreRemoved)
      .pipe(
        catchError(this.handlerError('removeFromComplaints', complaintsAreRemoved)
        )
      );
  }
  removeFromDiagnosis(diagnosisAreRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'diagnosisDictionary/delete', diagnosisAreRemoved)
      .pipe(
        catchError(this.handlerError('removeFromComplaints', diagnosisAreRemoved)
        )
      );
  }
  removeFromKnownCases(knownCasesAreRemoved: any[]): Observable<any> {
    return this.http.post<any[]>(environment.REST_API_URL + 'knownCases/delete', knownCasesAreRemoved)
    .pipe(
      catchError(this.handlerError('removeFromKnownCases', knownCasesAreRemoved)
      )
    );
  }

}