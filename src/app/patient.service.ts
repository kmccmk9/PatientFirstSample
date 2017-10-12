import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PatientService {

  result: any;

  constructor(private _http: Http) { }

  getPatients() {
    return this._http.get('/api/patient');
  }

}
