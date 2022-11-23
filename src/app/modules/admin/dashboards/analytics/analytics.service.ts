import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getCollectableAmount(payload)
    {
        return this._httpClient.post(environment.API_ENDPOINT + '/v1/dashboard/getTotalCollectable', payload);
    }
    
    getCollectedAmount(payload)
    {
        return this._httpClient.post(environment.API_ENDPOINT + '/v1/dashboard/getTotalCollected', payload);
    }

    getActiveMerchantCount()
    {
        return this._httpClient.get(environment.API_ENDPOINT + '/v1/dashboard/getActiveMerchantCount');
    }

    getCompletedTransactions() 
    {
        return this._httpClient.get(environment.API_ENDPOINT + '/v1/dashboard/getNumberOfCompletedOrders');
    }
}
