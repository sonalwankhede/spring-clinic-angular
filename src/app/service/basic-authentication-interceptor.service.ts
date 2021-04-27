import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token'); // you probably want to store it in localStorage or something

    if (localStorage.getItem('username') && localStorage.getItem('token')) {
      req = req.clone({
        headers: req.headers.set('Authorization', `${token}`),
      })
    }
    return next.handle(req);
  }
}