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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {

  }
  ngOnInit(): void {
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem('token');
        if (token == undefined) { // you can update this as per your key
          // DO LOGOUT FROM THIS TAB AS WELL
          this.router.navigate(['/']); // If you are using router
          // OR
          window.location.href = '';
        }
      }
    }, false);
  }

  hasUserLoggedIn(): boolean {
    if (localStorage.getItem('username') && localStorage.getItem('token')) {
      return true;
    }
  }
  logOut() {
    window.localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/welcome']);
    localStorage.clear();
  }
}
