import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/shared/interfaces/pagination';
import { User } from 'app/shared/interfaces/user';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private _isClickable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject<Pagination | null>(null);
  private url = environment.API_ENDPOINT;

  constructor(private _http: HttpClient) { 

  }

  // Getter for _users
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }

  // Getter for _user
  get user$(): Observable<User | null> {
    return this._user.asObservable();
  }

  // Getter for _isClickable
  get isClickable$(): Observable<boolean> {
    return this._isClickable.asObservable();
  }

  // Getter for _isLoading
  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  // Getter for _pagination
  get pagination$(): Observable<Pagination | null> {
    return this._pagination.asObservable();
  }
1
  getUsers(page: number = 1, limit: number = 10, status?: string, role?: string, search?: string): Observable<{data: User[], pagination: Pagination}> {
    return this._http.post<{data: User[], pagination: Pagination}>(this.url + 'user/list', {
      page, limit
    })
      .pipe(
        tap(res => {
          this._users.next(res.data);
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of(error.error);
        })
      );
  }
}
