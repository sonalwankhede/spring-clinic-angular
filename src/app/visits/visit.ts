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

import { Patient } from '../patients/patient';
import { PrescriptedDrugs } from './visit-add/visit-add.component';

export interface Visit {
  id: number;
  visitDate: string;
  temperature: number,
  pulse: number,
  spo2: number,
  respirationRate: number,
  bloodPressure: number,
  height: number,
  weight: number,
  bmi: number,
  complaints: string;
  observations: string;
  diagnosis: string;
  pathology: string;
  radiology: string;
  patient: Patient;
  prescription: PrescriptedDrugs[];
}
