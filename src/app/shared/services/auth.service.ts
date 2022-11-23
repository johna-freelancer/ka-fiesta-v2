import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import jwt_decode from "jwt-decode";
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    /**
     *
     */
     constructor(
        private _http: HttpClient
      ) {
      }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token: string): void{
        localStorage.setItem('token', token);
    }

    getUser() {
      return JSON.parse(localStorage.getItem('user'));
    }

    setUser(user: any): void{
        localStorage.setItem('user', user);
    }
    login(credentials: any) {
        return this._http.post(environment.API_ENDPOINT + '/v1/login', credentials);
    }

    isAuthenticated() {
      var token = this.getToken();
      if (token) {
          if(this.sessionExpired()) {
              return false;
          }
          return true;
      }
      return false;
    }

    sessionExpired() {
      var token = this.getToken();

      var decoded = <any>jwt_decode(token);
      var expiry = new Date(decoded.exp * 1000);
      if(new Date() > expiry) {
          return true;
      }
      return false;
    }

    logout(){
      return this._http.get(environment.API_ENDPOINT + '/v1/auth/logout');
    }
}


