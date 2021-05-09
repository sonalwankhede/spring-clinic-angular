import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment';

export class User {  
  constructor(public status: string) {}
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  entityUrl = environment.REST_API_URL;

  constructor(private httpClient: HttpClient) {}
// Provide username and password for authentication, and once authentication is successful, 
//store JWT token in session
  authenticate(username, password) {
    return this.httpClient
      .post<any>(this.entityUrl +  "authenticate", { "username":username, password })
      .pipe(
        map(userData => {
          localStorage.setItem("username", username);
          let tokenStr = "Bearer " + userData.jwt;
          localStorage.setItem("token", tokenStr);
          return userData;
        })
      );
  }

  isUserLoggedIn() {
    let user = localStorage.getItem("username");
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    localStorage.removeItem("username");
  }
}