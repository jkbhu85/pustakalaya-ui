import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('/ptk/') > -1) {
      const jwt = localStorage.getItem('json_web_token');
      if (jwt) {
        request = request.clone({
          setHeaders: {
            Authorization: jwt
          }
        });
      }
    }

    return next.handle(request);
  }
}
