import { environment } from './../../environments/environment';
import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Driver } from './../model/driver';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private record:Driver;
  private records:any[];

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getDrivers(): Observable<Driver[] | HttpErrorResponse> {
    return this.http.get<Driver[]>(`${this.host}/driver/list`);
  }



  public getDriver(id): Observable<Driver | HttpErrorResponse> {
    return this.http.get<Driver>(`${this.host}/driver/get/${id}`);
  }

  public addRecord(record: Driver): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/driver/add`, record);
  }

  public updatRecord(record: Driver): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/driver/update`, record);
  }
}
