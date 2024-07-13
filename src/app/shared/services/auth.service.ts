import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import jwt_decode from "jwt-decode";
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { Bearer } from '../interfaces/bearer';
import { Router } from '@angular/router';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private _isClickable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private url = environment.API_ENDPOINT;

  /**
   *
   */
  constructor(private _http: HttpClient, private _router: Router) { }

  // User getters
  user$(): Observable<User | null> {
    return this._user.asObservable();
  }

  user(): User | null {
    return this._user.value;
  }

  // isClickable getters
  isClickable$(): Observable<boolean> {
    return this._isClickable.asObservable();
  }

  isClickable(): boolean {
    return this._isClickable.value;
  }

  // isLoading getters
  isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  isLoading(): boolean {
    return this._isLoading.value;
  }
  
  /**
   * Login
   * @return User
   */
  login(credentials: {email: string, password: string}): Observable<{
    status: string,
    data: {
      bearer: Bearer,
      user: User
    },
    message: string
  }> {
    return this._http.post<{
      status: string,
      data: {
        bearer: Bearer,
        user: User
      },
      message: string
    }>(this.url + 'login', credentials).pipe(
      tap(response => {
        if (response.status === 'failed') {
          return
        }

        if (this.setAuthFromLocalStorage(response.data.bearer)) {
          this._user.next(response.data.user);
          const redirectURL = response.data.user.role === 'admin' ? '/dashboard/analytics' : '/stores';
          this._router.navigateByUrl(redirectURL);
        }
      }),
      catchError(err => {
        console.log(err);
        return of(err.error);
      })
    );
  }

  logout(): Observable<{
    status: string,
    data: null,
    message: string,
  }> {
    return this._http.get<{
      status: string,
      data: null,
      message: string,
    }>(this.url + 'auth/logout').pipe(
      tap(res => {
        this._user.next(null);
        localStorage.clear();
        this._router.navigate(['sign-in']);
      })
    )
  }

  /**
   * Load the user if the website is refreshed.
   * @return User
   */
  load(): Observable<{
    status: string
    data: User | null,
    message: string
  }> {
    const bearer = this.getAuthFromLocalStorage();
    if (!bearer || this.isTokenExpired(bearer)) {
      localStorage.clear();
      this._user.next(null);
      this._router.navigate(['sign-in']);
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${bearer.token}`,
    });

    return this._http.get<{
      status: string
      data: User | null,
      message: string
    }>(this.url + 'auth/me', {headers: httpHeaders}).pipe(
      tap(res => {
        this._user.next(res.data);
        return res.data;
      }),
      catchError(err => {
        console.error(err.error);
        return of(err.error);
      })
    )
  }

  /**
   * Set bearer in local storage
   * @return null
   */
  private setAuthFromLocalStorage(bearer: Bearer) {
    if (!bearer) {
      return false;
    }

    localStorage.setItem('auth', JSON.stringify(bearer));
    return true;
  }

  /**
   * Get Bearer Token from local storage
   * @return Bearer token
   */
  private getAuthFromLocalStorage(): Bearer | null {
    if (!localStorage.getItem('auth')) {
      return null
    }
    return JSON.parse(localStorage.getItem('auth'));
  }

  /**
   * Check if token is expired
   * @return boolean
   */
  private isTokenExpired(bearer: Bearer) {
    if (!bearer) {
      return true;
    }

    const date = new Date(0);
    date.setUTCSeconds(bearer.expires_in);

    if (!date) {
      return true;
    }

    // Check if the token is expired
    return !(date.valueOf() > new Date().valueOf() + 0 * 1000);
  }

}


