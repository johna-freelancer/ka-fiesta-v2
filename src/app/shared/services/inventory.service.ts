import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
    /**
     *
     */
    constructor(
    private _http: HttpClient
    ) {
    }

    list(payload) {
      return this._http.post(environment.API_ENDPOINT + 'inventory/list', payload);
    }
}


