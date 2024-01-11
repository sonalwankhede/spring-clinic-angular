import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";

export class User {
  constructor(public status: string) {}
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) {}
// Provide username and password for authentication, and once authentication is successful, 
//store JWT token in session
  authenticate(username, password) {
    return this.httpClient
      .post<any>("http://localhost:5000/clinic/authenticate", { "username":username, password })
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
    return !(user === null);
  }

  logOut() {
    localStorage.removeItem("username");
  }
}