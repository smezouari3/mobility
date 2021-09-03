import { environment } from './../../environments/environment';
import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Driver } from './../model/driver';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public addRecord(record: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/localisation/update`, record);
  }

}
