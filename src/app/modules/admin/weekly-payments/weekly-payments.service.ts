import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WeeklyPaymentService
{
    public _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    set data$(value)
    {
        this._data.next(value);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(payload): Observable<any>
    {
        return this._httpClient.post(environment.API_ENDPOINT + 'v1/weeklypayment', payload).pipe(
            tap((response: any) => {
                this._data.next(response['result']);
            })
        );
    }

    fetch(payload)
    {
        return this._httpClient.post(environment.API_ENDPOINT + 'v1/weeklypayment', payload);
    }

    /**
     * set data
     */
     setData(data: any)
     {
        this._data.next(data);
     }

     sendData(payload) {
        return this._httpClient.post(environment.API_ENDPOINT + 'v1/weeklypayment/send', payload);
     }

     approve(id) {
        return this._httpClient.get(environment.API_ENDPOINT + 'v1/weeklypayment/approveByAdmin/' + id);
     }
}


