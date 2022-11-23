import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WeeklyPaymentService } from './weekly-payments.service';

@Injectable({
    providedIn: 'root'
})
export class WeeklyPaymentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _weeklypaymentservice: WeeklyPaymentService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        const payload = {length: 10, start: 0, merchant_id: -1, status: 'all', date_from: null, date_to: null, search: ''};
        return this._weeklypaymentservice.getData(payload);
    }
}
