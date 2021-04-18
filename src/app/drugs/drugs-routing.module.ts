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

import {RouterModule, Routes} from '@angular/router';
import {DrugListComponent} from './drug-list/drug-list.component';
import {DrugAddComponent} from './drug-add/drug-add.component';
import {DrugEditComponent} from './drug-edit/drug-edit.component';
import {NgModule} from '@angular/core';
import {DrugResolver} from './drug-resolver';

const drugRoutes: Routes = [
  {path: 'drugs', component: DrugListComponent},
  {path: 'drugs/add', component: DrugAddComponent},
  {path: 'drugs/:id/edit', component: DrugEditComponent, resolve: {drug: DrugResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(drugRoutes)],
  exports: [RouterModule]
})

export class DrugsRoutingModule {
}
