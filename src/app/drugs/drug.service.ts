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
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Drug} from './drug';
import {HttpClient} from '@angular/common/http';
import {HandleError, HttpErrorHandler} from '../error.service';
import {catchError} from 'rxjs/internal/operators';


@Injectable()
export class DrugService {
  entityUrl = environment.REST_API_URL + 'drugs';

  private readonly handlerError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) {
    this.handlerError = httpErrorHandler.createHandleError('PatientService');
  }

  getDrugs(): Observable<Drug[]> {
    return this.http.get<Drug[]>(this.entityUrl)
      .pipe(
        catchError(this.handlerError('getDrugs', []))
      );
  }

  getDrugById(drugId: string): Observable<Drug> {
    return this.http.get<Drug>((this.entityUrl + '/' + drugId))
      .pipe(
        catchError(this.handlerError('getDrugById', {} as Drug))
      );
  }

  updateDrug(drugId: string, drug: Drug): Observable<Drug> {
    return this.http.put<Drug>(this.entityUrl + '/' + drugId, drug)
      .pipe(
        catchError(this.handlerError('updateDrug', drug))
      );
  }

  addDrug(drug: Drug): Observable<Drug> {
    return this.http.post<Drug>(this.entityUrl, drug)
      .pipe(
        catchError(this.handlerError('addDrug', drug))
      );
  }

  uploadDrugs(drugs: Drug[]): Observable<Drug[]> {
    return this.http.post<Drug[]>(this.entityUrl + '/upload', drugs)
    .pipe(
      catchError(this.handlerError('uploadDrugs', drugs))
    );
  }

  deleteDrug(drugId: string): Observable<number> {
    return this.http.delete<number>(this.entityUrl + '/' + drugId)
      .pipe(
        catchError(this.handlerError('deleteDrug', 0))
      );
  }

}
